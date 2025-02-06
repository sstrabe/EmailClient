# Email Client
<br/>

This is a simple email client built on vanilla html, css and typescript and uses nodejs as a backend.
To run this you must have nodejs and npm installed on your system.

An already hosted version can be found at https://email.strabix.com/

## Setup
Before starting the server, you need to create a .env file following the .env.Example.

## Usage

To start the server and serve the website please run `npm run dev`, this will make the app available at http://localhost:3000/.
Once the server is running you can login into your gmail account from the login page.

> [!Note]
> For security reasons, gmail requires you to [create an app password](https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://support.google.com/accounts/answer/185833%3Fhl%3Den&ved=2ahUKEwjGzp3ozPqKAxXgJNAFHaPkK7oQFnoECAsQAQ&usg=AOvVaw2qwXmKRTjsa0k-q38HqJIX), and use that to login.
> Additionally, the dev command currently only works on macos and linux, due to the use of `rm` to remove the /dist directory. Simply removing the rm command will allow it to function.
>

## Installation

Please install [nodejs and npm](https://nodejs.org/en/download), after that run `npm install` in the project directory.

# Deutsch

Dies ist ein einfacher E-Mail-Client, der auf reinem HTML, CSS und TypeScript basiert und Node.js als Backend verwendet.  
Um dies auszuführen, müssen Node.js und npm auf Ihrem System installiert sein.

Eine bereits gehostete Version kann man unter https://email.strabix.com/ finden.

## Einrichtung  
Bevor Sie den Server starten, müssen Sie eine `.env`-Datei erstellen, die der `.env.Beispiel`-Datei folgt.

## Nutzung

Um den Server zu starten und die Website bereitzustellen, führen Sie bitte `npm run dev` aus. Dies macht die App unter http://localhost:3000/ verfügbar.  
Sobald der Server läuft, können Sie sich auf der Login-Seite mit Ihrem Gmail-Konto anmelden.

> [!Note]  
> Aus Sicherheitsgründen verlangt Gmail, dass Sie ein [App-Passwort erstellen](https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://support.google.com/accounts/answer/185833%3Fhl%3Den&ved=2ahUKEwjGzp3ozPqKAxXgJNAFHaPkK7oQFnoECAsQAQ&usg=AOvVaw2qwXmKRTjsa0k-q38HqJIX) und dieses für die Anmeldung verwenden.  
> Zusätzlich funktioniert der `dev`-Befehl derzeit nur auf macOS und Linux, da `rm` verwendet wird, um das /dist-Verzeichnis zu entfernen. Wenn Sie den `rm`-Befehl entfernen, funktioniert er auch auf anderen Betriebssystemen.

## Installation

Bitte installieren Sie [Node.js und npm](https://nodejs.org/en/download). Führen Sie danach `npm install` im Projektverzeichnis aus.
