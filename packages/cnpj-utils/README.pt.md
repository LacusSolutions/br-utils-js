![cnpj-utils para JavaScript](https://br-utils.vercel.app/img/cover_cnpj-utils.jpg)

> 🚀 **Suporte completo ao novo formato alfanumérico de CNPJ.**

> 🌎 [Access documentation in English](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-utils/README.md)

Kit em JavaScript/TypeScript para formatar, gerar e validar CNPJ (Cadastro Nacional da Pessoa Jurídica). Unifica em uma única API os pacotes [`@lacussoft/cnpj-fmt`](https://www.npmjs.com/package/@lacussoft/cnpj-fmt), [`@lacussoft/cnpj-gen`](https://www.npmjs.com/package/@lacussoft/cnpj-gen) e [`@lacussoft/cnpj-val`](https://www.npmjs.com/package/@lacussoft/cnpj-val).

## Recursos

- ✅ **API unificada**: Uma instância padrão com `format`, `generate` e `isValid`; ou uso direto dos helpers `cnpjFmt`, `cnpjGen` e `cnpjVal`
- ✅ **CNPJ alfanumérico**: Formatar, gerar e validar CNPJ de 14 caracteres numérico ou alfanumérico
- ✅ **Instância reutilizável**: Classe `CnpjUtils` com configurações padrão opcionais (opções ou instâncias do formatador, gerador e validador)
- ✅ **Reexportações completas**: Todas as classes, opções, erros e tipos do formatador, gerador e validador dos três pacotes
- ✅ **TypeScript**: Definições de tipo completas e compatível com strict mode
- ✅ **Tratamento de erros**: Mesmos erros de tipo e exceções dos pacotes subjacentes

## Instalação

```bash
# usando NPM
$ npm install --save cnpj-utils

# usando Bun
$ bun add cnpj-utils
```

## Início rápido

```ts
// ES Modules — instância padrão
import cnpjUtils from 'cnpj-utils'

// Ou exportações nomeadas (tree-shaking)
import { CnpjUtils, cnpjFmt, cnpjGen, cnpjVal } from 'cnpj-utils'

// Common JS
const cnpjUtils = require('cnpj-utils')
```

Uso básico:

```ts
const cnpj = '03603568000195'

cnpjUtils.format(cnpj)     // '03.603.568/0001-95'

cnpjUtils.format(cnpj, {   // '03.603.***/****-**'
  hidden: true
})

cnpjUtils.format(cnpj, {   // '03603568|0001_95'
  dotKey: '',
  slashKey: '|',
  dashKey: '_'
})

cnpjUtils.generate()                         // ex.: 'AB123CDE000155' (14 caracteres alfanuméricos)
cnpjUtils.generate({ format: true })         // ex.: 'AB.123.CDE/0001-55'
cnpjUtils.generate({ prefix: '45623767' })   // ex.: '45623767000296'
cnpjUtils.generate({ type: 'numeric' })       // ex.: '65453043000178' (apenas dígitos)

cnpjUtils.isValid('98765432000198')       // true
cnpjUtils.isValid('98.765.432/0001-98')   // true
cnpjUtils.isValid('1QB5UKALPYFP59')       // true (alfanumérico)
cnpjUtils.isValid('98765432000199')       // false
```

Para frontends legados, inclua o build UMD (ex.: minificado) em uma tag `<script>`; `cnpjUtils` fica disponível globalmente:

```html
<script src="https://cdn.jsdelivr.net/npm/cnpj-utils@latest/dist/cnpj-utils.min.js"></script>
```

## Uso

### Opções do formatador

Em `format(cnpjInput, options?)`, todas as opções são opcionais:

| Opção | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `hidden` | boolean | `false` | Se `true`, mascara caracteres entre `hiddenStart` e `hiddenEnd` com `hiddenKey` |
| `hiddenKey` | string | `'*'` | Caractere(s) usados para substituir os dígitos mascarados |
| `hiddenStart` | number | `5` | Índice inicial (0–13, inclusivo) do intervalo a ocultar |
| `hiddenEnd` | number | `13` | Índice final (0–13, inclusivo) do intervalo a ocultar |
| `dotKey` | string | `'.'` | Delimitador de ponto (ex.: em `12.345.678`) |
| `slashKey` | string | `'/'` | Delimitador de barra (ex.: antes da filial `…/0001-90`) |
| `dashKey` | string | `'-'` | Delimitador de hífen (ex.: antes dos dígitos verificadores `…-90`) |
| `escape` | boolean | `false` | Se `true`, escapa caracteres especiais HTML no resultado |
| `encode` | boolean | `false` | Se `true`, codifica o resultado para URL (ex.: query params) |
| `onFail` | (value, exception) => string | `() => ''` | Callback quando o tamanho da entrada sanitizada ≠ 14; o retorno é usado como resultado |

### Opções do gerador

Em `generate(options?)`, todas as opções são opcionais:

| Opção | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `format` | boolean | `false` | Se `true`, retorna o CNPJ gerado no formato padrão (`00.000.000/0000-00`) |
| `prefix` | string | `''` | String inicial parcial (1–12 caracteres alfanuméricos). Os caracteres faltantes são gerados e os dígitos verificadores calculados. |
| `type` | `'numeric'` \| `'alphabetic'` \| `'alphanumeric'` | `'alphanumeric'` | Conjunto de caracteres da parte gerada aleatoriamente. **Os dígitos verificadores são sempre numéricos.** |

### Opções do validador

Em `isValid(cnpjInput, options?)`, todas as opções são opcionais:

| Opção | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `caseSensitive` | boolean | `true` | Se `false`, letras minúsculas são aceitas para CNPJ alfanumérico (a entrada é convertida para maiúsculas antes da validação). |
| `type` | `'numeric'` \| `'alphanumeric'` | `'alphanumeric'` | `'numeric'`: apenas dígitos (0–9); `'alphanumeric'`: dígitos e letras (0–9, A–Z). |

### `cnpjUtils` (instância padrão)

A exportação padrão é uma instância pré-construída de `CnpjUtils`. Use para chamadas rápidas:

- **`format(cnpjInput, options?)`**: Formata uma string ou array de strings de CNPJ. Delega ao formatador interno. A entrada deve ter 14 caracteres alfanuméricos (após sanitização); caso contrário `onFail` é usado.
- **`generate(options?)`**: Gera um CNPJ válido. Delega ao gerador interno.
- **`isValid(cnpjInput, options?)`**: Retorna `true` se o CNPJ for válido. Delega ao validador interno.

### `CnpjUtils` (classe)

Para formatador, gerador ou validador padrão customizados, crie sua própria instância:

```ts
import { CnpjUtils, CnpjFormatter, CnpjGenerator, CnpjValidator } from 'cnpj-utils'

// Configurações padrão (todas opcionais)
const utils = new CnpjUtils({
  formatter: { hidden: true, hiddenKey: '#' },
  generator: { type: 'numeric', format: true },
  validator: { type: 'numeric', caseSensitive: false },
})

utils.format('RK0CMT3W000100')           // 'RK.0CM.###/####-##'
utils.generate()                        // ex.: '73.008.535/0005-06'
utils.isValid('98.765.432/0001-98')     // true

// Acessar ou substituir instâncias internas
utils.formatter  // CnpjFormatter
utils.generator  // CnpjGenerator
utils.validator  // CnpjValidator
```

- **`constructor(defaultSettings?)`**: Opcional `CnpjUtilsSettingsInput` — `formatter`, `generator` e `validator` podem ser um objeto de opções ou uma instância de `CnpjFormatter` / `CnpjGenerator` / `CnpjValidator`. Chaves omitidas usam instâncias padrão.
- **`format(cnpjInput, options?)`**: Igual à instância padrão; opções por chamada sobrescrevem as opções do formatador naquela chamada.
- **`generate(options?)`**: Igual à instância padrão; opções por chamada sobrescrevem as do gerador.
- **`isValid(cnpjInput, options?)`**: Igual à instância padrão; opções por chamada sobrescrevem as do validador.
- **`formatter`**, **`generator`**, **`validator`**: Getters (e setters) do formatador, gerador e validador internos.

### Uso direto dos helpers e classes

Você pode usar o formatador, gerador e validador reexportados diretamente:

```ts
import {
  cnpjFmt,
  CnpjFormatter,
  cnpjGen,
  CnpjGenerator,
  cnpjVal,
  CnpjValidator,
} from 'cnpj-utils'

cnpjFmt('01ABC234000X56', { slashKey: '|' })   // '01.ABC.234|000X-56'
cnpjGen({ type: 'numeric' })                    // ex.: '65453043000178'
cnpjVal('9JN7MGLJZXIO50')                       // true

const formatter = new CnpjFormatter({ hidden: true })
formatter.format('AB123XYZ000123')               // 'AB.123.***/****-**'
```

Consulte [@lacussoft/cnpj-fmt](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-fmt/README.md), [@lacussoft/cnpj-gen](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-gen/README.md) e [@lacussoft/cnpj-val](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-val/README.md) para detalhes completos de opções e erros.

## API

### Exportações

- **`cnpjUtils`** (padrão): Instância pré-construída de `CnpjUtils` com `format`, `generate`, `isValid` e, nos formatos CommonJS e UMD, também as reexportações dos demais recursos dos três pacotes embarcados
- **`CnpjUtils`**: Classe para criar uma instância com configurações opcionais de formatador, gerador e validador.
- **`CnpjUtilsSettingsInput`**, **`CnpjUtilsSettingsType`**: Tipos das configurações do construtor.
- **Formatador**: `cnpjFmt`, `CnpjFormatter`, `CnpjFormatterOptions`, `CNPJ_LENGTH` e tipos/erros do formatador (ver cnpj-fmt).
- **Gerador**: `cnpjGen`, `CnpjGenerator`, `CnpjGeneratorOptions`, `CNPJ_LENGTH`, `CNPJ_PREFIX_MAX_LENGTH` e tipos/erros do gerador (ver cnpj-gen).
- **Validador**: `cnpjVal`, `CnpjValidator`, `CnpjValidatorOptions` e tipos/erros do validador (ver cnpj-val).

### Erros e exceções

Os erros e exceções são os mesmos dos pacotes subjacentes. Chamadas a `format` podem lançar erros de tipo/tamanho/opções do formatador; `generate` pode lançar exceções de opções/prefixo/tipo do gerador; `isValid` pode lançar erros de tipo de entrada/opções do validador e exceção de tipo de opção inválido. Veja o README de cada pacote para a lista completa.

## Contribuição e suporte

Contribuições são bem-vindas! Consulte as [Diretrizes de contribuição](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md). Se o projeto for útil para você, considere:

- ⭐ Dar uma estrela no repositório
- 🤝 Contribuir com código
- 💡 [Sugerir novas funcionalidades](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reportar bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE).

## Changelog

Veja o [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-utils/CHANGELOG.md) para alterações e histórico de versões.

---

Feito com ❤️ por [Lacus Solutions](https://github.com/LacusSolutions)
