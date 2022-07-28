const request = require('supertest');
const app = require('../index');

test('/test-page returns 200 status with the correct text', async () => {
  const { status, text } = await request(app).get('/test-page');

  expect(status).toBe(200);
  expect(text).toContain("This is the About page")
});

test('/test-page-2/subfolder returns 200 status with the correct text', async () => {
  const { status, text } = await request(app).get('/test-page-2/subfolder');

  expect(status).toBe(200);
  expect(text).toContain("Jobs at Acme Co.")
});

test('/bad-url returns 404 status', async () => {
  const { status, text } = await request(app).get('/bad-url');

  expect(status).toBe(404);
  expect(text).toContain("404 Not Found")
});