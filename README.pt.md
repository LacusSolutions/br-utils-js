![br-utils para JavaScript](https://br-utils.vercel.app/img/cover_br-utils.jpg)

> 🚀 **Suporte total ao [novo formato alfanumérico de CNPJ](https://github.com/user-attachments/files/23937961/calculodvcnpjalfanaumerico.pdf).**

> 🌎 [Access documentation in English](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/br-utils/README.md)

Kit em JavaScript/TypeScript para as principais operações com dados brasileiros: CPF (Cadastro de Pessoas Físicas) e CNPJ (Cadastro Nacional da Pessoa Jurídica). Expõe uma API unificada que reúne [`cpf-utils`](https://www.npmjs.com/package/cpf-utils) e [`cnpj-utils`](https://www.npmjs.com/package/cnpj-utils) em um único ponto de entrada.

## Recursos

- ✅ **API unificada**: Uma instância padrão com submódulos `cpf` e `cnpj`; cada um oferece `format`, `generate` e `isValid`
- ✅ **Um único pacote**: Instale um pacote para operações de CPF ([demo](https://cpf-utils.vercel.app/)) e CNPJ ([demo](https://cnpj-utils.vercel.app/))
- ✅ **Instância reutilizável**: Classe `BrUtils` com configurações padrão opcionais para os utils de CPF e CNPJ (opções ou instâncias)
- ✅ **Reexportações completas**: Todas as classes, opções, erros e tipos de `cpf-utils` e `cnpj-utils`
- ✅ **TypeScript**: Definições de tipo completas e compatível com strict mode
- ✅ **Tratamento de erros**: Mesmos erros e exceções dos pacotes subjacentes

## Instalação

```bash
# usando NPM
$ npm install --save br-utils

# usando Bun
$ bun add br-utils
```

## Início rápido

```ts
// ES Modules — instância padrão
import brUtils from 'br-utils'

// Ou exportações nomeadas (tree-shaking)
import { BrUtils, cpfUtils, cnpjUtils } from 'br-utils'

// Common JS
const brUtils = require('br-utils')
```

Uso básico:

```ts
// CPF (pessoa física)
brUtils.cpf.format('47844241055')           // '478.442.410-55'
brUtils.cpf.generate({ format: true })     // ex.: '478.442.410-55'
brUtils.cpf.isValid('123.456.789-09')      // true

// CNPJ (pessoa jurídica)
brUtils.cnpj.format('03603568000195')      // '03.603.568/0001-95'
brUtils.cnpj.generate({ format: true })   // ex.: '03.603.568/0001-95'
brUtils.cnpj.isValid('98765432000198')    // true
```

Para frontends legados, inclua o build UMD (ex.: minificado) em uma tag `<script>`; `brUtils` fica disponível globalmente:

```html
<script src="https://cdn.jsdelivr.net/npm/br-utils@latest/dist/br-utils.min.js"></script>
```

## Uso

### `brUtils` (instância padrão)

A exportação padrão é uma instância pré-construída de `BrUtils`. Use para chamadas rápidas:

- **`cpf`**: Acesso aos utils de CPF (`CpfUtils`). Use `brUtils.cpf.format()`, `brUtils.cpf.generate()`, `brUtils.cpf.isValid()` com as mesmas opções do [cpf-utils](https://github.com/LacusSolutions/br-utils-js/tree/main/packages/cpf-utils#readme).
- **`cnpj`**: Acesso aos utils de CNPJ (`CnpjUtils`). Use `brUtils.cnpj.format()`, `brUtils.cnpj.generate()`, `brUtils.cnpj.isValid()` com as mesmas opções do [cnpj-utils](https://github.com/LacusSolutions/br-utils-js/tree/main/packages/cnpj-utils#readme).

### `BrUtils` (classe)

Para utils de CPF ou CNPJ padrão customizados, crie sua própria instância:

```ts
import { BrUtils } from 'br-utils'

// Configurações padrão (todas opcionais)
const utils = new BrUtils({
  cpf: {
    formatter: { hidden: true, hiddenKey: '#' },
    generator: { format: true },
  },
  cnpj: {
    formatter: { hidden: true },
    generator: { type: 'numeric', format: true },
  },
})

utils.cpf.format('47844241055')        // '478.###.###-##'
utils.cpf.generate()                  // ex.: '005.265.352-88'
utils.cnpj.format('03603568000195')   // '03.603.***/****-**'
utils.cnpj.generate()                 // ex.: '73.008.535/0005-06'

// Acessar ou substituir instâncias internas
utils.cpf   // CpfUtils
utils.cnpj  // CnpjUtils
```

- **`constructor(defaultSettings?)`**: Opcional `BrUtilsSettingsInput` — `cpf` e `cnpj` podem ser uma instância de `CpfUtils` / `CnpjUtils` ou um objeto de opções (`CpfUtilsSettingsInput` / `CnpjUtilsSettingsInput`). Chaves omitidas usam instâncias padrão.
- **`cpf`**: Getter/setter da instância de utils de CPF. O setter aceita `CpfUtils`, `CpfUtilsSettingsInput`, ou `null`/`undefined` para voltar aos padrões.
- **`cnpj`**: Getter/setter da instância de utils de CNPJ. O setter aceita `CnpjUtils`, `CnpjUtilsSettingsInput`, ou `null`/`undefined` para voltar aos padrões.

### Uso direto dos helpers e reexportações

Você pode usar os helpers e classes de CPF e CNPJ reexportados diretamente:

```ts
import {
  cpfFmt,
  cpfGen,
  cpfVal,
  CpfUtils,
  cnpjFmt,
  cnpjGen,
  cnpjVal,
  CnpjUtils,
} from 'br-utils'

cpfFmt('47844241055', { dashKey: '_' })   // '478.442.410_55'
cpfGen({ prefix: '123456' })              // ex.: '12345678901'
cpfVal('123.456.789-09')                  // true

cnpjFmt('03603568000195', { slashKey: '|' })  // '03.603.568|0001-95'
cnpjGen({ type: 'numeric' })                  // ex.: '65453043000178'
cnpjVal('98.765.432/0001-98')                 // true
```

Consulte [cpf-utils](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-utils/README.md) e [cnpj-utils](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-utils/README.md) para detalhes completos de opções e erros.

## API

### Exportações

- **`brUtils`** (padrão): Instância pré-construída de `BrUtils` com `cpf` e `cnpj`; em CommonJS e UMD, o objeto também carrega todas as reexportações de `cpf-utils` e `cnpj-utils`.
- **`BrUtils`**: Classe para criar uma instância com configurações opcionais dos utils de CPF e CNPJ.
- **`BrUtilsSettingsInput`**, **`BrUtilsSettingsType`**: Tipos das configurações do construtor.
- **CPF**: Todas as exportações do [cpf-utils](https://github.com/LacusSolutions/br-utils-js/tree/main/packages/cpf-utils#readme) (ex.: `cpfUtils`, `CpfUtils`, `cpfFmt`, `cpfGen`, `cpfVal`, classes de formatador/gerador/validador, opções, erros, tipos).
- **CNPJ**: Todas as exportações do [cnpj-utils](https://github.com/LacusSolutions/br-utils-js/tree/main/packages/cnpj-utils#readme) (ex.: `cnpjUtils`, `CnpjUtils`, `cnpjFmt`, `cnpjGen`, `cnpjVal`, classes de formatador/gerador/validador, opções, erros, tipos).

### Erros e exceções

Os erros e exceções são os mesmos de `cpf-utils` e `cnpj-utils`. O construtor de `BrUtils` e os setters `cpf`/`cnpj` podem lançar os mesmos erros dos construtores dos pacotes subjacentes. Veja o README de cada pacote para a lista completa.

## Contribuição e suporte

Contribuições são bem-vindas! Consulte as [Diretrizes de contribuição](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md). Se o projeto for útil para você, considere:

- ⭐ Dar uma estrela no repositório
- 🤝 Contribuir com código
- 💡 [Sugerir novas funcionalidades](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reportar bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE).

## Changelog

Veja o [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/br-utils/CHANGELOG.md) para alterações e histórico de versões.

---

Feito com ❤️ por [Lacus Solutions](https://github.com/LacusSolutions)
