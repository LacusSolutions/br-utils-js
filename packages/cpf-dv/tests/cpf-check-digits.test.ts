import { afterEach, beforeEach, describe, expect, it, type Mock, spyOn } from 'bun:test';

import CpfCheckDigits, {
  CpfCheckDigitsCalculationException,
  CpfCheckDigitsInputInvalidException,
  CpfCheckDigitsInputLengthException,
  CpfCheckDigitsInputTypeError,
  type CpfInput,
} from '../src/index.esm';

describe('CpfCheckDigits', (): void => {
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
      it('throws CpfCheckDigitsInputTypeError for number input', (): void => {
        const sut = (): unknown => new CpfCheckDigits(12345678901 as unknown as string);

        expect(sut).toThrow(CpfCheckDigitsInputTypeError);
      });

      it('throws CpfCheckDigitsInputTypeError for null input', (): void => {
        const sut = (): unknown => new CpfCheckDigits(null as unknown as string);

        expect(sut).toThrow(CpfCheckDigitsInputTypeError);
      });

      it('throws CpfCheckDigitsInputTypeError for undefined input', (): void => {
        const sut = (): unknown => new CpfCheckDigits(undefined as unknown as string);

        expect(sut).toThrow(CpfCheckDigitsInputTypeError);
      });

      it('throws CpfCheckDigitsInputTypeError for object input', (): void => {
        const sut = (): unknown => new CpfCheckDigits({ cpf: '12345678901' } as unknown as string);

        expect(sut).toThrow(CpfCheckDigitsInputTypeError);
      });

      it('throws CpfCheckDigitsInputTypeError for array of numbers', (): void => {
        const sut = (): unknown =>
          new CpfCheckDigits([1, 2, 3, 4, 5, 6, 7, 8, 9] as unknown as string[]);

        expect(sut).toThrow(CpfCheckDigitsInputTypeError);
      });

      it('throws CpfCheckDigitsInputTypeError for mixed array types', (): void => {
        const sut = (): unknown => new CpfCheckDigits([1, '2', 3, '4', 5] as unknown as string[]);

        expect(sut).toThrow(CpfCheckDigitsInputTypeError);
      });
    });

    describe('when given invalid input length', () => {
      it('throws CpfCheckDigitsInputLengthException for empty string', (): void => {
        const sut = (): unknown => new CpfCheckDigits('');

        expect(sut).toThrow(CpfCheckDigitsInputLengthException);
      });

      it('throws CpfCheckDigitsInputLengthException for empty array', (): void => {
        const sut = (): unknown => new CpfCheckDigits([]);

        expect(sut).toThrow(CpfCheckDigitsInputLengthException);
      });

      it('throws CpfCheckDigitsInputLengthException for non-numeric string', (): void => {
        const sut = (): unknown => new CpfCheckDigits('abcdefghij');

        expect(sut).toThrow(CpfCheckDigitsInputLengthException);
      });

      it('throws CpfCheckDigitsInputLengthException for string with 8 digits', (): void => {
        const sut = (): unknown => new CpfCheckDigits('12345678');

        expect(sut).toThrow(CpfCheckDigitsInputLengthException);
      });

      it('throws CpfCheckDigitsInputLengthException for string with 12 digits', (): void => {
        const sut = (): unknown => new CpfCheckDigits('123456789100');

        expect(sut).toThrow(CpfCheckDigitsInputLengthException);
      });

      it('throws CpfCheckDigitsInputLengthException for string array with 8 digits', (): void => {
        const sut = (): unknown => new CpfCheckDigits(['1', '2', '3', '4', '5', '6', '7', '8']);

        expect(sut).toThrow(CpfCheckDigitsInputLengthException);
      });

      it('throws CpfCheckDigitsInputLengthException for string array with 12 digits', (): void => {
        const sut = (): unknown =>
          new CpfCheckDigits(['0', '5', '4', '4', '9', '6', '5', '1', '9', '1', '0', '0']);

        expect(sut).toThrow(CpfCheckDigitsInputLengthException);
      });
    });

    describe('when given repeated digits', (): void => {
      const repeatedDigitInputs: CpfInput[] = [
        '111111111',
        '222222222',
        '333333333',
        '444444444',
        '555555555',
        '666666666',
        '777777777',
        '888888888',
        '999999999',
        '000000000',
        ['111', '111', '111'],
        ['222', '222', '222'],
        ['333', '333', '333'],
        ['444', '444', '444'],
        ['555', '555', '555'],
        ['666', '666', '666'],
        ['777', '777', '777'],
        ['888', '888', '888'],
        ['999', '999', '999'],
        ['000', '000', '000'],
        ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
        ['2', '2', '2', '2', '2', '2', '2', '2', '2'],
        ['3', '3', '3', '3', '3', '3', '3', '3', '3'],
        ['4', '4', '4', '4', '4', '4', '4', '4', '4'],
        ['5', '5', '5', '5', '5', '5', '5', '5', '5'],
        ['6', '6', '6', '6', '6', '6', '6', '6', '6'],
        ['7', '7', '7', '7', '7', '7', '7', '7', '7'],
        ['8', '8', '8', '8', '8', '8', '8', '8', '8'],
        ['9', '9', '9', '9', '9', '9', '9', '9', '9'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ];

      it.each(repeatedDigitInputs.map((input) => [input]))(
        'throws CpfCheckDigitsInputInvalidException for input `%s`',
        (input): void => {
          const sut = (): unknown => new CpfCheckDigits(input);

          expect(sut).toThrow(CpfCheckDigitsInputInvalidException);
        },
      );
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
          const cpfCheckDigits = new CpfCheckDigits(input);

          expect(cpfCheckDigits.first).toBe(expected);
        },
      );
    });

    describe('when input is an array of strings', (): void => {
      it.each(firstDigitTestCases)(
        'returns `$expected` as first digit for `$input`',
        ({ input, expected }) => {
          const cpfCheckDigits = new CpfCheckDigits(input.split(''));

          expect(cpfCheckDigits.first).toBe(expected);
        },
      );
    });

    describe('when accessing digits multiple times', (): void => {
      let calculateSpy: Mock<never>;

      beforeEach(() => {
        calculateSpy = spyOn(CpfCheckDigits.prototype, 'calculate' as keyof CpfCheckDigits);
      });

      afterEach(() => {
        calculateSpy.mockRestore();
      });

      it('returns cached values on subsequent calls', (): void => {
        const cpfCheckDigits = new CpfCheckDigits('123456789');

        cpfCheckDigits.first; // eslint-disable-line @typescript-eslint/no-unused-expressions
        cpfCheckDigits.first; // eslint-disable-line @typescript-eslint/no-unused-expressions
        cpfCheckDigits.first; // eslint-disable-line @typescript-eslint/no-unused-expressions

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
          const cpfCheckDigits = new CpfCheckDigits(input);

          expect(cpfCheckDigits.second).toBe(expected);
        },
      );
    });

    describe('when input is an array of strings', (): void => {
      it.each(secondDigitTestCases)(
        'returns `$expected` as second digit for `$input`',
        ({ input, expected }) => {
          const cpfCheckDigits = new CpfCheckDigits(input.split(''));

          expect(cpfCheckDigits.second).toBe(expected);
        },
      );
    });

    describe('when accessing digits multiple times', (): void => {
      let calculateSpy: Mock<never>;

      beforeEach(() => {
        calculateSpy = spyOn(CpfCheckDigits.prototype, 'calculate' as keyof CpfCheckDigits);
      });

      afterEach(() => {
        calculateSpy.mockRestore();
      });

      it('returns cached values on subsequent calls', (): void => {
        const cpfCheckDigits = new CpfCheckDigits('123456789');

        cpfCheckDigits.second; // eslint-disable-line @typescript-eslint/no-unused-expressions
        cpfCheckDigits.second; // eslint-disable-line @typescript-eslint/no-unused-expressions
        cpfCheckDigits.second; // eslint-disable-line @typescript-eslint/no-unused-expressions

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
          const cpfCheckDigits = new CpfCheckDigits(input);

          expect(cpfCheckDigits.both).toBe(expected);
        },
      );
    });

    describe('when input is an array of strings', (): void => {
      it.each(bothDigitsTestCases)(
        'returns `$expected` as check digits for `$input`',
        ({ input, expected }) => {
          const cpfCheckDigits = new CpfCheckDigits(input.split(''));

          expect(cpfCheckDigits.both).toBe(expected);
        },
      );
    });
  });

  describe('actual CPF string', (): void => {
    describe('when input is a string', (): void => {
      it('returns the respective 11-character string for CPF', (): void => {
        const cpfCheckDigits = new CpfCheckDigits('123456789');

        expect(cpfCheckDigits.cpf).toBe('12345678909');
      });
    });

    describe('when input is an array of grouped digits string', (): void => {
      it('returns the respective 11-character string for CPF', (): void => {
        const cpfCheckDigits = new CpfCheckDigits(['123', '456', '789']);

        expect(cpfCheckDigits.cpf).toBe('12345678909');
      });
    });

    describe('when input is an array of individual digits string', (): void => {
      it('returns the respective 11-character string for CPF', (): void => {
        const cpfCheckDigits = new CpfCheckDigits(['1', '2', '3', '4', '5', '6', '7', '8', '9']);

        expect(cpfCheckDigits.cpf).toBe('12345678909');
      });
    });

    describe('when validating all test cases', (): void => {
      const testCasesArray = Object.entries(testCases).map(([input, expected]) => ({
        input,
        expected,
      }));

      it.each(testCasesArray)('returns `$expected` for `$input`', ({ input, expected }) => {
        const cpfCheckDigits = new CpfCheckDigits(input);

        expect(cpfCheckDigits.cpf).toBe(expected);
      });
    });
  });

  describe('edge cases', (): void => {
    describe('when input is a formatted CPF string', (): void => {
      it('correctly parses and calculates check digits', (): void => {
        const cpfCheckDigits = new CpfCheckDigits('123.456.789');

        expect(cpfCheckDigits.cpf).toBe('12345678909');
      });
    });

    describe('when input already contains check digits', (): void => {
      it('ignores provided check digits and calculates ones correctly', (): void => {
        const cpfCheckDigits = new CpfCheckDigits('12345678910');

        expect(cpfCheckDigits.first).toBe('0');
        expect(cpfCheckDigits.second).toBe('9');
        expect(cpfCheckDigits.cpf).toBe('12345678909');
      });
    });
  });

  describe('protected calculate method', (): void => {
    class TestCpfCheckDigits extends CpfCheckDigits {
      public exposeCalculate(sequence: number[]): number {
        return this.calculate(sequence);
      }
    }

    describe('when called with invalid sequence length via subclass', (): void => {
      it('throws CpfCheckDigitsCalculationException for sequence shorter than 9 digits', (): void => {
        const testInstance = new TestCpfCheckDigits('123456789');
        const shortSequence = [1, 2, 3, 4, 5, 6, 7, 8];

        const sut = (): number => testInstance.exposeCalculate(shortSequence);

        expect(sut).toThrow(CpfCheckDigitsCalculationException);
      });

      it('throws CpfCheckDigitsCalculationException for sequence longer than 10 digits', (): void => {
        const testInstance = new TestCpfCheckDigits('123456789');
        const longSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1];

        const sut = (): number => testInstance.exposeCalculate(longSequence);

        expect(sut).toThrow(CpfCheckDigitsCalculationException);
      });

      it('throws CpfCheckDigitsCalculationException for empty sequence', (): void => {
        const testInstance = new TestCpfCheckDigits('123456789');
        const emptySequence: number[] = [];

        const sut = (): number => testInstance.exposeCalculate(emptySequence);

        expect(sut).toThrow(CpfCheckDigitsCalculationException);
      });

      it('includes the actual sequence in the exception', (): void => {
        const testInstance = new TestCpfCheckDigits('123456789');
        const invalidSequence = [1, 2, 3];

        try {
          testInstance.exposeCalculate(invalidSequence);
          expect.unreachable('Expected exception to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(CpfCheckDigitsCalculationException);
          expect((error as CpfCheckDigitsCalculationException).actualSequence).toEqual(invalidSequence);
        }
      });

      it('does not throw for valid 9-digit sequence', (): void => {
        const testInstance = new TestCpfCheckDigits('123456789');
        const validSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        const result = testInstance.exposeCalculate(validSequence);

        expect(typeof result).toBe('number');
      });

      it('does not throw for valid 10-digit sequence', (): void => {
        const testInstance = new TestCpfCheckDigits('123456789');
        const validSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

        const result = testInstance.exposeCalculate(validSequence);

        expect(typeof result).toBe('number');
      });
    });
  });
});
