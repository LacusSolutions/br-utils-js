![cpf-gen para JavaScript](https://br-utils.vercel.app/img/cover_cpf-gen.jpg)

> 🌎 [Access documentation in English](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-gen/README.md)

Utilitário em JavaScript/TypeScript para gerar CPFs válidos (Cadastro de Pessoa Física).

## Recursos

- ✅ **Prefixo opcional**: Informe de 0 a 9 dígitos para fixar o início do CPF e gerar o restante com dígitos verificadores válidos
- ✅ **Formatação**: Opção de retornar a string no formato padrão (`000.000.000-00`)
- ✅ **Gerador reutilizável**: Classe `CpfGenerator` com opções padrão e sobrescritas por chamada
- ✅ **TypeScript**: Definições de tipo completas e compatível com strict mode
- ✅ **Dependências mínimas**: Sem dependências externas, apenas pacotes internos como `@lacussoft/utils`, e `@lacussoft/cpf-dv` para o cálculo dos dígitos verificadores
- ✅ **Tratamento de erros**: Erros de tipo e exceções específicas para opções inválidas

## Instalação

```bash
# usando NPM
$ npm install --save @lacussoft/cpf-gen

# usando Bun
$ bun add @lacussoft/cpf-gen
```

## Início rápido

```ts
// ES Modules
import cpfGen from '@lacussoft/cpf-gen'

// Common JS
const cpfGen = require('@lacussoft/cpf-gen')
```

Uso básico:

```ts
cpfGen()                    // ex.: '47844241055' (11 dígitos numéricos)

cpfGen({ format: true })     // ex.: '005.265.352-88'

cpfGen({ prefix: '528250911' })           // ex.: '52825091138'
cpfGen({ prefix: '528250911', format: true })  // ex.: '528.250.911-38'
```

Para frontends legados, inclua o build UMD (ex.: minificado) em uma tag `<script>`; `cpfGen` fica disponível globalmente:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cpf-gen@latest/dist/cpf-gen.min.js"></script>
```

## Utilização

### Opções do gerador

Todas as opções são opcionais:

| Opção | Tipo | Padrão | Descrição |
|--------|------|---------|-------------|
| `format` | boolean | `false` | Se `true`, retorna o CPF gerado no formato padrão (`000.000.000-00`) |
| `prefix` | string | `''` | String inicial parcial (0–9 dígitos). Apenas dígitos são mantidos; os caracteres faltantes são gerados aleatoriamente e os dígitos verificadores são calculados. |

Regras do prefixo: a base (primeiros 9 dígitos) não pode ser toda zerada; 9 dígitos repetidos (ex.: `999999999`) não são permitidos.

### `cpfGen` (função auxiliar)

Gera uma string de CPF válida. Sem opções, retorna um CPF numérico de 11 dígitos. É um atalho para `new CpfGenerator(options).generate()`.

- **`options`** (opcional): `CpfGeneratorOptionsInput` — ver [Opções do gerador](#opções-do-gerador).

### `CpfGenerator` (classe)

Para opções padrão reutilizáveis ou sobrescritas por chamada, use a classe:

```ts
import { CpfGenerator } from '@lacussoft/cpf-gen'

const generator = new CpfGenerator({ format: true })

generator.generate()           // ex.: '005.265.352-88'
generator.generate({ prefix: '123456' })  // sobrescreve apenas nesta chamada
generator.options              // opções padrão atuais (CpfGeneratorOptions)
```

- **`constructor`**: `new CpfGenerator(defaultOptions?)` — opções padrão opcionais (objeto simples ou instância de `CpfGeneratorOptions`).
- **`generate(options?)`**: Retorna um CPF válido; `options` por chamada sobrescrevem as opções da instância apenas naquela chamada.
- **`options`**: Getter que retorna as opções padrão usadas quando não se passam opções na chamada (mesma instância usada internamente; alterá-la afeta chamadas futuras de `generate`).

### `CpfGeneratorOptions` (classe)

Armazena as opções (`format`, `prefix`) com validação e merge:

```ts
import { CpfGeneratorOptions } from '@lacussoft/cpf-gen'

const options = new CpfGeneratorOptions({
  prefix: '123456',
  format: true,
})
options.prefix   // '123456'
options.format   // true
options.set({ format: false })  // merge e retorna this
options.all      // cópia superficial congelada das opções atuais
```

- **`constructor`**: `new CpfGeneratorOptions(defaultOptions?, ...overrides)` — opções mescladas na ordem.
- **`format`**, **`prefix`**: Getters/setters; o prefixo é validado (tamanho, base ineligível, dígitos repetidos).
- **`set(options)`**: Atualiza várias opções de uma vez; retorna `this`.
- **`all`**: Snapshot somente leitura das opções atuais.

## API

### Exportações

- **`cpfGen`** (padrão): `(options?: CpfGeneratorOptionsInput) => string`
- **`CpfGenerator`**: Classe para gerar CPF com opções padrão opcionais e sobrescritas por chamada.
- **`CpfGeneratorOptions`**: Classe que armazena as opções (`format`, `prefix`) com validação e merge.
- **`CPF_LENGTH`**: `11` (constante).
- **`CPF_PREFIX_MAX_LENGTH`**: `9` (constante).
- **Tipos**: `CpfGeneratorOptionsInput`, `CpfGeneratorOptionsType`.

### Erros e exceções

Este pacote usa **TypeError** para tipos de opção inválidos e **Exception** para valores inválidos (ex.: `prefix`). Você pode capturar classes específicas ou as bases.

- **CpfGeneratorTypeError** (_abstract_) — base para erros de tipo em opções
- **CpfGeneratorOptionsTypeError** — uma opção tem tipo incorreto (ex.: `prefix` não é string)
- **CpfGeneratorException** (_abstract_) — base para exceções de valor de opção
- **CpfGeneratorOptionPrefixInvalidException** — prefixo inválido (ex.: base zerada, dígitos repetidos, tamanho inválido)

```ts
import cpfGen, {
  CpfGeneratorOptionsTypeError,
  CpfGeneratorOptionPrefixInvalidException,
  CpfGeneratorException,
} from '@lacussoft/cpf-gen'

// Tipo de opção (ex.: `prefix` deve ser string)
try {
  cpfGen({ prefix: 123 })
} catch (e) {
  if (e instanceof CpfGeneratorOptionsTypeError) {
    console.log(e.message)  // CPF generator option "prefix" must be of type string. Got integer number.
  }
}

// Prefixo inválido (ex.: base zerada)
try {
  cpfGen({ prefix: '00000000' })
} catch (e) {
  if (e instanceof CpfGeneratorOptionPrefixInvalidException) {
    console.log(e.reason, e.actualInput)
  }
}

// Qualquer exceção do pacote
try {
  cpfGen({ prefix: '999999999' })
} catch (e) {
  if (e instanceof CpfGeneratorException) {
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

Veja o [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-gen/CHANGELOG.md) para alterações e histórico de versões.

---

Feito com ❤️ por [Lacus Solutions](https://github.com/LacusSolutions)
