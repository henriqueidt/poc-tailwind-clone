const parse5 = require("parse5");
import * as htmlparser2 from "parse5-htmlparser2-tree-adapter";
import { Iselectors } from "../types";

const appendEntrySelectorsToResult = (
  result: Iselectors,
  entry: Iselectors
) => {
  return {
    classes: [...result.classes, ...entry.classes],
  };
};

const getSelectorsFromNodes = (
  node: htmlparser2.Htmlparser2TreeAdapterMap["element"]
): Iselectors => {
  const { childNodes } = node;

  let result: Iselectors = {
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
): Iselectors => {
  let result: Iselectors = {
    classes: [],
  };

  for (const [key, value] of Object.entries(element.attribs)) {
    if (key === "class") {
      result.classes.push(...value.split(" "));
    }
  }

  return appendEntrySelectorsToResult(getSelectorsFromNodes(element), result);
};

const getSelectorsFromHtml = (html: string) => {
  const parsedHtml = parse5.parse(html, {
    treeAdapter: htmlparser2.adapter,
  });
  return getSelectorsFromNodes(parsedHtml);
};

export { getSelectorsFromHtml };
