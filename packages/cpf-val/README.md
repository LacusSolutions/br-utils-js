# LacusSoft :: cpf-val

![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cpf-val)
![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cpf-val?label=bundle%20size)
![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cpf-val.svg)
![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)
![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)
![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)

Utility function to validate CPF (Brazilian ID document).

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cpf-val

# using Bun
$ bun add @lacussoft/cpf-val
```

## Import

```js
// ES Modules
import cpfVal from '@lacussoft/cpf-val'

// Common JS
const cpfVal = require('@lacussoft/cpf-val')
```

or import it through your HTML file, using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cpf-val@latest/dist/cpf-val.min.js"></script>
```

### Usage:

```js
cpfVal('12345678909')     // returns 'true'

cpfVal('123.456.789-09')  // returns 'true'

cpfVal('12345678910')     // returns 'false'
                 ^^
```
