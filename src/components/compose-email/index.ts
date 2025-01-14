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
        const submitForm: HTMLFormElement = this.shadowRoot?.getElementById('compose') as HTMLFormElement;
        submitForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const sender = (submitForm.elements.namedItem('sender') as HTMLInputElement).value;
            const recipient = (submitForm.elements.namedItem('recipient') as HTMLInputElement).value;
            const subject = (submitForm.elements.namedItem('subject') as HTMLInputElement).value;
            const content = (submitForm.elements.namedItem('content') as HTMLTextAreaElement).value;
            const bcc =  (submitForm.elements.namedItem('bcc') as HTMLInputElement).value;
            const cc =  (submitForm.elements.namedItem('cc') as HTMLInputElement).value;

            const token = localStorage.getItem('token')?.split(';') as string[]
            
            if (new Date(token[1].split('=')[1]) < new Date()) {
                alert('You are not logged in');
                localStorage.removeItem('token');
                return;
            };
            
            await fetch('/api/emails', {
                method: 'POST',
                body: JSON.stringify({
                    sender, recipient,
                    subject, content,
                    cc, bcc
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token[0]}`
                }
            });
        });

        const topSpan: HTMLSpanElement = this.shadowRoot?.getElementById('compose-top') as HTMLSpanElement;
        topSpan.addEventListener('click', () => {
            const collapsables = this.shadowRoot?.querySelectorAll('.collapsable');

            if (this.visible) {
                submitForm.style.height = '2rem';
                //@ts-ignore
                collapsables?.forEach((el: HTMLElement) => {
                    el.style.display = 'none';
                });
            } else {
                submitForm.style.height = '50%';
                //@ts-ignore
                collapsables?.forEach((el: HTMLElement) => {
                    el.style.display = 'block';
                });
            }
            this.visible = !this.visible;
        });

        topSpan.click();
    }

    disconnectedCallback() {
    }
};

window.customElements.define('compose-email', ComposeEmail);