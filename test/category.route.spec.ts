import { expect } from 'code';
import Lab from 'lab';
import { server } from '../src/server';
import { Category } from '../src/ts.models/category.model';
const lab = (exports.lab = Lab.script());

lab.experiment('Categories', function() {
  lab.test('Category List Length', async function() {
    const response = await server.inject({ url: '/api/sanjay/categories', method: 'GET' });

    expect(JSON.parse(response.payload).length).to.be.equal(5);
  });

  lab.test('Category List Validity', async function() {
    const response = await server.inject({ url: '/api/sanjay/categories', method: 'GET' });

    const categories: Category[] = JSON.parse(response.payload);

    categories.forEach(category => {
      expect(category.type).to.exist();
      expect(category.name).to.exist();
      expect(category._id).to.exist();
    });
  });
});
