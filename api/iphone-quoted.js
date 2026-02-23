export default async function handler(req, res) {
  try {
    const params = new URLSearchParams(req.query).toString();
    const upstream = `https://brat.siputzx.my.id/iphone-quoted?${params}`;

    const r = await fetch(upstream);
    if (!r.ok) {
      return res.status(r.status).send("Upstream error");
    }

    const buffer = Buffer.from(await r.arrayBuffer());

    res.setHeader("Content-Type", r.headers.get("content-type") || "image/png");
    res.setHeader("Content-Disposition", 'attachment; filename="generated-image.png"');

    return res.status(200).send(buffer);
  } catch (e) {
    return res.status(500).send("Server error");
  }
}
