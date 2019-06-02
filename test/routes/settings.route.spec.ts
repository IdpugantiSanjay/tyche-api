import { expect } from 'chai';
import { server } from '../../src/server';
import { ISettings } from '../../src/ts.models/setting.model';

// import R from 'ramda';
describe('#userSettings', function() {
  it('Should Return Empty Object', async function() {
    var response = await request<ISettings>('/api/sanju/settings', 'GET');

    expect(Object.keys(response).length).eq(0);
  });

  it('Should Return Settings Object', async function() {
    var response = await request<ISettings>('/api/sanjay/settings', 'GET');

    expect(Object.keys(response).length).eq(2);
  });

  it('Should Return Empty Object when user does not exists', async function() {
    var response = await request<ISettings>('/api/notindb/settings', 'GET');
    expect(Object.keys(response).length).eq(0);
  });
});

describe('#saveUserSettings', function() {
  it('Should Return Empty Object', async function() {
    var response = await request<ISettings>('/api/sanju/settings', 'POST');

    expect(Object.keys(response).length).eq(0);
  });

  //   it('Should Return Settings Object', async function() {
  //     var response = await request<ISettings>('/api/sanjay/settings', 'GET');

  //     expect(Object.keys(response).length).eq(2);
  //   });

  //   it('Should Return Empty Object when user does not exists', async function() {
  //     var response = await request<ISettings>('/api/notindb/settings', 'GET');
  //     expect(Object.keys(response).length).eq(0);
  //   });
});

async function request<T>(url: string, method: 'GET' | 'POST' | 'DELETE', payload?: undefined) {
  var response;
  if (method == 'GET') {
    response = await server.inject({ url, method });
  } else {
    response = await server.inject({ url, method, payload });
  }

  return JSON.parse(response.payload) as T;
}
