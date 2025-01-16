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

interface Elements {
    submitForm: HTMLFormElement
    sender: HTMLInputElement
    recipient: HTMLInputElement
    subject: HTMLInputElement
    content: HTMLTextAreaElement
    bcc: HTMLInputElement
    cc: HTMLInputElement
}

class ComposeEmail extends HTMLElement {
    constructor(
        public visible = true
    ) {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [styleSheet];
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    submitForm: HTMLFormElement | null = null;
    sender: HTMLInputElement | null = null;
    recipient: HTMLInputElement | null = null;
    subject: HTMLInputElement | null = null;
    content: HTMLTextAreaElement | null = null;
    bcc: HTMLInputElement | null = null;
    cc: HTMLInputElement | null = null;

    togglePrompt(visible: boolean) {
        this.confirmElements();
        const collapsables = this.shadowRoot?.querySelectorAll('.collapsable');

        if (!visible) {
            this.submitForm.style.height = '2rem';

            collapsables?.forEach((el: any) => {
                el.style.display = 'none';
            });
        } else {
            this.submitForm.style.height = '50%';

            collapsables?.forEach((el: any) => {
                el.style.display = 'block';
            });
        };
        this.visible = visible;
    }

    confirmElements(): asserts this is Elements {
        if (!this.submitForm || !this.sender || !this.recipient || !this.subject || !this.content || !this.bcc || !this.cc) throw new Error('Missing required Elements');
    }

    connectedCallback() {
        this.submitForm = this.shadowRoot?.getElementById('compose') as HTMLFormElement;
        this.sender = this.submitForm?.elements.namedItem('sender') as HTMLInputElement;
        this.recipient = this.submitForm?.elements.namedItem('recipient') as HTMLInputElement;
        this.subject = this.submitForm?.elements.namedItem('subject') as HTMLInputElement;
        this.content = this.submitForm?.elements.namedItem('content') as HTMLTextAreaElement;
        this.bcc = this.submitForm?.elements.namedItem('bcc') as HTMLInputElement;
        this.cc = this.submitForm?.elements.namedItem('cc') as HTMLInputElement;

        this.submitForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const sender = this.sender?.value;
            const recipient = this.recipient?.value;
            const subject = this.subject?.value;
            const content = this.content?.value;
            const bcc = this.bcc?.value;
            const cc = this.cc?.value;

            const token = localStorage.getItem('token')?.split(';') as string[];

            if (new Date(token[1].split('=')[1]) < new Date()) {
                alert('You are not logged in');
                localStorage.removeItem('token');
                return;
            };

            try {
                document.dispatchEvent(new CustomEvent('set-loading', { detail: true }))

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

                document.dispatchEvent(new CustomEvent('set-loading', { detail: false }));
            } catch(err) {
                document.dispatchEvent(new CustomEvent('set-loading', { detail: false }));
                document.dispatchEvent(new CustomEvent('set-error', { detail: `${err}` }));
            }
        });

        const topSpan: HTMLSpanElement = this.shadowRoot?.getElementById('compose-top') as HTMLSpanElement;
        topSpan.addEventListener('click', () => this.togglePrompt(!this.visible));

        document.addEventListener('compose-email', (event: any) => {
            this.confirmElements();

            const { recipient, cc, bcc, content, subject }:
                { recipient?: string, cc?: string, bcc?: string, content?: string, subject?: string } = event.detail ?? {};

            this.recipient.defaultValue = recipient ?? '';
            this.cc.defaultValue = cc ?? '';
            this.bcc.defaultValue = bcc ?? '';
            this.content.defaultValue = content ?? '';
            this.subject.defaultValue = subject ?? '';

            this.togglePrompt(true);
        })

        this.togglePrompt(false);
    }

    disconnectedCallback() {
    }
};

window.customElements.define('compose-email', ComposeEmail);