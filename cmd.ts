import {
  join,
  extname,
  resolve,
} from "https://deno.land/std@0.176.0/path/mod.ts";
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
    "Path to the source file. Available formats: [.png, .svg]",
    {
      required: true,
      value: (val) => {
        const supportedFormats = [".png", ".svg"];
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
  .option(
    "-o --output <output:file>",
    "Path to output a directory that contains the generated favicons.",
    {
      default: "." as const,
      value: (val) => {
        return resolve(join(val, "favicons"));
      },
    }
  )
  .action((options) => {
    console.log();
    console.log("⏱️ Generating favicons...");

    ensureDirSync(options.output);

    const isSvg = extname(options.input) === ".svg";
    let source = Deno.readFileSync(options.input);
    if (isSvg) {
      source = renderSvg(source, 512);
      Deno.copyFileSync(
        options.input,
        resolve(join(options.output, "icon.svg"))
      );
    }
    makeFavicons({
      source,
      outdir: options.output,
      pngSizes: [192, 512],
    });
    writeManifest(options.output);

    console.log("✨ Success!");

    console.log();
    console.log(
      "🛠  1. Favicons and webmanifest are generated at the below location. Put them in the root of the public directory of your website."
    );
    console.log(colors.cyan(resolve(options.output)));

    console.log();
    console.log("🛠  2. Append the following tags in the HTML <head>:");
    console.log(colors.cyan(html(isSvg)));
  })
  .parse(Deno.args);
