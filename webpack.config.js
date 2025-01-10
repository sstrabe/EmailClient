import { sync } from "glob"
import path from "path"

const __dirname = import.meta.url
const files = Object.fromEntries(sync('./dist/pages/**/*.js')
    .map(file => './' + file)
    .map(file => [file.replace('dist/', ''), file])
)

export default {
    entry: files,
    output: {
        filename: '[name]'
    },
    mode: 'production',
    module: {
        rules: [
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader", "postcss-loader"],
          },
        ],
      },
}