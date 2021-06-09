# LacusSoft :: cnpj-val

![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cnpj-val)
![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cnpj-val.svg)
![Bundle Size](https://packagephobia.now.sh/badge?p=@lacussoft/cnpj-val)
![Test Status](https://img.shields.io/travis/juliolmuller/cnpj-utils-js/main.svg)
![Last Update Date](https://img.shields.io/github/last-commit/juliolmuller/cnpj-utils-js)
![Project License](https://img.shields.io/github/license/juliolmuller/cnpj-utils-js)

Basic function to validate CNPJ (Brazilian ID document).

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Installation

```bash
$ npm install @lacussoft/cnpj-val
```

## Import

```js
// ES Modules
import cnpjVal from '@lacussoft/cnpj-val'

// Common JS
const cnpjVal = require('@lacussoft/cnpj-val')
```

or import it through your HTML file, using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cnpj-val@latest/dist/cnpj-val.min.js"></script>
```

### Usage:

```js
cnpjVal('98765432000198')      // returns 'true'

cnpjVal('98.765.432/0001-98')  // returns 'true'

cnpjVal('98765432000199')      // returns 'false'
                     ^^
```
