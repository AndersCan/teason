/// <reference types="./json-schema-faker" />
import jsf from 'json-schema-faker';
import chance from 'chance';
import faker from 'faker';

import * as TJS from 'typescript-json-schema';

jsf.extend('chance', () => chance);
jsf.extend('faker', () => faker);

export function getJsonOf(schema: TJS.Definition | null): Promise<{}> {
  if (!schema) {
    return Promise.resolve({});
  }

  return new Promise((res) => {
    jsf.resolve(schema).then((sample: any) => {
      res(sample);
    });
  });
}
