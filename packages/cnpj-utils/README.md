# cnpj-utils for JavaScript

![NPM Latest Version](https://img.shields.io/npm/v/cnpj-utils)
![Downloads Count](https://img.shields.io/npm/dm/cnpj-utils.svg)
![Bundle Size](https://packagephobia.now.sh/badge?p=cnpj-utils)
![Last Update Date](https://img.shields.io/github/last-commit/juliolmuller/cnpj-utils-js)
![Project License](https://img.shields.io/github/license/juliolmuller/cnpj-utils-js)

Toolkit to handle the main operations with CNPJ data (Brazilian personal ID): validation, formatting and generation of valid character sequence.

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Installation

```bash
$ npm install cnpj-utils --save
```

## Import

```js
// Common JS syntax:
const cnpjUtils = require('cnpj-utils')

// ES Module syntax:
import cnpjUtils from 'cnpj-utils'
// or get the specific function with ES tree-shaking:
import { isValid, generate, format } from 'cnpj-utils'
```

or import it through your HTML file, using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/cnpj-utils@latest/dist/cnpj-utils.min.js"></script>
```

## API

`cnpj-utils` is only a wrapper to the libraries maintained by **LacusSoft**, [`cnpj-fmt`](https://www.npmjs.com/package/@lacussoft/cnpj-fmt), [`cnpj-gen`](https://www.npmjs.com/package/@lacussoft/cnpj-gen) and [`cnpj-val`](https://www.npmjs.com/package/@lacussoft/cnpj-val), so you can refer directly to their specific documentation. Anyway, the API is detailed hereby with examples.

### `cnpjUtils.format(string[, options])`

**returns** `string`

The `format` method expects a string as its first parameter.

If the input does not contain 11 digits (it does not require to be a valid CNPJ, but it MUST be 11-digits long) an `onFail` callback is invoked. By default, a copy of the input is returned as a fallback, but this callback and other customizations may be defined in the second parameter.

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

Here are the available default configurations that can be overwritten by the `options` parameter:

```js
cnpjFmt(cnpj, {
  delimiters: {
    dot: '.',       // string to replace the dot characters
    slash: '/',     // string to replace the slash character
    dash: '-',      // string to replace the dash character
  },
  escape: false,    // boolean to define if the result should be HTML escaped
  hidden: false,    // boolean to define if digits should be hidden
  hiddenKey: '*',   // string to replace hidden digits
  hiddenRange: {
    start: 5,       // starting index of the numeric sequence to be hidden (min 0)
    end: 13,        // ending index of the numeric sequence to be hidden (max 13)
  },
  onFail(value) {   // fallback function to be invoked in case a non-14-digits is passed
    return value
  }
})
```

### `cnpjUtils.generate([options])`

**returns** `string`

If you need to generate valid CNPJ's to work with, the `generate` method make this task easy and safe. You just need to invoke it with no parameters to obtain an 11-digits string, however, you can provide an `options` object to configure its output, like flagging it to format or to complete a digits string with a valid CNPJ sequence:

```js
let cnpj = cnpjGen()   // returns '65453043000178'

cnpj = cnpjGen({       // returns '73.008.535/0005-06'
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

The default configurations are:

```js
cnpjGen({
  format: false,   // indicates if output should be formatted
  prefix: '',      // if you have a CNPJ initials and want to complete it with valid digits.
})                 //     The string provided must contain between 1 and 12 digits!
```

Keep in mind that, for the `prefix` option, it must be a **string** containing up to 9 digits.

### `cnpjUtils.validate(string)`

**returns** `boolean`

The `validate` method receives a string as its single parameter, evaluate it and returns `true` or `false` as output. This parameter may contain any character like letters, symbols, punctuation or white spaces, but it will immediately return `false` in case the expected 11 digits are not found to be deeply evaluated.


```js
cnpjVal('98765432000198')      // returns 'true'

cnpjVal('98.765.432/0001-98')  // returns 'true'

cnpjVal('98765432000199')      // returns 'false'
                     ^^
```
