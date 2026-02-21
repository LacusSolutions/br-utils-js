![cnpj-val para JavaScript](https://br-utils.vercel.app/img/cover_cnpj-val.jpg)

> 🚀 **Suporte completo ao novo formato alfanumérico de CNPJ.**

> 🌎 [Access documentation in English](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-val/README.md)

Utilitário em JavaScript/TypeScript para validar CNPJs (Cadastro Nacional da Pessoa Jurídica).

## Recursos

- ✅ **CNPJ alfanumérico**: Valida CNPJ de 14 caracteres no formato numérico ou alfanumérico
- ✅ **Entrada flexível**: Aceita string ou array de strings (formatado ou bruto)
- ✅ **Agnóstico ao formato**: Remove caracteres não alfanuméricos e opcionalmente converte para maiúsculas antes de validar
- ✅ **Sensibilidade a maiúsculas opcional**: Com `caseSensitive` em `false`, letras minúsculas são aceitas para CNPJ alfanumérico
- ✅ **TypeScript**: Definições de tipo completas e compatível com strict mode
- ✅ **Dependências mínimas**: Depende apenas do pacote interno `@lacussoft/cnpj-dv` para verificação dos dígitos verificadores
- ✅ **Tratamento de erros**: Erros de tipo e exceções específicas para opções ou tipo de entrada inválidos

## Instalação

```bash
# usando NPM
$ npm install --save @lacussoft/cnpj-val

# usando Bun
$ bun add @lacussoft/cnpj-val
```

## Início rápido

```ts
// ES Modules
import cnpjVal from '@lacussoft/cnpj-val'

// Common JS
const cnpjVal = require('@lacussoft/cnpj-val')
```

Uso básico:

```ts
cnpjVal('98765432000198')      // true
cnpjVal('98.765.432/0001-98')  // true
cnpjVal('98765432000199')      // false (dígitos verificadores inválidos)

cnpjVal('1QB5UKALPYFP59')           // true (alfanumérico)
cnpjVal('1QB5UKALpyfp59')           // false (padrão é case-sensitive)
cnpjVal('1QB5UKALpyfp59', { caseSensitive: false })  // true

cnpjVal('96206256120884')            // true (numérico)
cnpjVal('96206256120884', { type: 'numeric' })  // true
cnpjVal('1QB5UKALPYFP59', { type: 'numeric' })  // false (letras não permitidas quando type é numeric)
```

Para frontends legados, inclua o build UMD (ex.: minificado) em uma tag `<script>`; `cnpjVal` fica disponível globalmente:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cnpj-val@latest/dist/cnpj-val.min.js"></script>
```

## Uso

### Opções do validador

Todas as opções são opcionais:

| Opção | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `caseSensitive` | boolean | `true` | Se `false`, letras minúsculas são aceitas para CNPJ alfanumérico (a entrada é convertida para maiúsculas antes da validação). |
| `type` | `'numeric'` \| `'alphanumeric'` | `'alphanumeric'` | `'numeric'`: apenas dígitos (0–9) após sanitização; `'alphanumeric'`: dígitos e letras (0–9, A–Z). |

### `cnpjVal` (função auxiliar)

Valida uma string ou array de strings de CNPJ. Retorna `true` se a entrada for um CNPJ válido (tamanho correto, base/filial elegíveis e dígitos verificadores corretos), caso contrário `false`. Entrada inválida (ex.: tamanho errado, base/filial ineligíveis, dígitos repetidos) resulta em `false` sem lançar exceção. É um atalho para `new CnpjValidator(options).isValid(cnpjInput)`.

- **`cnpjInput`**: `CnpjInput` — string ou array de strings (formatado ou bruto; não alfanuméricos removidos conforme `type`).
- **`options`** (opcional): `CnpjValidatorOptionsInput` — ver [Opções do validador](#opções-do-validador).

**Lança:** `CnpjValidatorInputTypeError` se a entrada não for string nem string[]; `CnpjValidatorOptionsTypeError` ou `CnpjValidatorOptionTypeInvalidException` se as opções forem inválidas.

### `CnpjValidator` (classe)

Para opções padrão reutilizáveis ou sobrescritas por chamada, use a classe:

```ts
import { CnpjValidator } from '@lacussoft/cnpj-val'

const validator = new CnpjValidator({ type: 'numeric', caseSensitive: false })

validator.options                         // opções padrão atuais (CnpjValidatorOptions)
validator.isValid('98.765.432/0001-98')   // true
validator.isValid('1QB5UKALpyfp59', {     // sobrescreve nesta chamada: false
  type: 'alphanumeric',
  caseSensitive: true,
})
```

- **`constructor`**: `new CnpjValidator(defaultOptions?)` — opções padrão opcionais (objeto simples ou instância de `CnpjValidatorOptions`).
- **`isValid(cnpjInput, options?)`**: Retorna `true` se o CNPJ for válido; `options` por chamada sobrescrevem as opções da instância apenas naquela chamada.
- **`options`**: Getter que retorna as opções padrão usadas quando não se passam opções na chamada (mesma instância usada internamente; alterá-la afeta chamadas futuras de `isValid`).

### `CnpjValidatorOptions` (classe)

Armazena as opções (`caseSensitive`, `type`) com validação e merge:

```ts
import { CnpjValidatorOptions } from '@lacussoft/cnpj-val'

const options = new CnpjValidatorOptions({
  caseSensitive: false,
  type: 'numeric',
})
options.caseSensitive   // false
options.type           // 'numeric'
options.set({ type: 'alphanumeric' })  // merge e retorna this
options.all            // cópia superficial congelada das opções atuais
```

- **`constructor`**: `new CnpjValidatorOptions(defaultOptions?, ...overrides)` — opções mescladas na ordem.
- **`caseSensitive`**, **`type`**: Getters/setters; `type` é validado (`'alphanumeric'` ou `'numeric'`).
- **`set(options)`**: Atualiza várias opções de uma vez; retorna `this`.
- **`all`**: Snapshot somente leitura das opções atuais.

## API

### Exportações

- **`cnpjVal`** (default): `(cnpjInput: CnpjInput, options?: CnpjValidatorOptionsInput) => boolean`
- **`CnpjValidator`**: Classe para validar CNPJ com opções padrão opcionais e sobrescritas por chamada.
- **`CnpjValidatorOptions`**: Classe que armazena as opções (`caseSensitive`, `type`) com validação e merge.
- **`CNPJ_LENGTH`**: `14` (constante).
- **Tipos**: `CnpjType`, `CnpjInput`, `CnpjValidatorOptionsInput`, `CnpjValidatorOptionsType`, `Nullable<T>`.

### Erros e exceções

Este pacote usa **TypeError** para tipos de opção/entrada inválidos e **Exception** para valores de opção inválidos. Você pode capturar classes específicas ou as bases.

- **CnpjValidatorTypeError** (_abstract_) — base para erros de tipo
- **CnpjValidatorInputTypeError** — entrada não é string nem string[]
- **CnpjValidatorOptionsTypeError** — uma opção tem tipo incorreto (ex.: `type` não é string)
- **CnpjValidatorException** (_abstract_) — base para exceções de valor de opção
- **CnpjValidatorOptionTypeInvalidException** — `type` não é um de `'alphanumeric'`, `'numeric'`

```ts
import cnpjVal, {
  CnpjValidatorInputTypeError,
  CnpjValidatorOptionsTypeError,
  CnpjValidatorOptionTypeInvalidException,
  CnpjValidatorException,
} from '@lacussoft/cnpj-val'

// Tipo de entrada (ex.: número não permitido)
try {
  cnpjVal(12345678000198)
} catch (e) {
  if (e instanceof CnpjValidatorInputTypeError) {
    console.log(e.message)  // CNPJ input must be of type string or string[]. Got integer number.
  }
}

// Tipo de opção (ex.: `type` deve ser string)
try {
  cnpjVal('98765432000198', { type: 123 })
} catch (e) {
  if (e instanceof CnpjValidatorOptionsTypeError) {
    console.log(e.message)  // CNPJ validator option "type" must be of type string. Got integer number.
  }
}

// Valor de type inválido
try {
  cnpjVal('98765432000198', { type: 'invalid' })
} catch (e) {
  if (e instanceof CnpjValidatorOptionTypeInvalidException) {
    console.log(e.expectedValues, e.actualInput)
  }
}

// Qualquer exceção do pacote
try {
  cnpjVal('98765432000198', { type: 'invalid' })
} catch (e) {
  if (e instanceof CnpjValidatorException) {
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

Veja o [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-val/CHANGELOG.md) para alterações e histórico de versões.

---

Feito com ❤️ por [Lacus Solutions](https://github.com/LacusSolutions)
