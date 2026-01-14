import { afterEach, beforeEach, describe, expect, it, type Mock, spyOn } from 'bun:test';

import CnpjCheckDigits, {
  CnpjCheckDigitsCalculationException,
  CnpjCheckDigitsInputLengthException,
  CnpjCheckDigitsInputTypeError,
} from '../src/index.esm';

describe('CnpjCheckDigits', (): void => {
  const testCases: Record<string, string> = {
    '914157320007': '91415732000793',
    '517503930003': '51750393000353',
    '050532360008': '05053236000886',
    '412851460002': '41285146000299',
    '003579820002': '00357982000254',
    '144863760009': '14486376000910',
    '301272110005': '30127211000584',
    '017205400003': '01720540000374',
    '723362430001': '72336243000106',
    '982882590009': '98288259000931',
    '238857260004': '23885726000405',
    '456189710004': '45618971000480',
    '871056390003': '87105639000381',
    '615208400003': '61520840000331',
    '483494070001': '48349407000155',
    '782152520001': '78215252000125',
    '023543810003': '02354381000302',
    '648275500008': '64827550000838',
    '210890360007': '21089036000759',
    '319476190003': '31947619000301',
    '758805710006': '75880571000671',
    '159833710006': '15983371000612',
    '069523030004': '06952303000433',
    '509053950004': '50905395000492',
    '573669460004': '57366946000436',
    '307168390003': '30716839000353',
    '885435950009': '88543595000920',
    '354946770003': '35494677000370',
    '006645070002': '00664507000220',
    '470076350005': '47007635000508',
    '005792660004': '00579266000483',
    '479281750001': '47928175000127',
    '167805610002': '16780561000271',
    '313124260006': '31312426000619',
    '822313180002': '82231318000229',
    '992040290001': '99204029000152',
    '040693560006': '04069356000647',
    '410302000007': '41030200000760',
    '015206300003': '01520630000311',
    '863940890002': '86394089000214',
    '002439100008': '00243910000871',
    '669041680003': '66904168000300',
    '283366280009': '28336628000939',
    '076394320005': '07639432000510',
    '451264770004': '45126477000407',
    '474080600006': '47408060000616',
    '711081470005': '71108147000571',
    '784153420007': '78415342000755',
    '495517490003': '49551749000388',
    '570635620003': '57063562000363',
  };

  describe('constructor', (): void => {
    describe('when given invalid input type', (): void => {
      it('throws CnpjCheckDigitsInputTypeError for number input', (): void => {
        const sut = (): unknown => new CnpjCheckDigits(12345678901 as unknown as string);

        expect(sut).toThrow(CnpjCheckDigitsInputTypeError);
      });

      it('throws CnpjCheckDigitsInputTypeError for null input', (): void => {
        const sut = (): unknown => new CnpjCheckDigits(null as unknown as string);

        expect(sut).toThrow(CnpjCheckDigitsInputTypeError);
      });

      it('throws CnpjCheckDigitsInputTypeError for undefined input', (): void => {
        const sut = (): unknown => new CnpjCheckDigits(undefined as unknown as string);

        expect(sut).toThrow(CnpjCheckDigitsInputTypeError);
      });

      it('throws CnpjCheckDigitsInputTypeError for object input', (): void => {
        const sut = (): unknown =>
          new CnpjCheckDigits({ cnpj: '12345678901' } as unknown as string);

        expect(sut).toThrow(CnpjCheckDigitsInputTypeError);
      });

      it('throws CnpjCheckDigitsInputTypeError for array of numbers', (): void => {
        const sut = (): unknown =>
          new CnpjCheckDigits([1, 2, 3, 4, 5, 6, 7, 8, 9] as unknown as string[]);

        expect(sut).toThrow(CnpjCheckDigitsInputTypeError);
      });

      it('throws CnpjCheckDigitsInputTypeError for mixed array types', (): void => {
        const sut = (): unknown => new CnpjCheckDigits([1, '2', 3, '4', 5] as unknown as string[]);

        expect(sut).toThrow(CnpjCheckDigitsInputTypeError);
      });
    });

    describe('when given invalid input length', () => {
      it('throws CnpjCheckDigitsInputLengthException for empty string', (): void => {
        const sut = (): unknown => new CnpjCheckDigits('');

        expect(sut).toThrow(CnpjCheckDigitsInputLengthException);
      });

      it('throws CnpjCheckDigitsInputLengthException for empty array', (): void => {
        const sut = (): unknown => new CnpjCheckDigits([]);

        expect(sut).toThrow(CnpjCheckDigitsInputLengthException);
      });

      it('throws CnpjCheckDigitsInputLengthException for non-numeric string', (): void => {
        const sut = (): unknown => new CnpjCheckDigits('abcdefghij');

        expect(sut).toThrow(CnpjCheckDigitsInputLengthException);
      });

      it('throws CnpjCheckDigitsInputLengthException for string with 11 digits', (): void => {
        const sut = (): unknown => new CnpjCheckDigits('12345678910');

        expect(sut).toThrow(CnpjCheckDigitsInputLengthException);
      });

      it('throws CnpjCheckDigitsInputLengthException for string with 15 digits', (): void => {
        const sut = (): unknown => new CnpjCheckDigits('123456789101112');

        expect(sut).toThrow(CnpjCheckDigitsInputLengthException);
      });

      it('throws CnpjCheckDigitsInputLengthException for string array with 11 digits', (): void => {
        const sut = (): unknown =>
          new CnpjCheckDigits(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

        expect(sut).toThrow(CnpjCheckDigitsInputLengthException);
      });

      it('throws CnpjCheckDigitsInputLengthException for string array with 15 digits', (): void => {
        const sut = (): unknown =>
          new CnpjCheckDigits([
            '0',
            '0',
            '1',
            '1',
            '1',
            '2',
            '2',
            '2',
            '0',
            '0',
            '0',
            '4',
            '5',
            '6',
            '7',
          ]);

        expect(sut).toThrow(CnpjCheckDigitsInputLengthException);
      });
    });
  });

  describe('first digit', (): void => {
    const firstDigitTestCases = Object.entries(testCases).map(([input, expected]) => ({
      input,
      expected: expected.slice(-2, -1),
    }));

    describe('when input is a string', (): void => {
      it.each(firstDigitTestCases)(
        'returns `$expected` as first digit for `$input`',
        ({ input, expected }) => {
          const cnpjCheckDigits = new CnpjCheckDigits(input);

          expect(cnpjCheckDigits.first).toBe(expected);
        },
      );
    });

    describe('when input is an array of strings', (): void => {
      it.each(firstDigitTestCases)(
        'returns `$expected` as first digit for `$input`',
        ({ input, expected }) => {
          const cnpjCheckDigits = new CnpjCheckDigits(input.split(''));

          expect(cnpjCheckDigits.first).toBe(expected);
        },
      );
    });

    describe('when accessing digits multiple times', (): void => {
      let calculateSpy: Mock<never>;

      beforeEach(() => {
        calculateSpy = spyOn(CnpjCheckDigits.prototype, 'calculate' as keyof CnpjCheckDigits);
      });

      afterEach(() => {
        calculateSpy.mockRestore();
      });

      it('returns cached values on subsequent calls', (): void => {
        const cnpjCheckDigits = new CnpjCheckDigits('914157320007');

        cnpjCheckDigits.first; // eslint-disable-line @typescript-eslint/no-unused-expressions
        cnpjCheckDigits.first; // eslint-disable-line @typescript-eslint/no-unused-expressions
        cnpjCheckDigits.first; // eslint-disable-line @typescript-eslint/no-unused-expressions

        expect(calculateSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('second digit', (): void => {
    const secondDigitTestCases = Object.entries(testCases).map(([input, expected]) => ({
      input,
      expected: expected.slice(-1),
    }));

    describe('when input is a string', (): void => {
      it.each(secondDigitTestCases)(
        'returns `$expected` as second digit for `$input`',
        ({ input, expected }) => {
          const cnpjCheckDigits = new CnpjCheckDigits(input);

          expect(cnpjCheckDigits.second).toBe(expected);
        },
      );
    });

    describe('when input is an array of strings', (): void => {
      it.each(secondDigitTestCases)(
        'returns `$expected` as second digit for `$input`',
        ({ input, expected }) => {
          const cnpjCheckDigits = new CnpjCheckDigits(input.split(''));

          expect(cnpjCheckDigits.second).toBe(expected);
        },
      );
    });

    describe('when accessing digits multiple times', (): void => {
      let calculateSpy: Mock<never>;

      beforeEach(() => {
        calculateSpy = spyOn(CnpjCheckDigits.prototype, 'calculate' as keyof CnpjCheckDigits);
      });

      afterEach(() => {
        calculateSpy.mockRestore();
      });

      it('returns cached values on subsequent calls', (): void => {
        const cnpjCheckDigits = new CnpjCheckDigits('914157320007');

        cnpjCheckDigits.second; // eslint-disable-line @typescript-eslint/no-unused-expressions
        cnpjCheckDigits.second; // eslint-disable-line @typescript-eslint/no-unused-expressions
        cnpjCheckDigits.second; // eslint-disable-line @typescript-eslint/no-unused-expressions

        expect(calculateSpy).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('both digits', (): void => {
    const bothDigitsTestCases = Object.entries(testCases).map(([input, expected]) => ({
      input,
      expected: expected.slice(-2),
    }));

    describe('when input is a string', (): void => {
      it.each(bothDigitsTestCases)(
        'returns `$expected` as check digits for `$input`',
        ({ input, expected }) => {
          const cnpjCheckDigits = new CnpjCheckDigits(input);

          expect(cnpjCheckDigits.both).toBe(expected);
        },
      );
    });

    describe('when input is an array of strings', (): void => {
      it.each(bothDigitsTestCases)(
        'returns `$expected` as check digits for `$input`',
        ({ input, expected }) => {
          const cnpjCheckDigits = new CnpjCheckDigits(input.split(''));

          expect(cnpjCheckDigits.both).toBe(expected);
        },
      );
    });
  });

  describe('actual CNPJ string', (): void => {
    describe('when input is a string', (): void => {
      it('returns the respective 14-character string for CNPJ', (): void => {
        const cnpjCheckDigits = new CnpjCheckDigits('914157320007');

        expect(cnpjCheckDigits.cnpj).toBe('91415732000793');
      });
    });

    describe('when input is an array of grouped digits string', (): void => {
      it('returns the respective 14-character string for CNPJ', (): void => {
        const cnpjCheckDigits = new CnpjCheckDigits(['9141', '5732', '0007']);

        expect(cnpjCheckDigits.cnpj).toBe('91415732000793');
      });
    });

    describe('when input is an array of individual digits string', (): void => {
      it('returns the respective 14-character string for CNPJ', (): void => {
        const cnpjCheckDigits = new CnpjCheckDigits([
          '9',
          '1',
          '4',
          '1',
          '5',
          '7',
          '3',
          '2',
          '0',
          '0',
          '0',
          '7',
        ]);

        expect(cnpjCheckDigits.cnpj).toBe('91415732000793');
      });
    });

    describe('when validating all test cases', (): void => {
      const testCasesArray = Object.entries(testCases).map(([input, expected]) => ({
        input,
        expected,
      }));

      it.each(testCasesArray)('returns `$expected` for `$input`', ({ input, expected }) => {
        const cnpjCheckDigits = new CnpjCheckDigits(input);

        expect(cnpjCheckDigits.cnpj).toBe(expected);
      });
    });
  });

  describe('edge cases', (): void => {
    describe('when input is a formatted CNPJ string', (): void => {
      it('correctly parses and calculates check digits', (): void => {
        const cnpjCheckDigits = new CnpjCheckDigits('91.415.732/0007');

        expect(cnpjCheckDigits.cnpj).toBe('91415732000793');
      });
    });

    describe('when input already contains check digits', (): void => {
      it('ignores provided check digits and calculates ones correctly', (): void => {
        const cnpjCheckDigits = new CnpjCheckDigits('91415732000700');

        expect(cnpjCheckDigits.first).toBe('9');
        expect(cnpjCheckDigits.second).toBe('3');
        expect(cnpjCheckDigits.cnpj).toBe('91415732000793');
      });
    });
  });

  describe('protected calculate method', (): void => {
    class TestCnpjCheckDigits extends CnpjCheckDigits {
      public exposeCalculate(sequence: number[]): number {
        return this.calculate(sequence);
      }
    }

    describe('when called with invalid sequence length via subclass', (): void => {
      it('throws CnpjCheckDigitsCalculationException for sequence shorter than 12 digits', (): void => {
        const testInstance = new TestCnpjCheckDigits('914157320007');
        const shortSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1];

        const sut = (): number => testInstance.exposeCalculate(shortSequence);

        expect(sut).toThrow(CnpjCheckDigitsCalculationException);
      });

      it('throws CnpjCheckDigitsCalculationException for sequence longer than 13 digits', (): void => {
        const testInstance = new TestCnpjCheckDigits('914157320007');
        const longSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4];

        const sut = (): number => testInstance.exposeCalculate(longSequence);

        expect(sut).toThrow(CnpjCheckDigitsCalculationException);
      });

      it('throws CnpjCheckDigitsCalculationException for empty sequence', (): void => {
        const testInstance = new TestCnpjCheckDigits('914157320007');
        const emptySequence: number[] = [];

        const sut = (): number => testInstance.exposeCalculate(emptySequence);

        expect(sut).toThrow(CnpjCheckDigitsCalculationException);
      });

      it('includes the actual sequence in the exception', (): void => {
        const testInstance = new TestCnpjCheckDigits('914157320007');
        const invalidSequence = [1, 2, 3];

        try {
          testInstance.exposeCalculate(invalidSequence);
          expect.unreachable('Expected exception to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(CnpjCheckDigitsCalculationException);
          expect((error as CnpjCheckDigitsCalculationException).actualSequence).toEqual(
            invalidSequence,
          );
        }
      });

      it('does not throw for valid 12-digit sequence', (): void => {
        const testInstance = new TestCnpjCheckDigits('914157320007');
        const validSequence = [9, 1, 4, 1, 5, 7, 3, 2, 0, 0, 0, 7];

        const result = testInstance.exposeCalculate(validSequence);

        expect(typeof result).toBe('number');
      });

      it('does not throw for valid 13-digit sequence', (): void => {
        const testInstance = new TestCnpjCheckDigits('914157320007');
        const validSequence = [9, 1, 4, 1, 5, 7, 3, 2, 0, 0, 0, 7, 9];

        const result = testInstance.exposeCalculate(validSequence);

        expect(typeof result).toBe('number');
      });
    });
  });
});
