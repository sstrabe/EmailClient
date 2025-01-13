import '../globals.css';


const loginForm = document.getElementById('loginForm') as HTMLFormElement
loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = (loginForm.elements.namedItem('email') as HTMLInputElement).value
    const password = (loginForm.elements.namedItem('password') as HTMLInputElement).value

    const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({
            email, password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) return

    const body = await response.json()
    const token = body.token
    if (!token) return

    const date = new Date();
    date.setDate(date.getDate() + 7);
    
    localStorage.setItem('token', `${token};expires=${date.toISOString()}`)

    window.location.href = '/'
})