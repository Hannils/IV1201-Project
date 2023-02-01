// Unit test for test-database connecttion

import { Client } from 'pg';

describe('PostgreSQL tests', () => {
  let client: Client;

  beforeAll(async () => {
    client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      database: 'test_db',
    });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  it('checks the connection to the database', async () => {
    const res = await client.query('SELECT NOW()');
    expect(res.rows[0]).toHaveProperty('now');
  });
  
});