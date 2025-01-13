import './globals.css';
import '../components/compose-email/index.js';
import { ParsedMail } from 'mailparser';

const emailList = document.querySelector('ul');
const template = document.getElementById('email-list-template') as HTMLTemplateElement;

function createEmailListItem(subject: string, sender: string, content: string) {
    const clone = template.content.cloneNode(true) as HTMLElement;

    const img = clone.querySelector('img') as HTMLImageElement;
    const subjectElement = clone.querySelector('#subject') as HTMLSpanElement;
    const bodyElement = clone.querySelector('#content') as HTMLParagraphElement;
    const senderElement = clone.querySelector('#sender') as HTMLSpanElement;

    subjectElement.textContent = subject
    senderElement.textContent = sender
    bodyElement.textContent = content.slice(0, 50)

    emailList?.appendChild(clone)
}

const token = localStorage.getItem('token')?.split(';') as string[]

if (new Date(token[1].split('=')[1]) < new Date()) {
    alert('You are not logged in');
    localStorage.removeItem('token');
};

const res = await fetch('/api/emails', {
    method: 'PATCH',
    body: JSON.stringify({
        mailbox: 'INBOX',
        limit: 10
    }),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token[0]}`
    }
})

const body = await res.json()
console.log(body)
if ('data' in body) {
    body.data.forEach(async (email: ParsedMail) => {
        const { subject, from, text } = email
        createEmailListItem(subject!, from?.text!, text!)
    })
}