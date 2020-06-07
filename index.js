#!/usr/bin/env node

const program = require('commander');
const package = require('./package.json');

program.version(package.version);

program
  .description('Converte um número em uma base especifica para outra!')
  .requiredOption('-n, --number <number>', 'Número que será convertido')
  .option('-i, --initial <initial_base>', 'Base do numero informado', val => Number(val), 10)
  .option('-b, --base <change_base>', 'Base a ser convertida', val => Number(val), 10)
  .option('-tab, --table', 'Mostrar tabela de conversão')

program.parse(process.argv);

base_convert(program.number, program.initial, program.base, program.table)

function positional (number, base) {
  const splitedNumber = `${number}`.split('').map(char => parseInt(char, base));

  const startLine = `NOTACAO POSICIONAL\n\n${number} na base ${base}\n\n`;

  const firstLine = splitedNumber.map(
    (char, index) => `${char}*${base}^${splitedNumber.length - 1 - index}`
  ).join(' + ') + ' =\n\n';

  const secondLine = splitedNumber.map(
    (char, index) => {
      const resultToPower = Math.pow(base, splitedNumber.length - 1 - index);
      return `${char}*${resultToPower}}`
    }
  ).join(' + ') + ' =\n\n';

  const third = splitedNumber.map(
    (char, index) => {
      const resultToPower = Math.pow(base, splitedNumber.length - 1 - index);
      const resultProduct = Number(char) * resultToPower;
      return resultProduct
    }
  );
  const result = third.reduce((acc, current) => acc + current)
  const thirdLine = third.join(' + ') + ' =\n\n';

  const endLine = `${result} na base 10\n`;

  return { 
    text: startLine + firstLine + secondLine + thirdLine + endLine,
    result
  }
}

function successive (number, base) {
  let fullText = `DIVISÃO SUCESSIVA\n\n${number} na base 10\n\n`;
  const result = [];
  
  let currentResult = number;

  while( currentResult >= 1 ) {
    const resultDivision = Math.floor(currentResult / base);
    const resultModule = (currentResult % base).toString(16).toUpperCase();
    fullText = fullText + `${currentResult} = ${base}*${resultDivision} + ${resultModule}\n\n`
    result.unshift(resultModule);
    currentResult = resultDivision;
  }
  fullText = fullText + `${result.join('')} na base ${base}\n`;

  return { 
    text: fullText,
    result: result.join('')
  }
}

function table(number, initial_base, change_base) {
  const numberOnBase10 = parseInt(number, initial_base);
  let fullText = `TABELA DE CONVERSÃO\n\n${number} na base ${initial_base}\n\n`;
  const result = [];
  
  let currentResult = numberOnBase10;

  while( currentResult >= 1 ) {
    const resultDivision = Math.floor(currentResult / change_base);
    const resultModule = currentResult % change_base;
    const resultModuleToBase = (currentResult % change_base).toString(change_base).toUpperCase();
    fullText = fullText + `${resultModule.toString(initial_base)} -> ${resultModuleToBase}\n\n`
    result.unshift(resultModule);
    currentResult = resultDivision;
  }
  fullText = fullText + `${result.join('')} na base ${change_base}\n`;

  return { 
    text: fullText,
    result: result.join('')
  }
}

function base_convert (number, initial_base, change_base, showTable) {
  const allowedBases = [2, 8, 10, 16];
  if (!allowedBases.includes(initial_base) || !allowedBases.includes(change_base)) {
    console.log('Bases permitidas: ' + allowedBases.join(', '))
    return
  }
  const numberOnBase10 = parseInt(number, initial_base);
  if(`${number}`.toUpperCase() !== numberOnBase10.toString(initial_base).toUpperCase()) {
    console.log('O NUMERO PASSADO NAO CORRESPONDE A BASE');
    return
  }

  if(!showTable) {
    const resultPositional = positional(number, initial_base);
    console.log(resultPositional.text);

    const resultSuccessive = successive(resultPositional.result, change_base);
    console.log(resultSuccessive.text);

    return;
  }

  const resultTable = table(number, initial_base, change_base);
  console.log(resultTable.text);
}
