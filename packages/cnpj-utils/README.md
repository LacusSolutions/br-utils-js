# cnpj-utils for JavaScript

![NPM Latest Version](https://img.shields.io/npm/v/cnpj-utils)
![Bundle Size](https://img.shields.io/bundlephobia/min/cnpj-utils?label=bundle%20size)
![Downloads Count](https://img.shields.io/npm/dm/cnpj-utils.svg)
![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)
![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)
![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)

Toolkit to deal with CNPJ data (Brazilian employer ID): validation, formatting and generation of valid IDs.

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Installation

```bash
# using NPM
$ npm install --save cnpj-utils

# using Bun
$ bun add cnpj-utils
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

If the input does not contain 14 digits (it does not need to be a valid CNPJ, but it MUST be 14-digits long) an `onFail` callback is invoked. By default, a copy of the input is returned as a fallback, but this callback and other customizations may be defined in the second parameter.

```js
const cnpj = '03603568000195'

cnpjUtils.format(cnpj)     // returns '03.603.568/0001-95'

cnpjUtils.format(cnpj, {   // returns '03.603.***/****-**'
  hidden: true
})

cnpjUtils.format(cnpj, {   // returns '03603568|0001_95'
  delimiters: {
    dot: '',
    slash: '|',
    dash: '_'
  }
})
```

Here are the available default configurations that can be overwritten by the `options` parameter:

```js
cnpjUtils.format(cnpj, {
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

### `cnpjUtils.generate([options])`

**returns** `string`

If you need to generate valid CNPJs, the `generate` method makes this task easy and safe. Invoke it without parameters to obtain a 14‑digit string. You can also provide an `options` object to configure its output, like flagging it to format or to complete a digits string with a valid CNPJ sequence:

```js
let cnpj = cnpjUtils.generate()   // returns '65453043000178'

cnpj = cnpjUtils.generate({       // returns '73.008.535/0005-06'
  format: true
})

cnpj = cnpjUtils.generate({       // returns '45623767000296'
  prefix: '45623767'
})

cnpj = cnpjUtils.generate({       // returns '45.623.767/0002-96'
  prefix: '456237670002',
  format: true
})
```

The default configurations are:

```js
cnpjUtils.generate({
  format: false,    // indicates if output should be formatted
  prefix: ''        // if you have a CNPJ initials and want to complete it with valid
})                  //   digits. The string provided must contain between 1 and 12 digits!
```

Keep in mind that, for the `prefix` option, it must be a **string** containing up to 12 digits.

### `cnpjUtils.isValid(string)`

**returns** `boolean`

The `isValid` method receives a string as its single parameter, evaluates it and returns `true` or `false` as output. This parameter may contain any character like letters, symbols, punctuation or white spaces, but it will immediately return `false` in case the expected 14 digits are not found to be deeply evaluated.


```js
cnpjUtils.isValid('98765432000198')      // returns 'true'

cnpjUtils.isValid('98.765.432/0001-98')  // returns 'true'

cnpjUtils.isValid('98765432000199')      // returns 'false'
                                ^^
```
