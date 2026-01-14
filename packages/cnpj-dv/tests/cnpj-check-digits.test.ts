import { afterEach, beforeEach, describe, expect, it, type Mock, spyOn } from 'bun:test';

import CnpjCheckDigits, {
  CnpjCheckDigitsCalculationException,
  CnpjCheckDigitsInputLengthException,
  CnpjCheckDigitsInputTypeError,
} from '../src/index.esm';

describe('CnpjCheckDigits', (): void => {
  const testCases: Record<string, string> = {
    '054496519': '05449651910',
    '965376562': '96537656206',
    '339670768': '33967076806',
    '623855638': '62385563827',
    '582286009': '58228600950',
    '935218534': '93521853403',
    '132115335': '13211533508',
    '492602225': '49260222575',
    '341428925': '34142892533',
    '727598627': '72759862720',
    '478880583': '47888058396',
    '336636977': '33663697797',
    '859249430': '85924943038',
    '306829569': '30682956961',
    '443539643': '44353964321',
    '439709507': '43970950783',
    '557601402': '55760140221',
    '951159579': '95115957922',
    '671669104': '67166910496',
    '627571100': '62757110004',
    '515930555': '51593055560',
    '303472731': '30347273130',
    '728843365': '72884336508',
    '523667424': '52366742479',
    '513362164': '51336216476',
    '427546407': '42754640797',
    '880696512': '88069651237',
    '571430852': '57143085227',
    '561416205': '56141620540',
    '769627950': '76962795050',
    '416603400': '41660340063',
    '853803696': '85380369634',
    '484667676': '48466767657',
    '058588388': '05858838820',
    '862778820': '86277882007',
    '047126827': '04712682752',
    '881801816': '88180181677',
    '932053118': '93205311884',
    '029783613': '02978361379',
    '950189877': '95018987766',
    '842528992': '84252899206',
    '216901618': '21690161809',
    '110478730': '11047873001',
    '032967591': '03296759158',
    '700386565': '70038656531',
    '929036812': '92903681287',
    '750529972': '75052997272',
    '481063058': '48106305872',
    '307721932': '30772193282',
    '994799423': '99479942364',
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

      it('throws CnpjCheckDigitsInputLengthException for string with 8 digits', (): void => {
        const sut = (): unknown => new CnpjCheckDigits('12345678');

        expect(sut).toThrow(CnpjCheckDigitsInputLengthException);
      });

      it('throws CnpjCheckDigitsInputLengthException for string with 12 digits', (): void => {
        const sut = (): unknown => new CnpjCheckDigits('123456789100');

        expect(sut).toThrow(CnpjCheckDigitsInputLengthException);
      });

      it('throws CnpjCheckDigitsInputLengthException for string array with 8 digits', (): void => {
        const sut = (): unknown => new CnpjCheckDigits(['1', '2', '3', '4', '5', '6', '7', '8']);

        expect(sut).toThrow(CnpjCheckDigitsInputLengthException);
      });

      it('throws CnpjCheckDigitsInputLengthException for string array with 12 digits', (): void => {
        const sut = (): unknown =>
          new CnpjCheckDigits(['0', '5', '4', '4', '9', '6', '5', '1', '9', '1', '0', '0']);

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
        const cnpjCheckDigits = new CnpjCheckDigits('123456789');

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
        const cnpjCheckDigits = new CnpjCheckDigits('123456789');

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
        const cnpjCheckDigits = new CnpjCheckDigits('123456789');

        expect(cnpjCheckDigits.cnpj).toBe('12345678909');
      });
    });

    describe('when input is an array of grouped digits string', (): void => {
      it('returns the respective 14-character string for CNPJ', (): void => {
        const cnpjCheckDigits = new CnpjCheckDigits(['123', '456', '789']);

        expect(cnpjCheckDigits.cnpj).toBe('12345678909');
      });
    });

    describe('when input is an array of individual digits string', (): void => {
      it('returns the respective 14-character string for CNPJ', (): void => {
        const cnpjCheckDigits = new CnpjCheckDigits(['1', '2', '3', '4', '5', '6', '7', '8', '9']);

        expect(cnpjCheckDigits.cnpj).toBe('12345678909');
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
        const cnpjCheckDigits = new CnpjCheckDigits('123.456.789');

        expect(cnpjCheckDigits.cnpj).toBe('12345678909');
      });
    });

    describe('when input already contains check digits', (): void => {
      it('ignores provided check digits and calculates ones correctly', (): void => {
        const cnpjCheckDigits = new CnpjCheckDigits('12345678910');

        expect(cnpjCheckDigits.first).toBe('0');
        expect(cnpjCheckDigits.second).toBe('9');
        expect(cnpjCheckDigits.cnpj).toBe('12345678909');
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
        const testInstance = new TestCnpjCheckDigits('123456789');
        const shortSequence = [1, 2, 3, 4, 5, 6, 7, 8];

        const sut = (): number => testInstance.exposeCalculate(shortSequence);

        expect(sut).toThrow(CnpjCheckDigitsCalculationException);
      });

      it('throws CnpjCheckDigitsCalculationException for sequence longer than 13 digits', (): void => {
        const testInstance = new TestCnpjCheckDigits('123456789');
        const longSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1];

        const sut = (): number => testInstance.exposeCalculate(longSequence);

        expect(sut).toThrow(CnpjCheckDigitsCalculationException);
      });

      it('throws CnpjCheckDigitsCalculationException for empty sequence', (): void => {
        const testInstance = new TestCnpjCheckDigits('123456789');
        const emptySequence: number[] = [];

        const sut = (): number => testInstance.exposeCalculate(emptySequence);

        expect(sut).toThrow(CnpjCheckDigitsCalculationException);
      });

      it('includes the actual sequence in the exception', (): void => {
        const testInstance = new TestCnpjCheckDigits('123456789');
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
        const testInstance = new TestCnpjCheckDigits('123456789');
        const validSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        const result = testInstance.exposeCalculate(validSequence);

        expect(typeof result).toBe('number');
      });

      it('does not throw for valid 13-digit sequence', (): void => {
        const testInstance = new TestCnpjCheckDigits('123456789');
        const validSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

        const result = testInstance.exposeCalculate(validSequence);

        expect(typeof result).toBe('number');
      });
    });
  });
});
