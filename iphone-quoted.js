export default async function handler(req, res) {
  try {
    // Forward semua query parameter ke API asli
    const params = new URLSearchParams(req.query).toString();
    const upstream = `https://brat.siputzx.my.id/iphone-quoted?${params}`;

    const r = await fetch(upstream, { cache: "no-store" });
    if (!r.ok) {
      res.status(r.status).send("Upstream error");
      return;
    }

    const contentType = r.headers.get("content-type") || "image/png";
    const buf = Buffer.from(await r.arrayBuffer());

    res.setHeader("Content-Type", contentType);
    // Paksa jadi file download
    res.setHeader("Content-Disposition", 'attachment; filename="generated-image.png"');
    // Biar gak ke-cache
    res.setHeader("Cache-Control", "no-store");

    res.status(200).send(buf);
  } catch (e) {
    res.status(500).send("Server error");
  }
}
