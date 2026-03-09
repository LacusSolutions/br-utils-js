![cpf-val para JavaScript](https://br-utils.vercel.app/img/cover_cpf-val.jpg)

> 🌎 [Access documentation in English](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-val/README.md)

Utilitário em JavaScript/TypeScript para validar CPFs (Cadastro de Pessoa Física).

## Recursos

- ✅ **Entrada flexível**: Aceita string ou array de strings (formatado ou bruto)
- ✅ **Agnóstico ao formato**: Remove caracteres não numéricos antes da validação
- ✅ **TypeScript**: Definições de tipo completas e compatível com strict mode
- ✅ **Dependências mínimas**: Sem dependências externas, apenas pacotes internos como `@lacussoft/utils`, e `@lacussoft/cpf-dv` para o cálculo dos dígitos verificadores
- ✅ **Tratamento de erros**: Erro de tipo específico para tipo de entrada inválido

## Instalação

```bash
# usando NPM
$ npm install --save @lacussoft/cpf-val

# usando Bun
$ bun add @lacussoft/cpf-val
```

## Início rápido

```ts
// ES Modules
import cpfVal from '@lacussoft/cpf-val'

// Common JS
const cpfVal = require('@lacussoft/cpf-val')
```

Uso básico:

```ts
cpfVal('12345678909')      // true
cpfVal('123.456.789-09')   // true
cpfVal('12345678910')      // false (dígitos verificadores inválidos)

cpfVal(['123', '456', '789', '09'])        // true (array de strings)
cpfVal(['1', '2', '3', '...', '0', '9'])   // true (array de strings)
```

Para frontends legados, inclua o build UMD (ex.: minificado) em uma tag `<script>`; `cpfVal` fica disponível globalmente:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cpf-val@latest/dist/cpf-val.min.js"></script>
```

## Utilização

### `cpfVal` (função auxiliar)

Valida uma string ou array de strings de CPF. Retorna `true` se a entrada for um CPF válido (11 dígitos após sanitização, base elegível e dígitos verificadores corretos), caso contrário `false`. Entrada inválida (ex.: tamanho errado, base ineligível como dígitos repetidos) resulta em `false` sem lançar exceção. É um atalho para `new CpfValidator().isValid(cpfInput)`.

- **`cpfInput`**: `CpfInput` — string ou array de strings (formatado ou bruto; caracteres não numéricos são removidos).

**Lança:** `CpfValidatorInputTypeError` se a entrada não for string nem string[].

### `CpfValidator` (classe)

Para lógica de validação reutilizável, use a classe:

```ts
import { CpfValidator } from '@lacussoft/cpf-val'

const validator = new CpfValidator()

validator.isValid('123.456.789-09')   // true
validator.isValid('12345678909')      // true
validator.isValid(['123', '456', '789', '10'])  // false
```

- **`constructor`**: `new CpfValidator()` — sem opções.
- **`isValid(cpfInput)`**: Retorna `true` se o CPF for válido, `false` caso contrário.

### Formatos de entrada

**Entrada em string:** dígitos simples ou CPF formatado (ex.: `123.456.789-09`). Caracteres não numéricos são removidos automaticamente. Deve ter 11 dígitos após a sanitização.

**Array de strings:** strings de um ou vários caracteres (concatenadas antes da validação), ex.: `['1','2','3','4','5','6','7','8','9','0','9']`, `['123','456','789','09']`.

## API

### Exportações

- **`cpfVal`** (padrão): `(cpfInput: CpfInput) => boolean`
- **`CpfValidator`**: Classe para validar CPF (sem opções).
- **`CPF_LENGTH`**: `11` (constante).
- **Tipos**: `CpfInput` (`string | readonly string[]`).

### Erros e exceções

Este pacote usa **TypeError** para tipo de entrada inválido. Valores de CPF inválidos (tamanho errado, base ineligível) retornam `false` e não lançam exceção.

- **CpfValidatorTypeError** (_abstract_) — base para erros de tipo
- **CpfValidatorInputTypeError** — entrada não é string nem string[]
- **CpfValidatorException** (_abstract_) — base para exceções não relacionadas a tipo (atualmente não utilizada por este pacote)

```ts
import cpfVal, {
  CpfValidatorInputTypeError,
  CpfValidatorTypeError,
} from '@lacussoft/cpf-val'

// Tipo de entrada (ex.: número não permitido)
try {
  cpfVal(12345678909)
} catch (e) {
  if (e instanceof CpfValidatorInputTypeError) {
    console.log(e.message)  // CPF input must be of type string or string[]. Got integer number.
  }
}

// Qualquer erro de tipo do pacote
try {
  cpfVal(null)
} catch (e) {
  if (e instanceof CpfValidatorTypeError) {
    // tratar
  }
}
```

## Contribuição e suporte

Contribuições são bem-vindas! Consulte as [Diretrizes de contribuição](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md). Se o projeto for útil para você, considere:

- ⭐ Dar uma estrela no repositório
- 🤝 Contribuir com código
- 💡 [Sugerir novas funcionalidades](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reportar bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE).

## Changelog

Veja o [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-val/CHANGELOG.md) para alterações e histórico de versões.

---

Feito com ❤️ por [Lacus Solutions](https://github.com/LacusSolutions)
