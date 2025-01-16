import component from "./component.html";
import './styles.css';

const template = document.createElement('template');
template.innerHTML = component;

interface Address {
    name: string,
    address: string
}

interface Email {
    subject?: string
    from?: Address
    content?: string
    html?: string
    uid?: number
    to?: Address[]
    cc?: Address[]
    bcc?: Address[]
}

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

class EmailView extends HTMLElement {
    constructor(
        private headerVisible: boolean = true,
    ) {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [styleSheet];
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const frame = this.shadowRoot?.querySelector('iframe');
        const header = this.shadowRoot?.querySelector('header');
        const emailList = document.querySelector('.email-list') as HTMLElement;

        emailList.addEventListener('click', (event) => {
            event.preventDefault();

            //@ts-ignore
            const item = event.target?.closest('li') as HTMLElement;
            if (!item) return;
            const emailId = item.id;
            const email = JSON.parse(sessionStorage.getItem(emailId) || '') as Email;
            if (!email) return;

            document.dispatchEvent(new CustomEvent('email-selected', {
                detail: emailId
            }));

            const sender = header!.querySelector('#sender')!;
            const subject = header!.querySelector('#subject')!;
            const to = header!.querySelector('#to')!;
            const cc = header!.querySelector('#cc')!;

            sender.textContent = `From: ${email.from!.address}` || '';
            subject.textContent = email.subject || '';
            to.textContent = `To: ${email.to?.map((ad) => ad.address).join(', ') ?? ``}`;
            cc.textContent = `Cc: ${email.cc?.map((ad) => ad.address).join(', ') ?? ``}`;

            frame?.contentWindow?.document.open('text/html', 'replace');
            frame?.contentWindow?.document.write(email.html ?? '');
            frame?.contentWindow?.document.close();
            frame?.contentWindow?.document.querySelectorAll('a').forEach((el) => el.target = '_blank');
        });

        header?.addEventListener('click', () => {
            header!.style.height = this.headerVisible ? '36px' : 'auto'
            header.querySelectorAll('.collapsable').forEach((el) => (el as HTMLElement).style.display = this.headerVisible ? 'none' : 'block')
            this.headerVisible = !this.headerVisible
        })

        header?.click()
    };

    disconnectedCallback() {
    };
};

window.customElements.define('email-view', EmailView);