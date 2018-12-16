import { expect } from 'code';
import Lab from 'lab';
import { server } from '../src/server';
const lab = (exports.lab = Lab.script());

lab.test('Create a record', async () => {
  const response = await server.inject({ url: '/', method: 'GET' });

  expect(response.payload).to.equal('Hello, World');
});
