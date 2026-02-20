![cnpj-fmt para JavaScript](https://br-utils.vercel.app/img/cover_cnpj-fmt.jpg)

> 🚀 **Suporte completo ao novo formato alfanumérico de CNPJ.**

> 🌎 [Access documentation in English](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-fmt/README.md)

Utilitário em JavaScript/TypeScript para formatar CNPJ (Cadastro Nacional da Pessoa Jurídica).

## Recursos

- ✅ **CNPJ alfanumérico**: Suporte a CNPJ de 14 caracteres alfanuméricos (dígitos e letras, ex.: `RK0CMT3W000100`)
- ✅ **Entrada flexível**: aceita string ou array de strings
- ✅ **Agnóstico ao formato**: Remove caracteres não alfanuméricos e converte para maiúsculas antes de formatar
- ✅ **Customizável**: Delimitadores (ponto, barra, hífen), mascaramento (intervalo + caractere de substituição), escape HTML e codificação para URL
- ✅ **TypeScript**: Definições de tipo completas e compatível com strict mode
- ✅ **Zero dependências**: Nenhuma dependência externa
- ✅ **Tratamento de erros**: Callback `onFail` configurável; uso opcional de classes de exceção específicas

## Instalação

```bash
# com NPM
$ npm install --save @lacussoft/cnpj-fmt

# com Bun
$ bun add @lacussoft/cnpj-fmt
```

## Início rápido

```ts
// ES Modules
import cnpjFmt from '@lacussoft/cnpj-fmt'

// Common JS
const cnpjFmt = require('@lacussoft/cnpj-fmt')
```

Uso básico:

```ts
const cnpj = '03603568000195'

cnpjFmt(cnpj)       // '03.603.568/0001-95'

cnpjFmt(cnpj, {     // '03.603.***/****-**'
  hidden: true
})

cnpjFmt(cnpj, {     // '03603568|0001_95'
  dotKey: '',
  slashKey: '|',
  dashKey: '_'
})
```

Para frontends legados, inclua o build UMD (ex.: minificado) em uma tag `<script>`; `cnpjFmt` fica disponível globalmente:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cnpj-fmt@latest/dist/cnpj-fmt.min.js"></script>
```

## Uso

### Opções de formatação

Todas as opções são opcionais:

| Opção | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `dotKey` | string | `'.'` | Delimitador de ponto (ex.: em `12.345.678`) |
| `slashKey` | string | `'/'` | Delimitador de barra (ex.: antes do filial `…/0001-90`) |
| `dashKey` | string | `'-'` | Delimitador de hífen (ex.: antes dos dígitos verificadores `…-90`) |
| `hidden` | boolean | `false` | Se `true`, mascara caracteres entre `hiddenStart` e `hiddenEnd` com `hiddenKey` |
| `hiddenKey` | string | `'*'` | Caractere(s) que substituem os dígitos mascarados |
| `hiddenStart` | number | `5` | Índice inicial (0–13, inclusivo) do intervalo a ocultar |
| `hiddenEnd` | number | `13` | Índice final (0–13, inclusivo) do intervalo a ocultar |
| `escape` | boolean | `false` | Se `true`, escapa caracteres especiais HTML no resultado |
| `encode` | boolean | `false` | Se `true`, codifica o resultado para URL (ex.: query params) |
| `onFail` | (value, error?) => string | `() => ''` | Callback quando o tamanho da entrada sanitizada ≠ 14; o retorno é usado como resultado (tipo de entrada inválido lança exceção) |

Exemplo com todas as opções:

```ts
cnpjFmt(cnpj, {
  hidden: true,
  hiddenKey: '#',
  hiddenStart: 5,
  hiddenEnd: 11,
  dotKey: ' ',
  slashKey: '|',
  dashKey: '_-_',
  escape: true,
  encode: true,
  onFail(value, error) {
    return String(value)
  },
})
```

### `cnpjFmt` (função auxiliar)

Formata uma string de CNPJ. Sem opções, retorna o formato padrão (ex.: `91.415.732/0007-93`). Entrada com **tipo** inválido (não é string nem array de strings) faz o código lançar `CnpjFormatterInputTypeError`. **Tamanho** inválido (após remover caracteres não alfanuméricos, o resultado não tem 14 caracteres) é tratado pelo callback `onFail` em vez de lançar exceção. É a forma mais prática de usar a biblioteca; internamente instancia um `CnpjFormatter` e chama `format`.

- **`cnpjInput`** (string ou array de strings): CNPJ bruto ou já formatado, 14 caracteres alfanuméricos (após sanitização).
- **`options`** (opcional): Ver [opções de formatação](#opções-de-formatação).

### `CnpjFormatter` (classe)

Para opções padrão reutilizáveis, crie seu próprio formatador:

```ts
import { CnpjFormatter } from '@lacussoft/cnpj-fmt'

const formatter = new CnpjFormatter({ hidden: true, hiddenKey: '#' })

formatter.format('RK0CMT3W000100')                      // 'RK.0CM.###/####-##'
formatter.format('RK.0CM.T3W/0001-00')                  // 'RK.0CM.###/####-##'
formatter.format(['RK', '0CM', 'T3W', '0001', '00'])    // 'RK.0CM.###/####-##'
formatter.format('RK0CMT3W000100', { hidden: false })   // sobrescreve nesta chamada: 'RK.0CM.T3W/0001-00'
```

- **`constructor`**: `new CnpjFormatter(options?)` — opções são opcionais e podem ser um objeto simples ou uma instância de `CnpjFormatterOptions`.
- **`format(input, options?)`**: `input` pode ser `string` ou `string[]`; `options` por chamada sobrescrevem as opções padrão da instância apenas naquela chamada.

## API

### Exportações

- **`cnpjFmt`** (default): `(cnpjInput: string | string[], options?: CnpjFormatterOptionsInput) => string`
- **`CnpjFormatter`**: Classe para formatar CNPJ com opções padrão ou customizadas; aceita `string | string[]` em `format()`.
- **`CnpjFormatterOptions`**: Classe que armazena as opções (dotKey, slashKey, dashKey, hidden, hiddenKey, hiddenStart, hiddenEnd, escape, encode, onFail). Suporta merge via construtor ou `set()`.
- **`CNPJ_LENGTH`**: `14` (constante).
- **Tipos**: `CnpjInput`, `CnpjFormatterOptionsInput`, `CnpjFormatterOptionsType`, `OnFailCallback`, `Nullable<T>`.

### Exceções

Ao usar `CnpjFormatter`, tipo de entrada inválido (não string, não array de strings) sempre lança exceção. Opções inválidas lançam ao construir as opções. Tamanho inválido é repassado ao `onFail` por padrão. Você pode encontrar:

- **CnpjFormatterTypeError** (base para erros de tipo)
- **CnpjFormatterInputTypeError** — entrada não é string nem string[]
- **CnpjFormatterInputLengthException** — tamanho da entrada sanitizada não é 14
- **CnpjFormatterOptionsTypeError** — uma opção tem tipo incorreto
- **CnpjFormatterOptionsHiddenRangeInvalidException** — hiddenStart/hiddenEnd fora de 0..13
- **CnpjFormatterOptionsForbiddenKeyCharacterException** — uma opção de caractere contém caractere não permitido

## Contribuição e suporte

Contribuições são bem-vindas! Consulte as [Diretrizes de contribuição](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md). Se o projeto for útil para você, considere:

- ⭐ Dar uma estrela no repositório
- 🤝 Contribuir com código
- 💡 [Sugerir novas funcionalidades](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reportar bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE).

## Changelog

Veja o [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-fmt/CHANGELOG.md) para alterações e histórico de versões.

---

Feito com ❤️ por [Lacus Solutions](https://github.com/LacusSolutions)
