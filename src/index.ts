import Debug from 'debug';

import { generateDatabase } from './generate-database';

const debug = Debug('teason:');

export interface TeasonProps {
  interfaceName: string;
  typesFolder: string;
  jsonOutputPath?: string;
  schemaOutputPath?: string;
  validationKeywords: string[];
}
export async function teason(props: TeasonProps) {
  const {
    interfaceName,
    typesFolder,
    jsonOutputPath,
    schemaOutputPath,
    validationKeywords
  } = props;

  if (!interfaceName || !typesFolder) {
    console.error('invalid interfaceName or typesFolder given', {
      interfaceName,
      typesFolder
    });
    return;
  }

  if (!jsonOutputPath && !schemaOutputPath) {
    console.info('No output will be generated', {
      jsonOutputPath,
      schemaOutputPath
    });
  }

  debug('building', typesFolder, interfaceName);

  const { json, schema } = await generateDatabase(
    typesFolder,
    interfaceName,
    validationKeywords
  );

  return { json, schema };
}
