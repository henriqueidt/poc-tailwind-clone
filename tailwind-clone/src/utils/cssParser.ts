import { parse, Root, Node, Rule, root } from "postcss";
import { Iselectors } from "../types";
import selectorParser, { Selector } from "postcss-selector-parser";

const shouldKeppSelector = (selector: Selector, selectors: Iselectors) => {
  for (const selectorNode of selector.nodes) {
    return selectors.classes.includes(selectorNode.value);
  }

  return false;
};

const evaluateCssRule = (node: Rule, selectors: Iselectors) => {
  const transform = (parsedSelectors: {
    walk: (arg0: (selector: any) => void) => void;
  }) => {
    parsedSelectors.walk((selector) => {
      if (selector.type !== "selector") {
        return;
      }

      const keepSelector = shouldKeppSelector(selector, selectors);

      if (!keepSelector) {
        selector.remove();
      }
    });
  };

  const processor = selectorParser(transform);

  node.selector = processor.processSync(node.selector);

  if (!node.selector) {
    node.remove();
  }
};

const getRelevantCss = (parsedCss: Root, selectors: Iselectors) => {
  // iterates over the node descendants
  parsedCss.walk((node) => {
    if (node.type === "rule") {
      evaluateCssRule(node, selectors);
    } else if (node.type === "atrule") {
      // TODO = Handle atrules
    }
  });

  const parsedResult = parsedCss.toResult();

  return parsedResult.toString();
};

const parseCss = (css: string, selectors: Iselectors) => {
  const parsedCss = parse(css);

  return getRelevantCss(parsedCss, selectors);
};

export { parseCss };
