![cnpj-gen para JavaScript](https://br-utils.vercel.app/img/cover_cnpj-gen.jpg)

> 🚀 **Suporte total ao [novo formato alfanumérico de CNPJ](https://github.com/user-attachments/files/23937961/calculodvcnpjalfanaumerico.pdf).**

> 🌎 [Access documentation in English](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-gen/README.md)

Utilitário em JavaScript/TypeScript para gerar CNPJs válidos (Cadastro Nacional da Pessoa Jurídica).

## Recursos

- ✅ **CNPJ alfanumérico**: Gera CNPJ de 14 caracteres com conjuntos opcionais numérico, alfabético ou alfanumérico (padrão)
- ✅ **Prefixo opcional**: Informe de 1 a 12 caracteres alfanuméricos para fixar o início do CNPJ (ex.: base) e gerar o restante com dígitos verificadores válidos
- ✅ **Formatação**: Opção de retornar a string no formato padrão (`00.000.000/0000-00`)
- ✅ **Gerador reutilizável**: Classe `CnpjGenerator` com opções padrão e sobrescritas por chamada
- ✅ **TypeScript**: Definições de tipo completas e compatível com strict mode
- ✅ **Dependências mínimas**: Sem dependências externas, apenas pacotes internos como `@lacussoft/utils`, e `@lacussoft/cnpj-dv` para o cálculo dos dígitos verificadores
- ✅ **Tratamento de erros**: Erros de tipo e exceções específicas para opções inválidas

## Instalação

```bash
# usando NPM
$ npm install --save @lacussoft/cnpj-gen

# usando Bun
$ bun add @lacussoft/cnpj-gen
```

## Início rápido

```ts
// ES Modules
import cnpjGen from '@lacussoft/cnpj-gen'

// Common JS
const cnpjGen = require('@lacussoft/cnpj-gen')
```

Uso básico:

```ts
cnpjGen()                    // ex.: 'AB123CDE000155' (14 caracteres alfanuméricos)

cnpjGen({ format: true })     // ex.: 'AB.123.CDE/0001-55'

cnpjGen({ prefix: '45623767' })           // ex.: '45623767000296'
cnpjGen({ prefix: '456237670002', format: true })  // ex.: '45.623.767/0002-96'

cnpjGen({ type: 'numeric' })  // ex.: '65453043000178' (apenas dígitos)
cnpjGen({ type: 'alphabetic' })  // ex.: 'ABCDEFGHIJKL80' (apenas letras, exceto dígitos verificadores)
```

Para frontends legados, inclua o build UMD (ex.: minificado) em uma tag `<script>`; `cnpjGen` fica disponível globalmente:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cnpj-gen@latest/dist/cnpj-gen.min.js"></script>
```

## Uso

### Opções do gerador

Todas as opções são opcionais:

| Opção | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `format` | boolean | `false` | Se `true`, retorna o CNPJ gerado no formato padrão (`00.000.000/0000-00`) |
| `prefix` | string | `''` | String inicial parcial (1–12 caracteres alfanuméricos). Apenas alfanuméricos são mantidos e convertidos para maiúsculas; os caracteres faltantes são gerados aleatoriamente e os dígitos verificadores são calculados. |
| `type` | `'numeric'` \| `'alphabetic'` \| `'alphanumeric'` | `'alphanumeric'` | Conjunto de caracteres da parte gerada aleatoriamente (o `prefix` é mantido após sanitização). **Os dígitos verificadores são sempre numéricos.** |

Regras do prefixo: a base (primeiros 8 caracteres) e a filial (caracteres 9–12) não podem ser todos zeros; 12 dígitos repetidos (ex.: `777777777777`) também não são permitidos.

### `cnpjGen` (função auxiliar)

Gera uma string de CNPJ válida. Sem opções, retorna um CNPJ alfanumérico de 14 caracteres. É um atalho para `new CnpjGenerator(options).generate()`.

- **`options`** (opcional): `CnpjGeneratorOptionsInput` — ver [Opções do gerador](#opções-do-gerador).

### `CnpjGenerator` (classe)

Para opções padrão reutilizáveis ou sobrescritas por chamada, use a classe:

```ts
import { CnpjGenerator } from '@lacussoft/cnpj-gen'

const generator = new CnpjGenerator({ type: 'numeric', format: true })

generator.generate()           // ex.: '73.008.535/0005-06'
generator.generate({ prefix: '12345678' })  // sobrescreve apenas nesta chamada
generator.options              // opções padrão atuais (CnpjGeneratorOptions)
```

- **`constructor`**: `new CnpjGenerator(defaultOptions?)` — opções padrão opcionais (objeto simples ou instância de `CnpjGeneratorOptions`).
- **`generate(options?)`**: Retorna um CNPJ válido; `options` por chamada sobrescrevem as opções da instância apenas naquela chamada.
- **`options`**: Getter que retorna as opções padrão usadas quando não se passam opções na chamada (mesma instância usada internamente; alterá-la afeta chamadas futuras de `generate`).

### `CnpjGeneratorOptions` (classe)

Armazena as opções (`format`, `prefix`, `type`) com validação e merge:

```ts
import { CnpjGeneratorOptions } from '@lacussoft/cnpj-gen'

const options = new CnpjGeneratorOptions({
  prefix: 'AB123XYZ',
  type: 'numeric',
  format: true,
})
options.prefix   // 'AB123XYZ'
options.type     // 'numeric'
options.format   // true
options.set({ format: false })  // merge e retorna this
options.all      // cópia superficial congelada das opções atuais
```

- **`constructor`**: `new CnpjGeneratorOptions(defaultOptions?, ...overrides)` — opções mescladas na ordem.
- **`format`**, **`prefix`**, **`type`**: Getters/setters; o prefixo é validado (tamanho, base/filial ineligíveis, dígitos repetidos).
- **`set(options)`**: Atualiza várias opções de uma vez; retorna `this`.
- **`all`**: Snapshot somente leitura das opções atuais.

## API

### Exportações

- **`cnpjGen`** (default): `(options?: CnpjGeneratorOptionsInput) => string`
- **`CnpjGenerator`**: Classe para gerar CNPJ com opções padrão opcionais e sobrescritas por chamada.
- **`CnpjGeneratorOptions`**: Classe que armazena as opções (`format`, `prefix`, `type`) com validação e merge.
- **`CNPJ_LENGTH`**: `14` (constante).
- **`CNPJ_PREFIX_MAX_LENGTH`**: `12` (constante).
- **Tipos**: `CnpjType`, `CnpjGeneratorOptionsInput`, `CnpjGeneratorOptionsType`.

### Erros e exceções

Este pacote usa **TypeError** para tipos de opção inválidos e **Exception** para valores inválidos (`prefix` ou `type`). Você pode capturar classes específicas ou as bases.

- **CnpjGeneratorTypeError** (_abstract_) — base para erros de tipo em opções
- **CnpjGeneratorOptionsTypeError** — uma opção tem tipo incorreto (ex.: `prefix` não é string)
- **CnpjGeneratorException** (_abstract_) — base para exceções de valor de opção
- **CnpjGeneratorOptionPrefixInvalidException** — prefixo inválido (ex.: base/filial zerados, dígitos repetidos, tamanho inválido)
- **CnpjGeneratorOptionTypeInvalidException** — `type` não é um de `'numeric'`, `'alphabetic'`, `'alphanumeric'`

```ts
import cnpjGen, {
  CnpjGeneratorOptionsTypeError,
  CnpjGeneratorOptionPrefixInvalidException,
  CnpjGeneratorOptionTypeInvalidException,
  CnpjGeneratorException,
} from '@lacussoft/cnpj-gen'

// Tipo de opção (ex.: `prefix` deve ser string)
try {
  cnpjGen({ prefix: 123 })
} catch (e) {
  if (e instanceof CnpjGeneratorOptionsTypeError) {
    console.log(e.message)  // CNPJ generator option "prefix" must be of type string. Got integer number.
  }
}

// Prefixo inválido (ex.: base zerada)
try {
  cnpjGen({ prefix: '000000000001' })
} catch (e) {
  if (e instanceof CnpjGeneratorOptionPrefixInvalidException) {
    console.log(e.reason, e.actualInput)
  }
}

// Valor de type inválido
try {
  cnpjGen({ type: 'invalid' })
} catch (e) {
  if (e instanceof CnpjGeneratorOptionTypeInvalidException) {
    console.log(e.expectedValues, e.actualInput)
  }
}

// Qualquer exceção do pacote
try {
  cnpjGen({ prefix: '000000000000' })
} catch (e) {
  if (e instanceof CnpjGeneratorException) {
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

Veja o [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-gen/CHANGELOG.md) para alterações e histórico de versões.

---

Feito com ❤️ por [Lacus Solutions](https://github.com/LacusSolutions)
