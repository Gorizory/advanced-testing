import util from 'util';
import fs from 'fs';

const promisifiedReadFile = util.promisify(fs.readFile);

export function readFile(filename: string, encoding: string = 'utf8') {
    return promisifiedReadFile(filename, encoding);
}
