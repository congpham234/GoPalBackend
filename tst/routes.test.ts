import request from 'supertest';
import app, { closeServer } from '../src/app';

describe('Express App', () => {
  afterEach(() => {
    closeServer();
  });

  it('responds with "App running" for GET /delivery', async () => {
    const response = await request(app).get('/delivery');
    expect(response.status).toBe(200);
    expect(response.text).toBe('App running');
  });
});
