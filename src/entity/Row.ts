import { Cell } from "./Cell";

export class Row {
  private _cells: Cell[];
  private _outputs: Record<number, number>;

  constructor(inputs: string[]) {
    // handle error thrown from Cell
    this._cells = inputs.map((input, index) => new Cell(input, index));
    this._outputs = this.calculateOutputs();
  }

  public changeValue(index: number, newValue: string): void {
    if (index < 0 || index >= this._cells.length) {
      throw new Error(`Index ${index} is out of bounds.`);
    }

    const cell = new Cell(newValue, index);
    this._cells[index] = cell;
    this._outputs = this.calculateOutputs();
  }

  private calculateOutputs(): Record<number, number> {
    const outputs: Record<number, number> = {};
    for (let i = 0; i < this._cells.length; i++) {
      outputs[i] = this._cells[i].getOutput(outputs);
    }
    return outputs;
  }

  public toString(): string {
    return Object.entries(this._outputs)
      .map(([index, value]) => `[${index}: ${value}]`)
      .join(', ');
  }
}