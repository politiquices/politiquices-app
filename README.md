# politiquices-app

Frontend for [politiquices.pt](http://politiquices.pt) — a tool to explore relationships between Portuguese political personalities extracted from news articles.

Built with React + MUI + Vite. Talks to the [politiquices-api](https://github.com/politiquices/politiquices-api) backend.

## Features

- browse political personalities and their party affiliations
- explore support/opposition relationships as an interactive network graph
- compare two personalities head-to-head
- available in PT and EN

## Run locally

```bash
npm install
npm start
```

Needs the API running. Set the endpoint in `.env`:

```
VITE_POLITIQUICES_API=http://localhost:8000
```

## Build & deploy

```bash
npm run build
cp htaccess dist/.htaccess
rsync -avz --delete dist/ user@server:/var/www/html/politiquices/
```

## Related repos

- [politiquices-api](https://github.com/politiquices/politiquices-api) — REST API
- [SPARQL-endpoint](https://github.com/politiquices/SPARQL-endpoint) — knowledge base
