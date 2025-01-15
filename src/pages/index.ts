import './globals.css';
import '../components/compose-email/index.js';
import '../components/email-view/index.js';
import '../components/email-controls/index.js'

const emailList = document.querySelector('ul') as HTMLUListElement;
const template = document.getElementById('email-list-template') as HTMLTemplateElement;

if (!localStorage.getItem('token')) window.location.href = '/login'

function createEmailListItem(subject: string, sender: string, content: string, uid: string) {
    const clone = template.content.cloneNode(true) as HTMLElement;
    (clone.children.item(0) as Element).id = uid

    const img = clone.querySelector('img') as HTMLImageElement;
    const subjectElement = clone.querySelector('#subject') as HTMLSpanElement;
    const bodyElement = clone.querySelector('#content') as HTMLParagraphElement;
    const senderElement = clone.querySelector('#sender') as HTMLSpanElement;

    subjectElement.textContent = subject
    senderElement.textContent = sender
    bodyElement.textContent = content

    emailList?.appendChild(clone)
}

async function fetchEmails() {
    emailList.textContent = ''

    const res = await fetch('/api/emails', {
        method: 'PATCH',
        body: JSON.stringify({
            mailbox: 'INBOX',
            limit: 20
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token[0]}`
        }
    })
    
    const body = await res.json()
    const data: any[] = body.data
    
    data.sort((a, b) => b.uid - a.uid)

    data.forEach(async (email: any) => {
        const { subject, from, content, uid } = email
    
        try {
            sessionStorage.setItem(uid, JSON.stringify(email))
        } catch(err) {
            console.warn(err)
        }
    
        createEmailListItem(subject!, `${from[0].name} <${from[0].address}>`, content!, uid)
    })
}

const token = localStorage.getItem('token')?.split(';') as string[]

if (new Date(token[1].split('=')[1]) < new Date()) {
    alert('You are not logged in');
    localStorage.removeItem('token');
};

if (token) fetchEmails()
document.addEventListener('fetch-emails', fetchEmails)