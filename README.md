# novoinbound.com.br

Manifesto do **Novo Inbound B2B**, por David Costa Lima e B2B Insiders.
Site estático de uma página só, sem build, sem framework e sem dependência de runtime.

---

## Como publicar na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** e escolha este repositório
3. Framework Preset: **Other**. Build Command: deixe vazio. Output Directory: deixe vazio (a raiz já é o site)
4. **Deploy**
5. Em **Settings → Domains**, adicione `novoinbound.com.br` e `www.novoinbound.com.br`
6. No seu registrador de domínio, aponte conforme a Vercel indicar (normalmente um `A` para o apex e um `CNAME` para o www)
7. Configure o redirecionamento de `www` para o apex, ou o contrário, mas escolha **um** e mantenha

A partir daqui, todo commit na branch `main` publica sozinho.

---

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | O site inteiro. HTML, CSS e JS num arquivo só. Não tem build |
| `manifesto.md` | A mesma íntegra em markdown. Serve para IA, wiki, documento interno e para quem for citar |
| `llms.txt` | Resumo estruturado do site para agentes. Evidência de uso real é baixa, mas o custo é zero |
| `robots.txt` | Libera explicitamente os bots de citação de IA. **Leia os comentários antes de mudar** |
| `sitemap.xml` | Duas URLs, com `lastmod`. Atualize a data quando editar o conteúdo |
| `vercel.json` | Headers de segurança, cache e `Content-Type` correto do `.md` |
| `og-novo-inbound.png` | Imagem de compartilhamento, 1200x630 |
| `david-costa-lima.jpg` | Retrato do autor, 640x640 |
| `favicon.svg` | Ícone da aba |

---

## Pendências antes de considerar publicado

- [ ] Confirmar o link da Formação: hoje aponta para `https://b2binsiders.com.br/formacao-e-mentoria/`
- [ ] Decidir o que acontece com a página equivalente no site da B2B Insiders. O caminho limpo é `301` para cá, para as duas não competirem no índice
- [ ] Cadastrar a propriedade no [Google Search Console](https://search.google.com/search-console) e enviar o sitemap
- [ ] Cadastrar no [Bing Webmaster Tools](https://www.bing.com/webmasters), que alimenta o Copilot
- [ ] Comprar `novoinboundb2b.com.br` como defensivo, apontando para cá

---

## Quando editar o conteúdo

Três lugares precisam andar juntos, senão o site e a marcação divergem:

1. O texto visível no `index.html`
2. O bloco `application/ld+json` no topo do `index.html` (perguntas frequentes e glossário são espelhos do texto visível)
3. O `manifesto.md`

E atualize `dateModified` no JSON-LD, `article:modified_time` na `<head>` e `lastmod` no `sitemap.xml`. Conteúdo com data recente é citado com mais frequência por mecanismos de IA.

---

## Sobre o `robots.txt`

Existem dois tipos de bot de IA e eles fazem coisas diferentes:

- **Bots de citação** (`OAI-SearchBot`, `ChatGPT-User`, `Claude-User`, `Claude-SearchBot`, `PerplexityBot`, `Perplexity-User`): buscam a página **na hora** em que alguém faz uma pergunta. Bloquear qualquer um destes tira o site das respostas de IA imediatamente.
- **Bots de treino** (`GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `Amazonbot`, `Meta-ExternalAgent`, `CCBot`): coletam conteúdo para treinar modelos futuros. Bloquear estes **não** afeta a citação de hoje.

Neste repositório os dois grupos estão liberados, por decisão editorial: o objetivo do manifesto é circular. Se um dia você quiser sair do treino sem perder citação, troque `Allow` por `Disallow` **apenas** no segundo grupo.
