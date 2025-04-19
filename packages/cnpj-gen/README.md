# LacusSoft :: cnpj-gen

![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cnpj-gen)
![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cnpj-gen?label=bundle%20size)
![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cnpj-gen.svg)
![Test Status](https://img.shields.io/github/actions/workflow/status/juliolmuller/cnpj-utils-js/release.yml?label=ci/cd)
![Last Update Date](https://img.shields.io/github/last-commit/juliolmuller/cnpj-utils-js)
![Project License](https://img.shields.io/github/license/juliolmuller/cnpj-utils-js)

Basic function to generate valid CNPJ (Brazilian ID document).

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Installation

```bash
$ npm install @lacussoft/cnpj-gen
```

## Import

```js
// ES Modules
import cnpjGen from '@lacussoft/cnpj-gen'

// Common JS
const cnpjGen = require('@lacussoft/cnpj-gen')
```

or import it through your HTML file, using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cnpj-gen@latest/dist/cnpj-gen.min.js"></script>
```

## Usage

```js
let cnpj = cnpjGen()      // returns '65453043000178'

cnpj = cnpjGen({          // returns '73.008.535/0005-06'
  format: true
})

cnpj = cnpjGen({          // returns '45623767000296'
  prefix: '45623767'
})

cnpj = cnpjGen({          // returns '45.623.767/0002-96'
  prefix: '456237670002'
  format: true
})
```

### Generator options

```js
cnpjGen({
  format: false, // indicates if output should be formatted
  prefix: '',    // if you have a CNPJ initials and want to complete it with valid digits.
})               //     The string provided must contain between 1 and 12 digits!
```
