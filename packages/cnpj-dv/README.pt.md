![cnpj-dv for JavaScript](https://br-utils.vercel.app/img/cover_cnpj-dv.jpg)

> 🚀 **Suporte total ao novo formato de CNPJ alfanumérico.**

> 🌎 [Access documentation in English](./README.md)

Classe utilitária para calcular os dígitos verificadores de CNPJ (Cadastro Nacional de Pessoa Jurídica).

## Funcionalidades

- ✅ **Suporte Alfanumérico**: Suporte total ao novo formato de CNPJ alfanumérico (introduzido em 2026)
- ✅ **Múltiplos Formatos de Entrada**: Aceita strings ou arrays de strings
- ✅ **Agnóstico a Formatação**: Remove automaticamente caracteres não alfanuméricos da entrada
- ✅ **Auto-Expansão**: Expande automaticamente strings com múltiplos caracteres em arrays para caracteres individuais
- ✅ **Avaliação Lazy**: Os dígitos verificadores são calculados apenas quando acessados (via propriedades)
- ✅ **Cache**: Valores calculados são armazenados em cache para acessos subsequentes
- ✅ **Suporte a TypeScript**: Definições TypeScript completas incluídas
- ✅ **Zero Dependências**: Nenhuma dependência externa necessária
- ✅ **Tratamento Completo de Erros**: Exceções específicas para diferentes cenários de erro

## Algoritmo de Cálculo

O pacote calcula os dígitos verificadores do CNPJ usando o algoritmo oficial brasileiro, com suporte total a caracteres alfanuméricos:

1. **Primeiro Dígito Verificador (13ª posição)**:
   - Usa os caracteres 1-12 da base do CNPJ
   - Aplica os pesos da direita para esquerda: 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5
   - Para caracteres alfanuméricos, usa o código ASCII menos 48 (o código ASCII de '0')
   - Calcula: `resto = soma(valor_char × peso) % 11`
   - Resultado: `0` se resto < 2, caso contrário `11 - resto`

2. **Segundo Dígito Verificador (14ª posição)**:
   - Usa os caracteres 1-12 + primeiro dígito verificador
   - Aplica os pesos da direita para esquerda: 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5, 6
   - Mesma lógica de cálculo acima

## Instalação

```bash
# usando NPM
$ npm install --save @lacussoft/cnpj-dv

# usando Bun
$ bun add @lacussoft/cnpj-dv
```

## Importação

```js
// ES Modules
import CnpjCheckDigits from '@lacussoft/cnpj-dv'

// Common JS
const CnpjCheckDigits = require('@lacussoft/cnpj-dv')
```

ou importe através do seu arquivo HTML, usando CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cnpj-dv@latest/dist/cnpj-dv.min.js"></script>
```

## Uso

### Uso Básico

```js
// Calcular dígitos verificadores a partir de uma base de CNPJ com 12 caracteres
const checkDigits = new CnpjCheckDigits('914157320007')

console.log(checkDigits.first)   // retorna '9'
console.log(checkDigits.second)  // retorna '3'
console.log(checkDigits.both)    // retorna '93'
console.log(checkDigits.cnpj)    // retorna '91415732000793'
```

```js
// Funciona com CNPJs alfanuméricos (novo formato)
const checkDigits = new CnpjCheckDigits('MGKGMJ9X0001')

console.log(checkDigits.first)   // retorna '6'
console.log(checkDigits.second)  // retorna '8'
console.log(checkDigits.both)    // retorna '68'
console.log(checkDigits.cnpj)    // retorna 'MGKGMJ9X000168'
```

### Formatos de Entrada

A classe `CnpjCheckDigits` aceita múltiplos formatos de entrada:

#### Entrada como String

```js
// Apenas dígitos/caracteres
const checkDigits = new CnpjCheckDigits('914157320007')
const checkDigits = new CnpjCheckDigits('MGKGMJ9X000193')

// CNPJ formatado
const checkDigits = new CnpjCheckDigits('91.415.732/0007-93')
const checkDigits = new CnpjCheckDigits('MG.KGM.J9X/0001-93')

// note que letras minúsculas são transformadas em maiúsculas
const checkDigits = new CnpjCheckDigits('mgkgmj9x0001')  // tratado como 'MGKGMJ9X0001'
```

#### Array de Strings

```js
// Array de strings de um único caractere
const checkDigits = new CnpjCheckDigits(['9', '1', '4', '1', '5', '7', '3', '2', '0', '0', '0', '7'])

// Array com strings de múltiplos caracteres (automaticamente expandido)
const checkDigits = new CnpjCheckDigits(['914157320007'])        // expande para caracteres individuais
const checkDigits = new CnpjCheckDigits(['91', '415', '732', '0007'])
const checkDigits = new CnpjCheckDigits(['MG', 'KGM', 'J9X', '0001'])
```

## Tratamento de Erros

Este projeto utiliza o conceito de **diferenciação Error/Exception**. Basicamente, _errors_ são usos incorretos do pacote, por exemplo, não seguir o tipo de argumento de uma função, e _exceptions_ são erros recuperáveis onde os dados ou o fluxo fogem das regras por algum motivo, por exemplo, um CNPJ inválido é fornecido à biblioteca, então os dígitos verificadores não podem ser calculados como esperado.

Portanto, o pacote lança erros e exceções detalhados para diferentes situações:

### `CnpjCheckDigitsInputTypeError`

Lançado quando o tipo de entrada não é suportado (deve ser `string` ou `string[]`).

```js
import CnpjCheckDigits, { CnpjCheckDigitsInputTypeError } from '@lacussoft/cnpj-dv'

try {
  new CnpjCheckDigits(123456780009)  // entrada numérica não é permitida
} catch (error) {
  if (error instanceof CnpjCheckDigitsInputTypeError) {
    console.log(error.message)  // CNPJ input must be of type string or string[]. Got number.
  }
}
```

### `CnpjCheckDigitsInputLengthException`

Lançado quando a entrada não contém de 12 a 14 caracteres alfanuméricos.

```js
import CnpjCheckDigits, { CnpjCheckDigitsInputLengthException } from '@lacussoft/cnpj-dv'

try {
  new CnpjCheckDigits('12345678')  // apenas 8 caracteres
} catch (error) {
  if (error instanceof CnpjCheckDigitsInputLengthException) {
    console.log(error.message)  // CNPJ input "12345678" does not contain 12 to 14 digits. Got 8.
  }
}
```

### Capturar qualquer erro do pacote

Todos os type errors estendem de `CnpjCheckDigitsTypeError` e todas as exceptions estendem de `CnpjCheckDigitsException`, então você pode usar esses tipos para tratar qualquer erro lançado pelo módulo.

```js
import { CnpjCheckDigits, CnpjCheckDigitsException } from '@lacussoft/cnpj-dv'

try {
  // algum código arriscado
} catch (error) {
  if (error instanceof CnpjCheckDigitsException) {
    // tratar exceções
  }
}
```

## Referência da API

### Classe CnpjCheckDigits

#### Construtor

```ts
new CnpjCheckDigits(cnpjDigits: string | string[]): CnpjCheckDigits
```

Cria uma nova instância de `CnpjCheckDigits` a partir dos caracteres base do CNPJ fornecidos.

**Parâmetros:**
- `cnpjDigits` (string | string[]): Os caracteres base do CNPJ (12-14 caracteres alfanuméricos). Pode ser:
  - Uma string com 12-14 caracteres (caracteres de formatação são ignorados, letras são convertidas para maiúsculas)
  - Um array de strings (cada string pode ter um ou múltiplos caracteres)

**Lança:**
- `CnpjCheckDigitsInputTypeError`: Se o tipo de entrada não for suportado
- `CnpjCheckDigitsInputLengthException`: Se a entrada não contiver 12-14 caracteres

**Retorna:**
- `CnpjCheckDigits`: Uma nova instância pronta para calcular os dígitos verificadores

#### Propriedades

##### `first: string`

O primeiro dígito verificador (13º caractere do CNPJ). Calculado de forma lazy no primeiro acesso.

##### `second: string`

O segundo dígito verificador (14º caractere do CNPJ). Calculado de forma lazy no primeiro acesso.

##### `both: string`

Ambos os dígitos verificadores concatenados como uma string.

##### `cnpj: string`

O CNPJ completo como uma string de 14 caracteres (12 caracteres base + 2 dígitos verificadores).

## Contribuição & Suporte

Contribuições são bem-vindas! Por favor, consulte nossas [Diretrizes de Contribuição](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md) para detalhes. Mas se você achar este projeto útil, por favor considere:

- ⭐ Dar uma estrela no repositório
- 🤝 Contribuir com o código
- 💡 [Sugerir novas funcionalidades](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reportar bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE) para detalhes.

## Changelog

Veja [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-dv/CHANGELOG.md) para uma lista de alterações e histórico de versões.

---

Feito com ❤️ por [Lacus Solutions](https://github.com/LacusSolutions)
