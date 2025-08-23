# LacusSoft :: cpf-gen

![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cpf-gen)
![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cpf-gen?label=bundle%20size)
![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cpf-gen.svg)
![Test Status](https://img.shields.io/github/actions/workflow/status/juliolmuller/cpf-utils-js/ci.yml?label=ci/cd)
![Last Update Date](https://img.shields.io/github/last-commit/juliolmuller/cpf-utils-js)
![Project License](https://img.shields.io/github/license/juliolmuller/cpf-utils-js)

Utility function to generate valid CPF (Brazilian ID document).

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cpf-gen

# using Bun
$ bun add @lacussoft/cpf-gen
```

## Import

```js
// ES Modules
import cpfGen from '@lacussoft/cpf-gen'

// Common JS
const cpfGen = require('@lacussoft/cpf-gen')
```

or import it through your HTML file, using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cpf-gen@latest/dist/cpf-gen.min.js"></script>
```

## Usage

```js
let cpf = cpfGen()      // returns '47844241055'

cpf = cpfGen({          // returns '005.265.352-88'
  format: true
})

cpf = cpfGen({          // returns '52825091138'
  prefix: '528250911'
})

cpf = cpfGen({          // returns '528.250.911-38'
  prefix: '528250911',
  format: true
})
```

### Generator options

```js
cpfGen({
  format: false, // indicates if output should be formatted
  prefix: ''     // if you have a CPF initials and want to complete it with valid digits.
})               //     The string provided must contain between 0 and 9 digits!
```
