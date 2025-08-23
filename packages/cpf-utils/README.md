# cpf-utils for JavaScript

![NPM Latest Version](https://img.shields.io/npm/v/cpf-utils)
![Bundle Size](https://img.shields.io/bundlephobia/min/cpf-utils?label=bundle%20size)
![Downloads Count](https://img.shields.io/npm/dm/cpf-utils.svg)
![Test Status](https://img.shields.io/github/actions/workflow/status/juliolmuller/cpf-utils-js/ci.yml?label=ci/cd)
![Last Update Date](https://img.shields.io/github/last-commit/juliolmuller/cpf-utils-js)
![Project License](https://img.shields.io/github/license/juliolmuller/cpf-utils-js)

Toolkit to handle the main operations with CPF data (Brazilian personal ID): validation, formatting and generation of valid character sequence.

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Installation

```bash
# using NPM
$ npm install --save cpf-utils

# using Bun
$ bun add cpf-utils
```

## Import

```js
// Common JS syntax:
const cpfUtils = require('cpf-utils')

// ES Module syntax:
import cpfUtils from 'cpf-utils'
// or get the specific function with ES tree-shaking:
import { isValid, generate, format } from 'cpf-utils'
```

or import it through your HTML file, using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/cpf-utils@latest/dist/cpf-utils.min.js"></script>
```

## API

`cpf-utils` is only a wrapper to the libraries maintained by **LacusSoft**, [`cpf-fmt`](https://www.npmjs.com/package/@lacussoft/cpf-fmt), [`cpf-gen`](https://www.npmjs.com/package/@lacussoft/cpf-gen) and [`cpf-val`](https://www.npmjs.com/package/@lacussoft/cpf-val), so you can refer directly to their specific documentation. Anyway, the API is detailed hereby with examples.

### `cpfUtils.format(string[, options])`

**returns** `string`

The `format` method expects a string as its first parameter.

If the input does not contain 11 digits (it does not require to be a valid CPF, but it MUST be 11-digits long) an `onFail` callback is invoked. By default, a copy of the input is returned as a fallback, but this callback and other customizations may be defined in the second parameter.

```js
const cpf = '47844241055'

cpfUtils.format(cpf)     // returns '478.442.410-55'

cpfUtils.format(cpf, {   // returns '478.***.***-**'
  hidden: true
})

cpfUtils.format(cpf, {   // returns '478442410_55'
  delimiters: {
    dot: '',
    dash: '_'
  }
})
```

Here are the available default configurations that can be overwritten by the `options` parameter:

```js
cpfUtils.format(cpf, {
  delimiters: {
    dot: '.',       // string to replace the dot characters
    dash: '-'       // string to replace the dash character
  },
  escape: false,    // boolean to define if the result should be HTML escaped
  hidden: false,    // boolean to define if digits should be hidden
  hiddenKey: '*',   // string to replace hidden digits
  hiddenRange: {
    start: 3,       // starting index of the numeric sequence to be hidden (min 0)
    end: 10         // ending index of the numeric sequence to be hidden (max 10)
  },
  onFail(value) {   // fallback function to be invoked in case a non-11-digits is passed
    return value
  }
})
```

### `cpfUtils.generate([options])`

**returns** `string`

If you need to generate valid CPF's to work with, the `generate` method make this task easy and safe. You just need to invoke it with no parameters to obtain an 11-digits string, however, you can provide an `options` object to configure its output, like flagging it to format or to complete a digits string with a valid CPF sequence:

```js
let cpf = cpfUtils.generate()   // returns '47844241055'

cpf = cpfUtils.generate({       // returns '005.265.352-88'
  format: true
})

cpf = cpfUtils.generate({       // returns '52825091138'
  prefix: '528250911'
})

cpf = cpfUtils.generate({       // returns '528.250.911-38'
  prefix: '528250911',
  format: true
})
```

The default configurations are:

```js
cpfUtils.generate({
  format: false,     // indicates if output should be formatted
  prefix: ''         // if you have the CPF initials and want to complete it with valid
})                   //   digits. The string provided must contain between 0 and 9 digits!
```

Keep in mind that, for the `prefix` option, it must be a **string** containing up to 9 digits.

### `cpfUtils.isValid(string)`

**returns** `boolean`

The `isValid` method receives a string as its single parameter, evaluate it and returns `true` or `false` as output. This parameter may contain any character like letters, symbols, punctuation or white spaces, but it will immediately return `false` in case the expected 11 digits are not found to be deeply evaluated.


```js
cpfUtils.isValid('12345678909')     // returns "true", because "123.456.789-09" is a valid CPF

cpfUtils.isValid('123.456.789-09')  // returns "true"

cpfUtils.isValid('12345678910')     // returns "false", because the suffix has changed, making this CPF invalid
                            ^^
```
