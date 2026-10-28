// src/view/dom.ts – kleiner Bauhelfer für HTML-Elemente

// Ein Attribut ist entweder ein Text, ein Ja/Nein oder eine Funktion für ein Ereignis.
type Attribute = Record<string, string | boolean | ((ereignis: Event) => void)>;

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
  element.append(...kinder);
  return element;
}
