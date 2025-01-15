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

class EmailView extends HTMLElement {
    constructor(
        private currentEmail: string
    ) {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [styleSheet];
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const emailList = document.querySelector('.email-list') as HTMLElement
        emailList.addEventListener('click', (event) => {
            event.preventDefault()

            //@ts-ignore
            const item = event.target?.closest('li') as HTMLElement;
            if (!item) return;
            const emailId = item.id;
            const email = JSON.parse(sessionStorage.getItem(emailId) || '');
            if (!email) return;

            document.dispatchEvent(new CustomEvent('email-selected', {
                detail: emailId
            }));

            const frame = this.shadowRoot?.querySelector('iframe');
            frame?.contentWindow?.document.open('text/html', 'replace');
            frame?.contentWindow?.document.write(email.html);
            frame?.contentWindow?.document.close();
            frame?.contentWindow?.document.querySelectorAll('a').forEach((el) => el.target = '_blank')
        })
    };

    disconnectedCallback() {
    };
};

window.customElements.define('email-view', EmailView);