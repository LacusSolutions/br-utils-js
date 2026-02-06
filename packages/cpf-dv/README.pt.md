![cpf-dv para JavaScript](https://br-utils.vercel.app/img/cover_cpf-dv.jpg)

> 🌎 [Access documentation in English](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-dv/README.md)

Utilitário em JavaScript/TypeScript para calcular os dígitos verificadores de CPF (Cadastro de Pessoa Física).

## Recursos

- ✅ **Entrada flexível**: Aceita string ou array de strings
- ✅ **Agnóstico ao formato**: Remove automaticamente caracteres não numéricos da entrada
- ✅ **Auto-expansão**: Expande automaticamente strings com múltiplos dígitos em arrays para dígitos individuais
- ✅ **Avaliação lazy**: Dígitos verificadores são calculados apenas quando acessados (via propriedades)
- ✅ **Cache**: Valores calculados são armazenados em cache para acessos subsequentes
- ✅ **TypeScript**: Definições de tipo completas e compatível com strict mode
- ✅ **Zero dependências**: Nenhuma dependência externa
- ✅ **Tratamento de erros**: Exceções específicas para tipo, tamanho e CPF inválido

## Instalação

```bash
# usando NPM
$ npm install --save @lacussoft/cpf-dv

# usando Bun
$ bun add @lacussoft/cpf-dv
```

## Início rápido

```ts
// ES Modules
import CpfCheckDigits from '@lacussoft/cpf-dv'

// Common JS
const CpfCheckDigits = require('@lacussoft/cpf-dv')
```

Uso básico:

```ts
const checkDigits = new CpfCheckDigits('054496519')

checkDigits.first   // '1'
checkDigits.second  // '0'
checkDigits.both    // '10'
checkDigits.cpf     // '05449651910'
```

Para frontends legados, inclua o build UMD (ex.: minificado) em uma tag `<script>`; `CpfCheckDigits` fica disponível globalmente:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cpf-dv@latest/dist/cpf-dv.min.js"></script>
```

## Utilização

O principal recurso deste pacote é a classe `CpfCheckDigits`. Por meio da instância dela, você acessa as informações principais do CPF em relação aos dígitos verificadores:

- **`constructor`**: `new CpfCheckDigits(cpfDigits: string | string[])` — 9–11 dígitos (formatação removida).
- **`first`**: Primeiro dígito verificador (10º dígito do CPF). Lazy, em cache.
- **`second`**: Segundo dígito verificador (11º dígito do CPF). Lazy, em cache.
- **`both`**: Ambos os dígitos verificadores concatenados em uma string.
- **`cpf`**: O CPF completo como string de 11 dígitos (9 base + 2 dígitos verificadores).

### Formatos de entrada

A classe `CpfCheckDigits` aceita múltiplos formatos de entrada:

**String:** dígitos crus ou CPF formatado (ex.: `054.496.519-10`). Caracteres não numéricos são removidos automaticamente. Use 9 dígitos (apenas base) ou 11 dígitos (apenas os 9 primeiros são usados).

**Array de strings:** strings de um caractere ou de vários (expandidos automaticamente para dígitos individuais), ex.: `['0','5','4','4','9','6','5','1','9']`, `['054496519']`, `['054','496','519']`.

### Erros e exceções

Este pacote usa a distinção **Error vs Exception**: *errors* indicam uso incorreto da API (ex.: tipo errado); *exceptions* indicam dados inválidos ou ineligíveis (ex.: CPF inválido). Você pode capturar tipos específicos ou usar as classes base.

- **CpfCheckDigitsTypeError** (_abstract_) — base para erros de tipo
- **CpfCheckDigitsInputTypeError** — entrada não é string nem string[]
- **CpfCheckDigitsException** (_abstract_) — base para exceções de dados/fluxo
- **CpfCheckDigitsInputLengthException** — tamanho após sanitização não é 9–11
- **CpfCheckDigitsInputInvalidException** — entrada ineligível (ex.: dígitos repetidos como 111.111.111)

```ts
import CpfCheckDigits, {
  CpfCheckDigitsInputTypeError,
  CpfCheckDigitsInputLengthException,
  CpfCheckDigitsInputInvalidException,
  CpfCheckDigitsException,
} from '@lacussoft/cpf-dv'

// Tipo de entrada (ex.: número não permitido)
try {
  new CpfCheckDigits(12345678901)
} catch (e) {
  if (e instanceof CpfCheckDigitsInputTypeError) {
    console.log(e.message)  // CPF input must be of type string or string[]. Got number.
  }
}

// Tamanho (deve ser 9–11 dígitos após sanitização)
try {
  new CpfCheckDigits('12345678')
} catch (e) {
  if (e instanceof CpfCheckDigitsInputLengthException) {
    console.log(e.message)
  }
}

// Inválido (ex.: dígitos repetidos)
try {
  new CpfCheckDigits(['999', '999', '999'])
} catch (e) {
  if (e instanceof CpfCheckDigitsInputInvalidException) {
    console.log(e.message)
  }
}

// Qualquer exceção do pacote
try {
  // código arriscado
} catch (e) {
  if (e instanceof CpfCheckDigitsException) {
    // tratar
  }
}
```

### Outros recursos disponíveis

- **`CpfCheckDigits`** (default): Classe para calcular os dígitos verificadores de CPF; o construtor aceita `string | string[]`.
- **Tipos**: `CpfCheckDigitsTypeError`, `CpfCheckDigitsException` (classes base para erros e exceções).
- **Exceções**: Ver lista acima.

## Algoritmo de cálculo

O pacote calcula os dígitos verificadores do CPF usando o algoritmo oficial brasileiro:

1. **Primeiro dígito (10ª posição):** dígitos 1–9 da base do CPF; pesos 10, 9, 8, 7, 6, 5, 4, 3, 2 (da esquerda para a direita); `resto = 11 - (soma(dígito × peso) % 11)`; resultado é `0` se resto > 9, caso contrário `resto`.
2. **Segundo dígito (11ª posição):** dígitos 1–9 + primeiro dígito verificador; pesos 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 (da esquerda para a direita); mesma fórmula.

## Contribuição e suporte

Contribuições são bem-vindas! Consulte as [Diretrizes de contribuição](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md). Se o projeto for útil para você, considere:

- ⭐ Dar uma estrela no repositório
- 🤝 Contribuir com código
- 💡 [Sugerir novas funcionalidades](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reportar bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE).

## Changelog

Veja o [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-dv/CHANGELOG.md) para alterações e histórico de versões.

---

Feito com ❤️ por [Lacus Solutions](https://github.com/LacusSolutions)
