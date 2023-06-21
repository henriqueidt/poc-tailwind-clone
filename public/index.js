function createElement(type, props = {}, children = []) {
  return {
    type,
    props,
    children,
  };
}

function isVirtualElement(node) {
  return typeof node === "object" && node !== null;
}

function isText(node) {
  return typeof node === "string";
}

function serializeNode(node) {
  if (isVirtualElement(node)) {
    console.log("isvirtual");
    const { type, props, children } = node;
    const serializedProps = Object.keys(props)
      .map((key) => `${key}="${props[key]}"`)
      .join(" ");
    const serializedChildren = children.map(serializeNode).join("");
    return `<${type} ${serializedProps}>${serializedChildren}</${type}>`;
  }

  if (isText(node)) {
    return node.text;
  }

  return "";
}

function render(virtualNode, container) {
  const element = document.createElement(virtualNode.type);

  for (const [prop, value] of Object.entries(virtualNode.props)) {
    if (prop.startsWith("on") && typeof value === "function") {
      const event = prop.substring(2).toLowerCase();
      element.addEventListener(event, value);
    } else {
      element.setAttribute(prop, value);
    }
  }

  for (const child of virtualNode.children) {
    render(child, element);
  }

  container.appendChild(element);
}

let serializedDOM = "";

function createElementFromHTMLElement(element) {
  const { tagName, attributes } = element;
  const props = Array.from(attributes).reduce((acc, { name, value }) => {
    return { ...acc, [name]: value };
  }, {});
  const children = Array.from(element.children).map((child) =>
    createElementFromHTMLElement(child)
  );

  return createElement(tagName.toLowerCase(), props, children);
}

function updateHTMLContent(htmlContent) {
  const parser = new DOMParser();
  const newDOM = parser.parseFromString(htmlContent, "text/html");

  const form = newDOM.getElementById("myForm");

  const formChildren = Array.from(form.children).map((element) => {
    if (element.tagName === "INPUT") {
      const input = element;
      const value = serializedDOM[input.name];
      if (value) {
        input.value = value;
      }
    }
    return createElementFromHTMLElement(element);
  });

  const newSerializedDOM = serializeNode(
    createElement("form", { id: "myForm" }, formChildren)
  );

  console.log(newSerializedDOM, "chil;d");

  if (serializedDOM !== newSerializedDOM) {
    const root = document.getElementById("root");
    root.innerHTML = "";
    render(createElement("form", { id: "myForm" }, formChildren), root);
    serializedDOM = newSerializedDOM;
  }
}

const socket = new WebSocket("ws://localhost:3000");

// WebSocket message event handler
socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
  if (data.type === "reload" && data.htmlContent) {
    updateHTMLContent(data.htmlContent);
  }
});

// Initial app creation
// createApp();
