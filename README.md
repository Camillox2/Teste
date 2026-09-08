# Grupo YR Hospitalar — Site React

Site institucional e catálogo inicial para venda e locação de equipamentos hospitalares, criado em React + Vite.

## Rodar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

## Contato e WhatsApp

Edite `src/config.js` e informe o número do WhatsApp somente com números, usando DDI + DDD. Se o campo `whatsapp` ficar vazio, os botões de cotação usam o e-mail configurado.

## Deploy na Vercel

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

Também é compatível com Netlify, Cloudflare Pages e hospedagem estática após o build.

## Imagens

A logo oficial enviada pelo responsável está em `public/yr-hospitalar-logo.jpg`. As fotos do catálogo foram obtidas, a pedido do responsável, de `https://vitalscheffer.com.br/revenda_curitiba/assets/` e são servidas localmente em WebP em `public/products/`. São referências visuais; modelos e disponibilidade devem ser confirmados na cotação.

## Domínio de produção

`https://site.grupoyrhospitalar.com.br` aponta para o projeto Vercel `grupo-yr-hospitalar`. A Cloudflare mantém o CNAME `site` para `1c937794c9e3afc3.vercel-dns-017.com` com DNS only. O domínio principal, `www`, `crm`, `api` e os registros de e-mail permanecem independentes.

O repositório GitHub é `Camillox2/Teste`, branch `main`. A função `/api/chat` usa `GEMINI_API_KEY` somente no servidor; configure a variável na Vercel. Não grave credenciais no código.
