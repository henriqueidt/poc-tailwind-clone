const parse5 = require("parse5");
import * as htmlparser2 from "parse5-htmlparser2-tree-adapter";

interface Iresult {
  classes: string[];
}

const appendEntrySelectorsToResult = (result: Iresult, entry: Iresult) => {
  return {
    classes: [...result.classes, ...entry.classes],
  };
};

const getSelectorsFromNodes = (
  node: htmlparser2.Htmlparser2TreeAdapterMap["element"]
): Iresult => {
  const { childNodes } = node;

  let result: Iresult = {
    classes: [],
  };

  for (const element of childNodes) {
    const { type } = element;
    if (type === "tag") {
      result = appendEntrySelectorsToResult(
        result,
        getSelectorsFromElement(element)
      );
    }
  }

  return result;
};

const getSelectorsFromElement = (
  element: htmlparser2.Htmlparser2TreeAdapterMap["element"]
): Iresult => {
  let result: Iresult = {
    classes: [],
  };

  for (const [key, value] of Object.entries(element.attribs)) {
    if (key === "class") {
      result.classes.push(...value.split(" "));
    }
  }

  return appendEntrySelectorsToResult(getSelectorsFromNodes(element), result);
};

function getSelectorsFromHtml(html: string) {
  const parsedHtml = parse5.parse(html, {
    treeAdapter: htmlparser2.adapter,
  });
  const result = getSelectorsFromNodes(parsedHtml);

  console.log("final result", result);
}

module.exports = getSelectorsFromHtml;
