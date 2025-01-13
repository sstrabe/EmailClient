import 'dotenv/config';

import express from "express";
import { router } from "express-file-routing";
import Path from "path";
import { readdirSync } from "fs";
import { expressjwt } from "express-jwt";

const __dirname = import.meta.dirname
const app = express();
const secret = process.env.SECRET as string;

app.use(express.static(Path.join(__dirname, 'public')))
app.use('/api', express.json())
app.use('/api', expressjwt({
    secret: secret,
    algorithms: ["HS256"]
}).unless({ path: ['/api/login'] }))

app.use('/api', await router({
    directory: Path.join(__dirname, 'api')
}))

async function scanDir(path: string) {
    app.get(path.split('/pages')[1] ?? '/', (req, res) => {
        res.sendFile(Path.join(path, 'index.html'))
    })

    readdirSync(path, { withFileTypes: true }).forEach(dirent => {
        if (dirent.isDirectory()) {
            scanDir(Path.join(path, dirent.name)) 
        } else {
            app.get(path.split('/pages')[1] + '/' + dirent.name, (req, res) => res.sendFile(Path.join(path, dirent.name)))    
        }
    })
}

scanDir(Path.join(__dirname, 'pages'))

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})