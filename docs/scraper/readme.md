# Scraper

This directory contains the config to run the Typesense Docsearch scraper.

First you need to copy the `.env.example` file and fill in the values for your Typesense instance.

```bash

### Local usage

To populate a locally-running Typesense instance, change the `config.json` file to point to the locally-running docs site:

```json
{
  "start_urls": [
    "http://host.docker.internal:3000/"
  ],
  "sitemap_urls": [
    "http://host.docker.internal:3000/sitemap.xml"
  ],
  "allowed_domains": [
    "host.docker.internal"
  ]
}
```

Then run:

```bash
docker run -it --env-file=.env -e "CONFIG=$(cat config.json | jq -r tostring)" typesense/docsearch-scraper:0.7.0
```

