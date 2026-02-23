![cnpj-dv para JavaScript](https://br-utils.vercel.app/img/cover_cnpj-dv.jpg)

> 🚀 **Suporte completo ao [novo formato alfanumérico de CNPJ](https://github.com/user-attachments/files/23937961/calculodvcnpjalfanaumerico.pdf).**

> 🌎 [Access documentation in English](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-dv/README.md)

Utilitário em JavaScript/TypeScript para calcular os dígitos verificadores de CNPJ (Cadastro Nacional da Pessoa Jurídica).

## Recursos

- ✅ **CNPJ alfanumérico**: Suporte completo ao novo formato alfanumérico de CNPJ (introduzido em 2026)
- ✅ **Entrada flexível**: Aceita string ou array de strings
- ✅ **Agnóstico ao formato**: Remove caracteres não alfanuméricos e converte para maiúsculas antes de processar
- ✅ **Validação de entrada**: Rejeita CNPJs inválidos (base/filial zerados, dígitos repetidos)
- ✅ **Avaliação lazy**: Dígitos verificadores são calculados apenas quando acessados (via propriedades)
- ✅ **Cache**: Valores calculados são armazenados em cache para acessos subsequentes
- ✅ **TypeScript**: Definições de tipo completas e compatível com strict mode
- ✅ **Dependências mínimas**: Sem dependências externas, apenas pacotes internos como `@lacussoft/utils`
- ✅ **Tratamento de erros**: Exceções específicas para tipo, tamanho e CNPJ inválido

## Instalação

```bash
# usando NPM
$ npm install --save @lacussoft/cnpj-dv

# usando Bun
$ bun add @lacussoft/cnpj-dv
```

## Início rápido

```ts
// ES Modules
import CnpjCheckDigits from '@lacussoft/cnpj-dv'

// Common JS
const CnpjCheckDigits = require('@lacussoft/cnpj-dv')
```

Uso básico:

```ts
const checkDigits = new CnpjCheckDigits('914157320007')

checkDigits.first   // '9'
checkDigits.second  // '3'
checkDigits.both    // '93'
checkDigits.cnpj    // '91415732000793'
```

Com CNPJ alfanumérico (novo formato):

```ts
const checkDigits = new CnpjCheckDigits('MGKGMJ9X0001')

checkDigits.first   // '6'
checkDigits.second  // '8'
checkDigits.both    // '68'
checkDigits.cnpj    // 'MGKGMJ9X000168'
```

Para frontends legados, inclua o build UMD (ex.: minificado) em uma tag `<script>`; `CnpjCheckDigits` fica disponível globalmente:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cnpj-dv@latest/dist/cnpj-dv.min.js"></script>
```

## Utilização

O principal recurso deste pacote é a classe `CnpjCheckDigits`. Por meio da instância dela, você acessa as informações principais do CNPJ em relação aos dígitos verificadores:

- **`constructor`**: `new CnpjCheckDigits(cnpjDigits: string | string[])` — 12–14 caracteres alfanuméricos (formatação removida, letras em maiúsculas).
- **`first`**: Primeiro dígito verificador (13º caractere). Lazy, em cache.
- **`second`**: Segundo dígito verificador (14º caractere). Lazy, em cache.
- **`both`**: Ambos os dígitos concatenados.
- **`cnpj`**: CNPJ completo com 14 caracteres (base + dígitos verificadores).

### Formatos de entrada

A classe `CnpjCheckDigits` aceita múltiplos formatos de entrada:

**String:** dígitos/letras crus ou CNPJ formatado (ex.: `91.415.732/0007-93`, `MG.KGM.J9X/0001-93`). Letras minúsculas são convertidas para maiúsculas.

**Array de strings:** strings de um caractere ou de vários (expandidos automaticamente para caracteres individuais), ex.: `['9','1','4',…]`, `['91','415','732','0007']`, `['MG','KGM','J9X','0001']`.

### Erros e exceções

Este pacote usa a distinção **Error vs Exception**: *errors* indicam uso incorreto da API (ex.: tipo errado); *exceptions* indicam dados inválidos ou ineligíveis (ex.: CNPJ inválido). Você pode capturar tipos específicos ou usar as classes base.

- **CnpjCheckDigitsTypeError** (_abstract_) — base para erros de tipo
- **CnpjCheckDigitsInputTypeError** — entrada não é string nem string[]
- **CnpjCheckDigitsException** (_abstract_) — base para exceções de dados/fluxo
- **CnpjCheckDigitsInputLengthException** — tamanho após sanitização não é 12–14
- **CnpjCheckDigitsInputInvalidException** — base/filial ineligíveis (ex.: tudo zero, todos os caracteres com dígitos repetidos)

```ts
import CnpjCheckDigits, {
  CnpjCheckDigitsInputTypeError,
  CnpjCheckDigitsInputLengthException,
  CnpjCheckDigitsInputInvalidException,
  CnpjCheckDigitsException,
} from '@lacussoft/cnpj-dv'

// Tipo de entrada (ex.: número não permitido)
try {
  new CnpjCheckDigits(123456780009)
} catch (e) {
  if (e instanceof CnpjCheckDigitsInputTypeError) {
    console.log(e.message)  // CNPJ input must be of type string or string[]. Got integer number.
  }
}

// Tamanho (deve ser 12–14 caracteres alfanuméricos após sanitização)
try {
  new CnpjCheckDigits('12345678')
} catch (e) {
  if (e instanceof CnpjCheckDigitsInputLengthException) {
    console.log(e.message)
  }
}

// Inválido (ex.: base/filial zerados, dígitos repetidos)
try {
  new CnpjCheckDigits('000000000001')
} catch (e) {
  if (e instanceof CnpjCheckDigitsInputInvalidException) {
    console.log(e.message)
  }
}

// Qualquer exceção do pacote
try {
  // código arriscado
} catch (e) {
  if (e instanceof CnpjCheckDigitsException) {
    // tratar
  }
}
```

### Outros recursos disponíveis

- **`CNPJ_MIN_LENGTH`**: `12` (constante).
- **`CNPJ_MAX_LENGTH`**: `14` (constante).
- **Tipos**: `CnpjInput` (`string | string[]`).
- **Exceções**: Ver acima.

## Algoritmo de cálculo

Os dígitos verificadores seguem o algoritmo oficial brasileiro com suporte alfanumérico:

1. **Primeiro dígito (13ª posição):** caracteres 1–12, pesos 2–5 da direita para a esquerda; valor alfanumérico = ASCII − 48; `resto = soma(caractere × peso) % 11`; dígito = `0` se resto < 2, senão `11 − resto`.
2. **Segundo dígito (14ª posição):** caracteres 1–13, pesos 2–6 da direita para a esquerda; mesma fórmula.

## Contribuição e suporte

Contribuições são bem-vindas! Consulte as [Diretrizes de contribuição](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md). Se o projeto for útil para você, considere:

- ⭐ Dar uma estrela no repositório
- 🤝 Contribuir com código
- 💡 [Sugerir novas funcionalidades](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reportar bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE).

## Changelog

Veja o [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-dv/CHANGELOG.md) para alterações e histórico de versões.

---

Feito com ❤️ por [Lacus Solutions](https://github.com/LacusSolutions)
