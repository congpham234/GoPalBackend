import request from 'supertest';
import app, {closeServer} from '../src/app';

describe('Express App', () => {
  afterEach(() => {
    closeServer();
  });

  it('responds with "App running 👍" for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('App running 👍');
  });

  it('responds with JSON for GET /api/hello', async () => {
    const response = await request(app).get('/api/hello');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({message: 'Hello from Express Lambda!'});
  });
});
