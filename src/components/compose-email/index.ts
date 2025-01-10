import component from "./component.html";

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

class ComposeEmail extends HTMLElement {
    constructor(
        public visible = true
    ) {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [styleSheet];
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const buttons = document.getElementsByClassName('open-composer');
        for (const button of buttons) {
            button.addEventListener('click', this.toggleVisibility)
        }
    }

    disconnectedCallback() {
        const buttons = document.getElementsByClassName('open-composer');
        for (const button of buttons) {
            button.removeEventListener('click', this.toggleVisibility)
        }
    }

    private toggleVisibility() {
        this.visible = !this.visible

        if (this.visible) {
            this.shadowRoot!.querySelector('template')!.style.display = 'none'
        } else {
            this.shadowRoot!.querySelector('template')!.style.display = 'flex'
        }
    }
};

window.customElements.define('compose-email', ComposeEmail);