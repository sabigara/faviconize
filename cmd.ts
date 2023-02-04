import { extname, resolve } from "https://deno.land/std@0.176.0/path/mod.ts";
import {
  Command,
  ValidationError,
} from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import { ensureDirSync } from "https://deno.land/std@0.176.0/fs/mod.ts";
import { makeFavicons } from "./lib/image.ts";
import { renderSvg } from "./lib/svg.ts";
import { writeManifest } from "./lib/manifest.ts";
import { html } from "./lib/html.ts";
import * as colors from "https://deno.land/std@0.123.0/fmt/colors.ts";

await new Command()
  .name("Faviconize")
  .version("0.0.1")
  .description("Generate favicons")
  .option(
    "-i --input <input:file>",
    "Source file. Available formats: [].png, .jpg, .svg]",
    {
      required: true,
      value: (val) => {
        const supportedFormats = [".png", ".jpg", ".svg"];
        const ext = extname(val);
        if (!supportedFormats.includes(ext.toLowerCase())) {
          throw new ValidationError(
            `Faviconize only supports [${supportedFormats}], but you passed: ${ext}`
          );
        }
        return val;
      },
    }
  )
  .option("-o --outdir <outdir:file>", "Directory to output favicons.", {
    default: "favicons" as const,
  })
  .action((options) => {
    console.log();
    console.log("⏱️ Generating favicons...");

    ensureDirSync(options.outdir);

    let source = Deno.readFileSync(options.input);
    if (extname(options.input) === ".svg") {
      source = renderSvg(source, 512);
    }
    makeFavicons({
      source,
      outdir: options.outdir,
      pngSizes: [192, 512],
    });
    writeManifest(options.outdir);

    console.log();
    console.log("✨ Favicons and manifest file are generated at:");
    console.log(colors.cyan(resolve(options.outdir)));
    console.log();
    console.log("🛠  Append the following tags in your HTML <head>:");
    console.log(colors.cyan(html));
  })
  .parse(Deno.args);
