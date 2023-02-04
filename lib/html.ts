export const html = (hasSvg: boolean) =>
  `${
    hasSvg ? `<link rel="icon" href="/icon.svg" type="image/svg+xml">\n` : ""
  }<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">` as const;
