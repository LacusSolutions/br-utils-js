![cpf-fmt para JavaScript](https://br-utils.vercel.app/img/cover_cpf-fmt.jpg)

> 🌎 [Access documentation in English](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-fmt/README.md)

Utilitário em JavaScript/TypeScript para formatação de CPF (Cadastro de Pessoa Física).

## Recursos

- ✅ **Entrada flexível**: aceita string ou array de strings
- ✅ **Agnóstico ao formato**: remove caracteres não numéricos antes de formatar
- ✅ **Personalizável**: delimitadores (ponto, hífen), mascaramento (intervalo + substituição), escape HTML, codificação de URL
- ✅ **TypeScript**: Definições de tipo completas e compatível com strict mode
- ✅ **Dependências mínimas**: Sem dependências externas, apenas o pacote interno `@lacussoft/utils`
- ✅ **Tratamento de erros**: callback `onFail` configurável; uso opcional de classes de exceção específicas

## Instalação

```bash
# usando NPM
$ npm install --save @lacussoft/cpf-fmt

# usando Bun
$ bun add @lacussoft/cpf-fmt
```

## Início rápido

```ts
// ES Modules
import cpfFmt from '@lacussoft/cpf-fmt'

// Common JS
const cpfFmt = require('@lacussoft/cpf-fmt')
```

Uso básico:

```ts
const cpf = '03603568195'

cpfFmt(cpf)       // '036.035.681-95'

cpfFmt(cpf, {     // '036.***.***-**'
  hidden: true
})

cpfFmt(cpf, {     // '036035681 dv 95'
  dotKey: '',
  dashKey: ' dv '
})
```

Para frontends legados, inclua o build UMD (ex.: minificado) em uma tag `<script>`; `cpfFmt` fica disponível globalmente:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cpf-fmt@latest/dist/cpf-fmt.min.js"></script>
```

## Utilização

### Opções de formatação

Todas as opções são opcionais. Chaves planas (sem objetos aninhados `delimiters` ou `hiddenRange`):

| Opção | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `hidden` | boolean | `false` | Quando `true`, mascara os dígitos no intervalo `hiddenStart`–`hiddenEnd` com `hiddenKey` |
| `hiddenKey` | string | `'*'` | Caractere(s) usado(s) para substituir os dígitos mascarados |
| `hiddenStart` | number | `3` | Índice inicial (0–10, inclusivo) do intervalo a ocultar |
| `hiddenEnd` | number | `10` | Índice final (0–10, inclusivo) do intervalo a ocultar |
| `dotKey` | string | `'.'` | Delimitador de ponto (ex.: em `123.456.789`) |
| `dashKey` | string | `'-'` | Delimitador de hífen (ex.: antes dos dígitos verificadores `…-58`) |
| `escape` | boolean | `false` | Quando `true`, aplica escape a caracteres especiais HTML no resultado |
| `encode` | boolean | `false` | Quando `true`, codifica o resultado para URL (ex.: para parâmetros de query) |
| `onFail` | (value, exception) => string | `() => ''` | Callback quando o tamanho da entrada sanitizada ≠ 11; o retorno é usado como resultado |

Exemplo com todas as opções:

```ts
cpfFmt(cpf, {
  hidden: true,
  hiddenKey: '#',
  hiddenStart: 3,
  hiddenEnd: 9,
  dotKey: ' ',
  dashKey: '_-_',
  escape: true,
  encode: true,
  onFail(value, exception) {
    return String(value)
  },
})
```

### `cpfFmt` (função auxiliar)

Formata uma string de CPF. Sem opções, retorna o formato padrão (ex.: `123.456.789-10`). Entrada com **tipo** inválido (não é string nem array de strings) faz o código lançar `CpfFormatterInputTypeError`. **Comprimento** inválido (após remover caracteres não numéricos, o resultado não tem 11 dígitos) é tratado pelo callback `onFail` em vez de lançar exceção. É a forma mais prática de usar a biblioteca. Internamente, instancia um `CpfFormatter` e chama `format` em seguida.

- **`cpfInput`** (string ou array de strings): Valor com 11 dígitos, bruto ou já formatado (após sanitização).
- **`options`** (opcional): Veja [opções de formatação](#opções-de-formatação).

### `CpfFormatter` (classe)

Para padrões reutilizáveis, você pode criar seu próprio formatador:

```ts
import { CpfFormatter } from '@lacussoft/cpf-fmt'

const formatter = new CpfFormatter({ hidden: true, hiddenKey: '#' })

formatter.format('12345678910')                      // '123.###.###-##'
formatter.format('123.456.789-10')                   // '123.###.###-##'
formatter.format(['123', '456', '789', '10'])        // '123.###.###-##'
formatter.format('12345678910', { hidden: false })   // sobrescreve nesta chamada: '123.456.789-10'
```

- **`constructor`**: `new CpfFormatter(options?)` — as opções são opcionais e podem ser um objeto simples ou uma instância de `CpfFormatterOptions`.
- **`format(input, options?)`**: `input` pode ser `string` ou `string[]`; as `options` por chamada sobrescrevem os padrões da instância apenas para aquela chamada.

## API

### Exportações

- **`cpfFmt`** (padrão): `(cpfInput: string | string[], options?: CpfFormatterOptionsInput) => string`
- **`CpfFormatter`**: Classe para formatar CPF com opções padrão opcionais; aceita `string | string[]` em `format()`.
- **`CpfFormatterOptions`**: Classe que armazena as opções (dotKey, dashKey, hidden, hiddenKey, hiddenStart, hiddenEnd, escape, encode, onFail). Suporta merge via construtor ou `set()`.
- **`CPF_LENGTH`**: `11` (constante).
- **Tipos**: `CpfInput`, `CpfFormatterOptionsInput`, `CpfFormatterOptionsType`, `OnFailCallback`.

### Exceções

Ao usar `CpfFormatter`, tipo de entrada inválido (não string, não array de strings) sempre lança exceção. Opções inválidas lançam ao construir as opções. Comprimento inválido é repassado ao `onFail` por padrão. Podem ocorrer:

- **CpfFormatterTypeError** (base para erros de tipo)
- **CpfFormatterInputTypeError** — a entrada não é string nem string[]
- **CpfFormatterInputLengthException** — o comprimento da entrada sanitizada não é 11
- **CpfFormatterOptionsTypeError** — uma opção tem o tipo incorreto
- **CpfFormatterOptionsHiddenRangeInvalidException** — hiddenStart/hiddenEnd fora do intervalo 0..10
- **CpfFormatterOptionsForbiddenKeyCharacterException** — uma opção de key contém caractere não permitido

## Contribuição e suporte

Contribuições são bem-vindas! Consulte as [Diretrizes de contribuição](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md). Se o projeto for útil para você, considere:

- ⭐ Dar uma estrela no repositório
- 🤝 Contribuir com código
- 💡 [Sugerir novas funcionalidades](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reportar bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE) para detalhes.

## Changelog

Veja o [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-fmt/CHANGELOG.md) para alterações e histórico de versões.

---

Feito com ❤️ por [Lacus Solutions](https://github.com/LacusSolutions)
