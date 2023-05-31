export const minifyCss = (css: string): string => {
  const minifiedCss = css
    .replace(/([^0-9a-zA-Z\.#])\s+/g, "$1")
    .replace(/\s([^0-9a-zA-Z\.#]+)/g, "$1")
    // get rid of spaces next to non-alphanumerical (not a-z, A-Z, #, ., or 0-9) characters.
    .replace(/;}/g, "}")
    // get rid of semicolons where they're not needed (just before the end of a css declaration, the character })
    .replace(/\/\*.*?\*\//g, "");
  // get rid of comments

  return minifiedCss;
};
