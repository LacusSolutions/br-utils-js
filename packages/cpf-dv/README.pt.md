![cpf-dv for JavaScript](https://br-utils.vercel.app/img/cover_cpf-dv.jpg)

> 🌎 [Access documentation in English](./.github/README.md)

Classe utilitária para calcular os dígitos verificadores de CPF (Cadastro de Pessoa Física).

## Funcionalidades

- ✅ **Múltiplos Formatos de Entrada**: Aceita strings ou arrays de strings
- ✅ **Agnóstico a Formatação**: Remove automaticamente caracteres não numéricos da entrada
- ✅ **Auto-Expansão**: Expande automaticamente strings com múltiplos dígitos em arrays para dígitos individuais
- ✅ **Avaliação Lazy**: Os dígitos verificadores são calculados apenas quando acessados (via propriedades)
- ✅ **Cache**: Valores calculados são armazenados em cache para acessos subsequentes
- ✅ **Suporte a TypeScript**: Definições TypeScript completas incluídas
- ✅ **Zero Dependências**: Nenhuma dependência externa necessária
- ✅ **Tratamento Completo de Erros**: Exceções específicas para diferentes cenários de erro

## Algoritmo de Cálculo

O pacote calcula os dígitos verificadores do CPF usando o algoritmo oficial brasileiro:

1. **Primeiro Dígito Verificador (10ª posição)**:
   - Usa os dígitos 1-9 da base do CPF
   - Aplica os pesos: 10, 9, 8, 7, 6, 5, 4, 3, 2 (da esquerda para direita)
   - Calcula: `resto = 11 - (soma(dígito × peso) % 11)`
   - Resultado: `0` se resto > 9, caso contrário `resto`

2. **Segundo Dígito Verificador (11ª posição)**:
   - Usa os dígitos 1-9 + primeiro dígito verificador
   - Aplica os pesos: 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 (da esquerda para direita)
   - Calcula: `resto = 11 - (soma(dígito × peso) % 11)`
   - Resultado: `0` se resto > 9, caso contrário `resto`

## Instalação

```bash
# usando NPM
$ npm install --save @lacussoft/cpf-dv

# usando Bun
$ bun add @lacussoft/cpf-dv
```

## Importação

```js
// ES Modules
import CpfCheckDigits from '@lacussoft/cpf-dv'

// Common JS
const CpfCheckDigits = require('@lacussoft/cpf-dv')
```

ou importe através do seu arquivo HTML, usando CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cpf-dv@latest/dist/cpf-dv.min.js"></script>
```

## Uso

### Uso Básico

```js
// Calcular dígitos verificadores a partir de uma base de CPF com 9 dígitos
const checkDigits = new CpfCheckDigits('054496519')

console.log(checkDigits.first)   // retorna '1'
console.log(checkDigits.second)  // retorna '0'
console.log(checkDigits.both)    // retorna '10'
console.log(checkDigits.cpf)     // retorna '05449651910'
```

### Formatos de Entrada

A classe `CpfCheckDigits` aceita múltiplos formatos de entrada:

#### Entrada como String

```js
// String simples (caracteres não numéricos são removidos automaticamente)
const checkDigits = new CpfCheckDigits('054496519')
const checkDigits = new CpfCheckDigits('054.496.519-10')  // formatação é ignorada
const checkDigits = new CpfCheckDigits('054496519')       // 9 dígitos
const checkDigits = new CpfCheckDigits('05449651910')     // 11 dígitos (apenas os 9 primeiros são usados)
```

#### Array de Strings

```js
// Array de strings de um único caractere
const checkDigits = new CpfCheckDigits(['0', '5', '4', '4', '9', '6', '5', '1', '9'])

// Array com strings de múltiplos dígitos (automaticamente expandido)
const checkDigits = new CpfCheckDigits(['054496519'])       // expande para dígitos individuais
const checkDigits = new CpfCheckDigits(['054', '496', '519'])  // também expande
```

## Tratamento de Erros

Este projeto utiliza o conceito de **diferenciação Error/Exception**. Basicamente, _errors_ são usos incorretos do pacote, por exemplo, não seguir o tipo de argumento de uma função, e _exceptions_ são erros recuperáveis onde os dados ou o fluxo fogem das regras por algum motivo, por exemplo, um CPF inválido é fornecido à biblioteca, então os dígitos verificadores não podem ser calculados como esperado.

Portanto, o pacote lança erros e exceções detalhados para diferentes situações:

### `CpfCheckDigitsInputTypeError`

Lançado quando o tipo de entrada não é suportado (deve ser `string` ou `string[]`).

```js
import CpfCheckDigits, { CpfCheckDigitsInputTypeError } from '@lacussoft/cpf-dv'

try {
  new CpfCheckDigits(12345678901)  // entrada numérica não é permitida
} catch (error) {
  if (error instanceof CpfCheckDigitsInputTypeError) {
    console.log(error.message)  // CPF input must be of type string or string[]. Got number.
  }
}
```

### `CpfCheckDigitsInputLengthException`

Lançado quando a entrada não contém de 9 a 11 dígitos.

```js
import CpfCheckDigits, { CpfCheckDigitsInputLengthException } from '@lacussoft/cpf-dv'

try {
  new CpfCheckDigits('12345678')  // apenas 8 dígitos
} catch (error) {
  if (error instanceof CpfCheckDigitsInputLengthException) {
    console.log(error.message)  // CPF input "12345678" does not contain 9 to 11 digits. Got 8.
  }
}
```

### `CpfCheckDigitsInputInvalidException`

Lançado quando a entrada é proibida por alguma restrição, como dígitos repetidos tipo `111.111.111`, `222.222.222`, `333.333.333` e assim por diante.

```js
import CpfCheckDigits, { CpfCheckDigitsInputInvalidException } from '@lacussoft/cpf-dv'

try {
  new CpfCheckDigits(['999', '999', '999'])
} catch (error) {
  if (error instanceof CpfCheckDigitsInputInvalidException) {
    console.log(error.message)  // CPF input ["999","999","999"] is invalid. Repeated digits are not considered valid.
  }
}
```

### Capturar qualquer erro do pacote

Todos os type errors estendem de `CpfCheckDigitsTypeError` e todas as exceptions estendem de `CpfCheckDigitsException`, então você pode usar esses tipos para tratar qualquer erro lançado pelo módulo.

```js
import { CpfCheckDigits, CpfCheckDigitsException } from '@lacussoft/cpf-dv'

try {
  // algum código arriscado
} catch (error) {
  if (error instanceof CpfCheckDigitsException) {
    // tratar exceções
  }
}
```

## Referência da API

### Classe CpfCheckDigits

#### Construtor

```ts
new CpfCheckDigits(cpfDigits: string | string[]): CpfCheckDigits
```

Cria uma nova instância de `CpfCheckDigits` a partir dos dígitos base do CPF fornecidos.

**Parâmetros:**
- `cpfDigits` (string | string[]): Os dígitos base do CPF (9-11 dígitos). Pode ser:
  - Uma string com 9-11 dígitos (caracteres de formatação são ignorados)
  - Um array de strings (cada string pode ser um número de um ou múltiplos dígitos)

**Lança:**
- `CpfCheckDigitsInputTypeError`: Se o tipo de entrada não for suportado
- `CpfCheckDigitsInputLengthException`: Se a entrada não contiver 9-11 dígitos
- `CpfCheckDigitsInputInvalidException`: Se a entrada for inválida (ex.: dígitos repetidos)

**Retorna:**
- `CpfCheckDigits`: Uma nova instância pronta para calcular os dígitos verificadores

#### Propriedades

##### `first: string`

O primeiro dígito verificador (10º dígito do CPF). Calculado de forma lazy no primeiro acesso.

##### `second: string`

O segundo dígito verificador (11º dígito do CPF). Calculado de forma lazy no primeiro acesso.

##### `both: string`

Ambos os dígitos verificadores concatenados como uma string.

##### `cpf: string`

O CPF completo como uma string de 11 dígitos (9 dígitos base + 2 dígitos verificadores).

## Contribuição & Suporte

Contribuições são bem-vindas! Por favor, consulte nossas [Diretrizes de Contribuição](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md) para detalhes. Mas se você achar este projeto útil, por favor considere:

- ⭐ Dar uma estrela no repositório
- 🤝 Contribuir com o código
- 💡 [Sugerir novas funcionalidades](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reportar bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE) para detalhes.

## Changelog

Veja [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-dv/CHANGELOG.md) para uma lista de alterações e histórico de versões.

---

Feito com ❤️ por [Lacus Solutions](https://github.com/LacusSolutions)
