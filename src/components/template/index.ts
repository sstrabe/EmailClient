import component from "./component.html";
import './styles.css';

const template = document.createElement('template');
template.innerHTML = component;

const styleSheet = new CSSStyleSheet();
document.addEventListener("DOMContentLoaded", () => {
    if (styleSheet.replace)
        styleSheet.replace(
            [...document.styleSheets].flatMap(
                sheet => [...sheet.cssRules].map(rule => rule.cssText)
            ).join(" ")
        );
    else
        for (const sheet of document.styleSheets)
            for (const rule of sheet.cssRules)
                styleSheet.insertRule(rule.cssText, styleSheet.cssRules.length);
});

class Component extends HTMLElement {
    constructor(
    
    ) {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [styleSheet];
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
    };

    disconnectedCallback() {
    };
};

window.customElements.define('component', Component);