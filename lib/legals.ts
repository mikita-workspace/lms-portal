import { readFileSync } from 'node:fs';

import path from 'path';

export const getLegalsDocument = (filename: string) => {
  const filePath = path.join('public/legals/', `${filename}.md`);
  const fileContent = readFileSync(filePath, 'utf8');

  return fileContent;
};
