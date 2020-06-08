import request from 'supertest';
import app from '../src/app';

describe('GET /random-url', () => {
  xit('should return 501', done => {
    request(app)
      .get('/random-url')
      .expect(501, done);
  });
});
