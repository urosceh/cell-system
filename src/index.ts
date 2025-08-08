import fs from 'fs';
import { Cell } from './Cell';

function main() {
  console.log('Reading input file...');

  const inputFilePath = process.cwd() + '/input.txt';

  const file = fs.readFileSync(inputFilePath, 'utf8');
  const line: string = file.split('\n').map((line) => line.trim())[0];

  console.log('INPUT LINE: ', line);

  const inputs: string[] = line.split(',').map((input) => input.trim());

  console.log('INPUTS: ', inputs);

  const cells: Record<number, number> = {}

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];

    const cell = new Cell(input, i);

    cells[i] = cell.getOutput(cells);
  }

  console.log('OUTPUTS: ', cells);
}

main();
