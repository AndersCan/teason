import Fastify from 'fastify';

import { getSchema } from './ts-to-js';
import { getJsonOf } from './schema-to-json';
import { writeFile } from 'fs';
// Declare a route
const app = Fastify();
app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

app.get('/:interfaceName', async (request, reply) => {
  const { interfaceName } = request.params;
  console.log({ interfaceName });
  const schema = getSchema(capitalize(interfaceName));
  console.log({ schema });
  const json = await getJsonOf(schema);
  writeFile('./db.json', JSON.stringify(json), (err) => {
    if (err) {
      console.log('erroronio!');
    } else {
      console.log('success!');
    }
  });
  return { json, schema };
});

// Run the server!
const start = async () => {
  try {
    await app.listen(3000);
    app.log.info(`server listening on ${app.server.address()}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();

function capitalize(str: string) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}
