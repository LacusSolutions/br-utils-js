![cpf-utils para JavaScript](https://br-utils.vercel.app/img/cover_cpf-utils.jpg)

> 🌎 [Access documentation in English](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-utils/README.md)

Kit em JavaScript/TypeScript para formatar, gerar e validar CPF (Cadastro de Pessoa Física). Unifica em uma única API os pacotes [`@lacussoft/cpf-fmt`](https://www.npmjs.com/package/@lacussoft/cpf-fmt), [`@lacussoft/cpf-gen`](https://www.npmjs.com/package/@lacussoft/cpf-gen) e [`@lacussoft/cpf-val`](https://www.npmjs.com/package/@lacussoft/cpf-val).

## Recursos

- ✅ **API unificada**: Uma instância padrão com `format`, `generate` e `isValid`; ou uso direto dos helpers `cpfFmt`, `cpfGen` e `cpfVal`
- ✅ **Instância reutilizável**: Classe `CpfUtils` com configurações padrão opcionais (opções ou instâncias do formatador, gerador e validador)
- ✅ **Reexportações completas**: Todas as classes, opções, erros e tipos do formatador, gerador e validador dos três pacotes
- ✅ **TypeScript**: Definições de tipo completas e compatível com strict mode
- ✅ **Tratamento de erros**: Mesmos erros de tipo e exceções dos pacotes subjacentes

## Instalação

```bash
# usando NPM
$ npm install --save cpf-utils

# usando Bun
$ bun add cpf-utils
```

## Início rápido

```ts
// ES Modules — instância padrão
import cpfUtils from 'cpf-utils'

// Ou exportações nomeadas (tree-shaking)
import { CpfUtils, cpfFmt, cpfGen, cpfVal } from 'cpf-utils'

// Common JS
const cpfUtils = require('cpf-utils')
```

Uso básico:

```ts
const cpf = '47844241055'

cpfUtils.format(cpf)     // '478.442.410-55'

cpfUtils.format(cpf, {   // '478.***.***-**'
  hidden: true
})

cpfUtils.format(cpf, {   // '478442410_55'
  dotKey: '',
  dashKey: '_'
})

cpfUtils.generate()                         // ex.: '47844241055'
cpfUtils.generate({ format: true })         // ex.: '478.442.410-55'
cpfUtils.generate({ prefix: '528250911' })  // ex.: '52825091138'
cpfUtils.generate({ prefix: '528250911', format: true })  // ex.: '528.250.911-38'

cpfUtils.isValid('12345678909')       // true
cpfUtils.isValid('123.456.789-09')     // true
cpfUtils.isValid('12345678910')       // false
```

Para frontends legados, inclua o build UMD (ex.: minificado) em uma tag `<script>`; `cpfUtils` fica disponível globalmente:

```html
<script src="https://cdn.jsdelivr.net/npm/cpf-utils@latest/dist/cpf-utils.min.js"></script>
```

## Utilização

### Opções do formatador

Em `format(cpfInput, options?)`, todas as opções são opcionais:

| Opção | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `hidden` | boolean | `false` | Se `true`, mascara os dígitos entre `hiddenStart` e `hiddenEnd` com `hiddenKey` |
| `hiddenKey` | string | `'*'` | Caractere(s) usados para substituir os dígitos mascarados |
| `hiddenStart` | number | `3` | Índice inicial (0–10, inclusivo) do intervalo a ocultar |
| `hiddenEnd` | number | `10` | Índice final (0–10, inclusivo) do intervalo a ocultar |
| `dotKey` | string | `'.'` | Delimitador de ponto (ex.: em `123.456.789`) |
| `dashKey` | string | `'-'` | Delimitador de hífen (ex.: antes dos dígitos verificadores `…-55`) |
| `escape` | boolean | `false` | Se `true`, escapa caracteres especiais HTML no resultado |
| `encode` | boolean | `false` | Se `true`, codifica o resultado para URL (ex.: query params) |
| `onFail` | (value, exception) => string | `() => ''` | Callback quando o tamanho da entrada sanitizada ≠ 11; o retorno é usado como resultado |

### Opções do gerador

Em `generate(options?)`, todas as opções são opcionais:

| Opção | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `format` | boolean | `false` | Se `true`, retorna o CPF gerado no formato padrão (`000.000.000-00`) |
| `prefix` | string | `''` | String inicial parcial (0–9 dígitos). Os caracteres faltantes são gerados e os dígitos verificadores calculados. |

Regras do prefixo: a base (9 primeiros dígitos) não pode ser só zeros; 9 dígitos repetidos (ex.: `999999999`) não são permitidos.

### `cpfUtils` (instância padrão)

A exportação padrão é uma instância pré-construída de `CpfUtils`. Use para chamadas rápidas:

- **`format(cpfInput, options?)`**: Formata uma string ou array de strings de CPF. Delega ao formatador interno. A entrada deve ter 11 dígitos (após sanitização); caso contrário `onFail` é usado.
- **`generate(options?)`**: Gera um CPF válido. Delega ao gerador interno.
- **`isValid(cpfInput)`**: Retorna `true` se o CPF for válido. Delega ao validador interno.

### `CpfUtils` (classe)

Para formatador, gerador ou validador padrão customizados, crie sua própria instância:

```ts
import { CpfUtils, CpfFormatter, CpfGenerator, CpfValidator } from 'cpf-utils'

// Configurações padrão (todas opcionais)
const utils = new CpfUtils({
  formatter: { hidden: true, hiddenKey: '#' },
  generator: { format: true, prefix: '123' },
})

utils.format('47844241055')        // '478.###.###-##'
utils.generate()                  // ex.: '005.265.352-88'
utils.isValid('123.456.789-09')   // true

// Acessar ou substituir instâncias internas
utils.formatter  // CpfFormatter
utils.generator  // CpfGenerator
utils.validator  // CpfValidator
```

- **`constructor(defaultSettings?)`**: Opcional `CpfUtilsSettingsInput` — `formatter`, `generator` e `validator` podem ser um objeto de opções ou uma instância de `CpfFormatter` / `CpfGenerator` / `CpfValidator`. Chaves omitidas usam instâncias padrão.
- **`format(cpfInput, options?)`**: Igual à instância padrão; opções por chamada sobrescrevem as opções do formatador naquela chamada.
- **`generate(options?)`**: Igual à instância padrão; opções por chamada sobrescrevem as do gerador.
- **`isValid(cpfInput)`**: Igual à instância padrão.
- **`formatter`**, **`generator`**, **`validator`**: Getters (e setters) do formatador, gerador e validador internos.

### Uso direto dos helpers e classes

Você pode usar o formatador, gerador e validador reexportados diretamente:

```ts
import {
  cpfFmt,
  CpfFormatter,
  cpfGen,
  CpfGenerator,
  cpfVal,
  CpfValidator,
} from 'cpf-utils'

cpfFmt('47844241055', { dashKey: '_' })   // '478.442.410_55'
cpfGen({ prefix: '123456' })              // ex.: '12345678901'
cpfVal('123.456.789-09')                   // true

const formatter = new CpfFormatter({ hidden: true })
formatter.format('47844241055')             // '478.***.***-**'
```

Consulte [@lacussoft/cpf-fmt](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-fmt/README.md), [@lacussoft/cpf-gen](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-gen/README.md) e [@lacussoft/cpf-val](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-val/README.md) para detalhes completos de opções e erros.

## API

### Exportações

- **`cpfUtils`** (padrão): Instância pré-construída de `CpfUtils` com `format`, `generate`, `isValid` e, nos formatos CommonJS e UMD, também as reexportações dos demais recursos dos três pacotes embarcados
- **`CpfUtils`**: Classe para criar uma instância com configurações opcionais de formatador, gerador e validador.
- **`CpfUtilsSettingsInput`**, **`CpfUtilsSettingsType`**: Tipos das configurações do construtor.
- **Formatador**: `cpfFmt`, `CpfFormatter`, `CpfFormatterOptions`, `CPF_LENGTH` e tipos/erros do formatador (ver cpf-fmt).
- **Gerador**: `cpfGen`, `CpfGenerator`, `CpfGeneratorOptions`, `CPF_LENGTH`, `CPF_PREFIX_MAX_LENGTH` e tipos/erros do gerador (ver cpf-gen).
- **Validador**: `cpfVal`, `CpfValidator` e tipos/erros do validador (ver cpf-val).

### Erros e exceções

Os erros e exceções são os mesmos dos pacotes subjacentes. Chamadas a `format` podem lançar erros de tipo/tamanho/opções do formatador; `generate` pode lançar exceções de opções/prefixo do gerador; `isValid` pode lançar erros de tipo de entrada do validador. Veja o README de cada pacote para a lista completa.

## Contribuição e suporte

Contribuições são bem-vindas! Consulte as [Diretrizes de contribuição](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md). Se o projeto for útil para você, considere:

- ⭐ Dar uma estrela no repositório
- 🤝 Contribuir com código
- 💡 [Sugerir novas funcionalidades](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reportar bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE).

## Changelog

Veja o [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-utils/CHANGELOG.md) para alterações e histórico de versões.

---

Feito com ❤️ por [Lacus Solutions](https://github.com/LacusSolutions)
