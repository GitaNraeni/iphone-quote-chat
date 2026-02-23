import https from "https";

export default function handler(req, res) {
  const params = new URLSearchParams(req.query).toString();
  const url = `https://brat.siputzx.my.id/iphone-quoted?${params}`;

  const upstreamReq = https.get(
    url,
    {
      headers: {
        "User-Agent": "Mozilla/5.0 (VercelServerless)",
        "Accept": "image/*,*/*;q=0.8",
      },
      timeout: 15000, // 15 detik biar gak ngaret
    },
    (upstreamRes) => {
      const status = upstreamRes.statusCode || 500;

      if (status < 200 || status >= 300) {
        let errBody = "";
        upstreamRes.on("data", (d) => (errBody += d.toString("utf8")));
        upstreamRes.on("end", () => {
          res.status(status).send(`Upstream error ${status}: ${errBody.slice(0, 200)}`);
        });
        return;
      }

      const chunks = [];
      upstreamRes.on("data", (chunk) => chunks.push(chunk));
      upstreamRes.on("end", () => {
        const buffer = Buffer.concat(chunks);
        res.setHeader("Content-Type", upstreamRes.headers["content-type"] || "image/png");
        res.setHeader("Content-Disposition", 'attachment; filename="generated-image.png"');
        res.setHeader("Cache-Control", "no-store");
        res.status(200).send(buffer);
      });
    }
  );

  upstreamReq.on("timeout", () => {
    upstreamReq.destroy(new Error("Upstream timeout"));
  });

  upstreamReq.on("error", (e) => {
    res.status(500).send(`Proxy failed: ${e.message}`);
  });
}
