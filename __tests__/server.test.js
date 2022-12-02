'use strict';

const { app } = require('../src/server.js');
const supertest = require('supertest');
const { sequelizeDatabase } = require('../src/models/index.js');
const request = supertest(app);

beforeAll(async () => {
  await sequelizeDatabase.sync();

});

afterAll(async () => {
  await sequelizeDatabase.drop();
});


describe('REST API', () => {

    test('handles invalid requests', async () => {
        const response = await request.get('/foo');
        expect(response.status).toEqual(404);
    });

test('creates a food', async () => {
    let response = await request.post('/food').send({   
        name:'mango',
        group: 'fruit',
    });
    let responseTwo = await request.post('/food').send({
        name:'banana',
        group: 'fruit',
    });

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('mango');
    expect(response.body.group).toEqual('fruit');

    expect(responseTwo.status).toEqual(200);
    expect(responseTwo.body.name).toEqual('banana');
    expect(responseTwo.body.group).toEqual('fruit');
});

test('finds all food', async () => {
    let response = await request.get('/food');

    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(2); // if using sqlite:memory, be sure to delete the memory file.
    expect(response.body[0].name).toEqual('mango');
    expect(response.body[0].group).toEqual('fruit');
    expect(response.body[1].name).toEqual('banana');
    expect(response.body[1].group).toEqual('fruit');

});

test('finds a single food item', async () => {
    let response = await request.get('/food/2');

    expect(response.body.name).toEqual('banana');
    expect(response.body.group).toEqual('fruit');
});

test('updates a single food item', async () => {
    await request.put('/food/2').send({
        name: "lettuce",
        group: 'vegetable',
    });

let response = await request.get('food/2');

expect(response.body.name).toEqual('lettuce');
expect(response.body.group).toEqual('vegetable');
});

test('deletes a single food item', async () => {
    await request.delete('/food/1');

    let response = await request.get('/food');

    expect(response.body.length).toEqual(1);
    expect(response.body[0].name).toEqual('mango');
    expect(response.body[0].group).toEqual('fruit');

});
});
