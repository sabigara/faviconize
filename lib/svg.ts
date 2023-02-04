import { Resvg } from "npm:@resvg/resvg-js";

export function renderSvg(svg: Uint8Array, width: number): Uint8Array {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: width,
    },
  });
  return new Uint8Array(resvg.render().asPng());
}
