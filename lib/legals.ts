import { readFileSync } from 'node:fs';

import path from 'path';

export const getLegalsDocument = (filename: string) => {
  const filePath = path.join('docs', `${filename}.md`);
  const fileContent = readFileSync(filePath, 'utf8');

  return fileContent;
};