// src/view/dom.ts – kleiner Bauhelfer für HTML-Elemente

// Ein Attribut ist entweder ein Text, ein Ja/Nein oder eine Funktion für ein Ereignis.
type Attributwert = string | boolean | ((ereignis: Event) => void);
type Attribute = Record<string, Attributwert>;

export function el(
  tag: string,
  attribute: Attribute = {},
  ...kinder: (Node | string)[]
): HTMLElement {
  const element = document.createElement(tag);

  for (const [name, wert] of Object.entries(attribute)) {
    if (typeof wert === "function") {
      element.addEventListener(name, wert); // z. B. click, input, change
    } else if (typeof wert === "boolean") {
      if (wert) element.setAttribute(name, ""); // z. B. disabled, checked, selected
    } else {
      element.setAttribute(name, wert); // z. B. class, id, type, value
    }
  }

  for (const kind of kinder) {
    if (typeof kind === "string") {
      element.appendChild(document.createTextNode(kind));
    } else {
      element.appendChild(kind);
    }
  }

  return element;
}
