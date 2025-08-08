export class Cell {
  private _currentIndex: number;
  private _input: string;
  private _output?: number;

  constructor(value: string, currentIndex: number) {
    this._currentIndex = currentIndex;
    if (!isNaN(Number(value))) {
      this._input = value;
    } else {
      const validInput = this.validateFormula(value);
      this._input = validInput;
    }
  }

  public getOutput(indexValueMap: Record<number, number>): number {
    if (this._output === undefined) {
      if (!isNaN(Number(this._input))) {
        this._output = Number(this._input);
      } else {
        this._output = this.executeFormula(indexValueMap);
      }
    }
    return this._output;
  }

  private validateFormula(input: string): string {
    const inputRegex = /^=\s*(?:\d+|\{\d+\})(?:\s*[+\-*/]\s*(?:\d+|\{\d+\}))*\s*$/;

    const test = inputRegex.test(input);

    if (!test) {
      throw new Error(`Invalid formula: ${input}. Expected format: = <number> [<operator> <number>]*`);
    }

    console.log('TEST: ', test, input);

    const matches = [...input.matchAll(/\{(\d+)\}/g)];
    const indexes = matches.map((match) => Number(match[1]));

    if (indexes.some((index) => index > this._currentIndex)) {
      throw new Error(`Invalid formula: ${input}. Cannot reference future cells.`);
    }


    return input;
  }

  private executeFormula(indexValueMap: Record<number, number>): number {
    const getValue = (token: string): number => {
      if (token.startsWith('{')) {
        const index = Number(token.slice(1, -1));
        return indexValueMap[index];
      } else {
        return Number(token);
      }
    };

    const input = this._input;

    const parts = input.split('=');
    if (parts.length !== 2) {
      throw new Error('Invalid formula format');
    }

    const formula = parts[1];
    const tokens = formula.split(/([+\-*/])/).map((token) => token.trim());

    console.log('TOKENS: ', tokens);

    let result = getValue(tokens[0]);

    for (let i = 1; i < tokens.length; i += 2) {
      const num = getValue(tokens[i + 1]);
      const operator = tokens[i];

      switch (operator) {
        case '+':
          result += num;
          break;
        case '-':
          result -= num;
          break;
        case '*':
          result *= num;
          break;
        case '/':
          if (num === 0) {
            throw new Error('Division by zero');
          }
          result /= num;
          break;
        default:
          throw new Error(`Unknown operator: ${operator}`);
      }
    }

    return result;
  }
}
