// Imagem de compartilhamento (og:image), 1200x630.
// O base64 esta dividido em seis partes so para o envio ser verificavel.
// Se um dia voce subir og-novo-inbound.png de verdade, ele ganha prioridade.

const DADOS =
  require("./_og1") +
  require("./_og2") +
  require("./_og3") +
  require("./_og4") +
  require("./_og5") +
  require("./_og6");

module.exports = (req, res) => {
  const buf = Buffer.from(DADOS, "base64");
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.setHeader("Content-Length", buf.length);
  res.status(200).end(buf);
};
