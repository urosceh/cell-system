import fs from 'fs';

function main() {
  console.log('Reading input file...');

  const inputFilePath = process.cwd() + '/input.txt';

  const file = fs.readFileSync(inputFilePath, 'utf8');
  const line: string = file.split('\n').map((line) => line.trim())[0];

  console.log('INPUT LINE: ', line);

  const inputs: string[] = line.split(',').map((input) => input.trim());

  console.log('INPUTS: ', inputs);
}

main();
