# Faviconize

## What's this

Generates necessary files for favicon from single .png or .svg, following [the article written by Andrey Sitnik](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs).

## Usage

You need `deno` command installed on your machine.

```bash
deno run --unstable --allow-read --allow-write --allow-ffi \
  "https://deno.land/x/faviconize/cmd.ts" \
  -i "path/to/icon.<svg or png>" \
  -o "path/to/outdir/"
```

`.svg` and `.png` are supported as the input format.


