# LacusSoft :: cnpj-fmt

![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cnpj-fmt)
![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cnpj-fmt?label=bundle%20size)
![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cnpj-fmt.svg)
![Test Status](https://img.shields.io/github/actions/workflow/status/juliolmuller/br-utils-js/ci.yml?label=ci/cd)
![Last Update Date](https://img.shields.io/github/last-commit/juliolmuller/br-utils-js)
![Project License](https://img.shields.io/github/license/juliolmuller/br-utils-js)

Basic function to format CNPJ strings (Brazilian ID document).

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cnpj-fmt

# using Bun
$ bun add @lacussoft/cnpj-fmt
```

## Import

```js
// ES Modules
import cnpjFmt from '@lacussoft/cnpj-fmt'

// Common JS
const cnpjFmt = require('@lacussoft/cnpj-fmt')
```

or import it through your HTML file, using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cnpj-fmt@latest/dist/cnpj-fmt.min.js"></script>
```

## Usage

```js
const cnpj = '03603568000195'

cnpjFmt(cnpj)       // returns '03.603.568/0001-95'

cnpjFmt(cnpj, {     // returns '03.603.***/****-**'
  hidden: true
})

cnpjFmt(cnpj, {     // returns '03603568|0001_95'
  delimiters: {
    dot: '',
    slash: '|',
    dash: '_'
  }
})
```

### Formatting options

```js
cnpjFmt(cnpj, {
  delimiters: {
    dot: '.',       // string to replace the dot characters
    slash: '/',     // string to replace the slash character
    dash: '-'       // string to replace the dash character
  },
  escape: false,    // boolean to define if the result should be HTML escaped
  hidden: false,    // boolean to define if digits should be hidden
  hiddenKey: '*',   // string to replace hidden digits
  hiddenRange: {
    start: 5,       // starting index of the numeric sequence to be hidden (min 0)
    end: 13         // ending index of the numeric sequence to be hidden (max 13)
  },
  onFail(value) {   // fallback function to be invoked in case a non-14-digits is passed
    return value
  }
})
```
