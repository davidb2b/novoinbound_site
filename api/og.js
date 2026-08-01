// Imagem de compartilhamento (og:image), 1200x630.
// O base64 esta dividido em doze partes pequenas para o envio via API ser verificavel.
// Se um dia voce subir og-novo-inbound.png de verdade, ele ganha prioridade.

const DADOS =
  require("./_og1") + require("./_og2") + require("./_og3") +
  require("./_og4") + require("./_og5") + require("./_og6") +
  require("./_og7") + require("./_og8") + require("./_og9") +
  require("./_og10") + require("./_og11") + require("./_og12");

module.exports = (req, res) => {
  const buf = Buffer.from(DADOS.replace(/[^A-Za-z0-9+/=]/g, ""), "base64");
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.setHeader("Content-Length", buf.length);
  res.end(buf);
};