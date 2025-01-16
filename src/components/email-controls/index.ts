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

class EmailControls extends HTMLElement {
    constructor(
        private currentEmailId: string
    ) {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [styleSheet];
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        document.addEventListener('email-selected', async (event) => {
            //@ts-expect-error type error
            this.currentEmailId = event.detail

            const hiddenGroups = this.shadowRoot?.querySelectorAll('.need-selected');
            if (this.currentEmailId) {
                //@ts-expect-error type error
                hiddenGroups.forEach((group: HTMLElement) => {group.style.display = 'flex'});
            } else {
                //@ts-expect-error type error
                hiddenGroups.forEach((group: HTMLElement) => {group.style.display = 'none'});
            }
        });

        this.shadowRoot?.querySelector('button#fetch')?.addEventListener('click', (e) => {
            document.dispatchEvent(new Event('fetch-emails'));
        });

        this.shadowRoot?.querySelector('button#compose')?.addEventListener('click', (e) => {
            document.dispatchEvent(new CustomEvent('compose-email'));
        });

        this.shadowRoot?.querySelector('button#reply')?.addEventListener('click', (e) => {
            const emailData = sessionStorage.getItem(this.currentEmailId);
            if (!emailData) return document.dispatchEvent(new CustomEvent('compose-email'));

            const email = JSON.parse(emailData);
            document.dispatchEvent(new CustomEvent('compose-email', {
                detail: {
                    recipient: email.from.address,
                    subject: `RE: ${email.subject}`
                }
            }));
        });

        this.shadowRoot?.querySelector('button#reply-all')?.addEventListener('click', (e) => {
            const emailData = sessionStorage.getItem(this.currentEmailId);
            if (!emailData) return document.dispatchEvent(new CustomEvent('compose-email'));

            const email = JSON.parse(emailData);
            document.dispatchEvent(new CustomEvent('compose-email', {
                detail: {
                    recipient: [email.from.address, ...email.to.map((c: any) => c.address)].join(','),
                    cc: email.cc ? email.cc.map((c: any) => c.address).join(',') : null,
                    subject: `RE: ${email.subject}`
                }
            }));
        });

        this.shadowRoot?.querySelector('button#forward')?.addEventListener('click', () => {
            const emailData = sessionStorage.getItem(this.currentEmailId)
            if (!emailData) return document.dispatchEvent(new CustomEvent('compose-email'));

            const email = JSON.parse(emailData);

            document.dispatchEvent(new CustomEvent('compose-email', {
                detail: {
                    content: `Begin forwarded message:\n\nFrom: ${email.from.name ? `${email.from.name} <${email.from.address}>` : email.from.address}\nSubject: ${email.subject}\nDate: ${new Date(email.date).toDateString()}\nTo: ${email.to[0].address}\n\n${email.content}`,
                    subject: `Fwd: ${email.subject}`
                }
            }))
        })

        this.shadowRoot?.querySelector('button#delete')?.addEventListener('click', async () => {
            const emailData = sessionStorage.getItem(this.currentEmailId);
            const token = localStorage.getItem('token')?.split(';') as string[];
            if (!emailData ||!token) return;

            const email = JSON.parse(emailData);
            await fetch('/api/emails', {
                method: 'DELETE',
                body: JSON.stringify({
                    mailbox: 'INBOX',
                    range: this.currentEmailId
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token[0]}`
                }
            });

            document.dispatchEvent(new Event('fetch-emails'));
        })
    };

    disconnectedCallback() {
    };
};

window.customElements.define('email-controls', EmailControls);