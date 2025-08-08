import fs from 'fs';
import readline from 'readline';
import { Row } from './entity/Row';

function main() {
  console.log('Reading input file...');

  const inputFilePath = process.cwd() + '/input.txt';

  const file = fs.readFileSync(inputFilePath, 'utf8');
  const line: string = file.split('\n').map((line) => line.trim())[0];

  const inputs: string[] = line.split(',').map((input) => input.trim());

  if (inputs.length === 0 || inputs.some(input => input === '')) {
    throw new Error('Input file is empty or contains invalid data.');
  }

  console.log('Input file:\n', inputs.join(', '));
  // if initiall row is empty or invalid, throw an error
  const row = new Row(inputs);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  console.log('Menu:\n\ta. Print current values\n\tb. Change a value\n\tq. Quit');

  rl.on('line', (input) => {
    input = input.trim();

    if (input === 'a') {
      console.log('Current values:', row.toString());
    } else if (input.startsWith('b ')) {
      const parts = input.split(' ');
      if (parts.length !== 3 || isNaN(Number(parts[1]))) {
        console.log('Invalid command. Use "b <index> <new value>".');
        return;
      }
      const index = Number(parts[1]);
      const newValue = parts[2];
      try {
        row.changeValue(index, newValue);
        console.log(`Cell #${index} changed to "${newValue}".`);
      } catch (error: any) {
        console.error("No changes made to row: ", error.message);
      }
    } else if (input === 'q') {
      console.log('Quitting...');
      rl.close();
    } else {
      console.log('Invalid command. Use "a", "b <index> <new value>", or "q".');
    }
  })
}

main();
