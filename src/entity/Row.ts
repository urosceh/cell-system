import { eventManager } from "../event/EventManager";
import { Cell } from "./Cell";

export class Row {
  private _cells: Cell[];
  private _outputs: Record<number, number>;
  /* 
    dependencies will be key,value where value is all the indexes thet depend on that key
    e.g. 
      if row 1 formula is ={0}+2 then 0: 1
      and row 5 formula is ={0}+{4}*2 then 0: 1,5 and 4: 5 
  */
  private _dependencies: Record<number, number[]> = {};

  constructor(inputs: string[]) {
    // handle error thrown from Cell
    this._cells = inputs.map((input, index) => new Cell(input, index));
    this._outputs = this.calculateOutputs();

    eventManager.onChange(({ index }) => {
      // this means _outputs[index] has changed
      // get all cells that depend on this index
      const dependents = this._dependencies[index] || [];

      // recalculate their outputs
      for (const dependentIndex of dependents) {
        const oldValue = this._outputs[dependentIndex];
        this._outputs[dependentIndex] = this._cells[dependentIndex].recalculateFormula(this._outputs);

        // emit change event for each dependent if changed
        if (this._outputs[dependentIndex] !== oldValue) {
          eventManager.emitChange(dependentIndex);
        }
      }
    });
  }

  public changeValue(index: number, newValue: string): void {
    if (index < 0 || index >= this._cells.length) {
      throw new Error(`Index ${index} is out of bounds.`);
    }

    try {
      if (!isNaN(Number(newValue))) {
        this._cells[index] = new Cell(newValue, index);
        this._outputs[index] = this._cells[index].getOutput(this._outputs);
        eventManager.emitChange(index);
      } else {
        // this is a formula
        // this._outputs already has all the needed values
        const cell = new Cell(newValue, index);
        this._cells[index] = cell;
        this._outputs[index] = cell.getOutput(this._outputs);
        eventManager.emitChange(index);
      }
    } catch (error: any) {
      throw new Error(`No changes made to the row. Error changing value at index ${index}: ${error.message}`);
    }
  }

  private calculateOutputs(): Record<number, number> {
    const outputs: Record<number, number> = {};
    for (let i = 0; i < this._cells.length; i++) {
      outputs[i] = this._cells[i].getOutput(outputs);
      for (const index of this._cells[i].indexes) {
        if (!this._dependencies[index]) {
          this._dependencies[index] = [];
        }
        this._dependencies[index].push(i);
      }
    }
    return outputs;
  }

  public toString(): string {
    return Object.entries(this._outputs)
      .map(([index, value]) => `[${index}: ${value}]`)
      .join(', ');
  }
}