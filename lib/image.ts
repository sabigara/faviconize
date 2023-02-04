import {
  IMagickImage,
  initializeImageMagick,
  Gravity,
  MagickGeometry,
  MagickColor,
  MagickFormat,
  AlphaOption,
  ImageMagick,
} from "https://deno.land/x/imagemagick_deno@0.0.14/mod.ts";
import { extname, join } from "https://deno.land/std@0.176.0/path/mod.ts";

await initializeImageMagick();

export function withCloneAndWrite(
  {
    image,
    filename,
  }: {
    image: IMagickImage;
    filename: string;
  },
  callback: (image: IMagickImage) => void
) {
  image.clone((image) => {
    callback(image);
    image.write((data) => {
      Deno.writeFileSync(filename, data);
    }, extname(filename).slice(1).toUpperCase() as MagickFormat);
  });
}

export function resize(image: IMagickImage, size: number) {
  image.resize(size, size);
}

export function makeIco(image: IMagickImage) {
  resize(image, 32);
  image.alpha(AlphaOption.Remove);
}

export function makeAppleTouchIcon(image: IMagickImage) {
  resize(image, 140);
  image.extent(
    new MagickGeometry(180),
    Gravity.Center,
    new MagickColor("white")
  );
}

type MakeFaviconsOptions = {
  source: Uint8Array;
  outdir: string;
  pngSizes: number[] | readonly number[];
};

export function makeFavicons({
  source,
  outdir,
  pngSizes,
}: MakeFaviconsOptions) {
  ImageMagick.read(source, (image: IMagickImage) => {
    pngSizes.forEach((size) => {
      withCloneAndWrite(
        { image, filename: join(outdir, `icon-${size}.png`) },
        (image) => resize(image, size)
      );
    });
    withCloneAndWrite({ image, filename: join(outdir, "icon.ico") }, makeIco);
    withCloneAndWrite(
      {
        image,
        filename: join(outdir, "apple-touch-icon.png"),
      },
      makeAppleTouchIcon
    );
  });
}
