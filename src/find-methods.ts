import { allSolidityTypes } from './solidity-types';
import { ethers } from 'ethers';

const solidityFunctionRegex = /function\s+[a-zA-Z_]\w*\s*\([^)]*\)\s*(public|external|internal|private)?/g;
const removeDetailsRegex = /\b[_a-zA-Z]\w*\s*(?=,|\))/g;
const removeKeywordsRegex = /\b(\s*function|calldata|memory|storage|private|public|internal|external|view)\s*/g;


export const findMethods = (text: string): string[] => {
  let methodsRegex = text.replace(/\n/g, ' ').match(solidityFunctionRegex);
  if (!methodsRegex) {
    return [];
  }
  let methods = methodsRegex.map((method) => {
    return method
      .replace(removeDetailsRegex, '')
      .replace(removeKeywordsRegex, '')
      .replace(/\s+/g, '')
      .replace(/\bint(?![0-9])/g, 'int256')
      .replace(/\buint(?![0-9])/g, 'uint256');
  });
  for (let i = methods.length - 1; i >= 0; i--) {
    const method = methods[i];
    // get part between ( and )
    const params = method.match(/\(([^)]+)\)/)?.[1];
    if (params) {
      const paramsArray = params.split(',').map(p => p.replace('[]', ''));
      for (const param of paramsArray) {
        if (!allSolidityTypes.has(param)) {
          console.log('unknown type: ', param);
          methods.splice(i, 1);
        }
      }
    }
  }
  const result = methods.map((method) => {
    return method + ' <code>' + ethers.id(method).substring(0, 10) + '</code>';
  });
  return result;
};
