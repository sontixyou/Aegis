import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { usersTable } from './db/schema';

const dbFileName = process.env.DB_FILE_NAME;
if (!dbFileName) {
  throw new Error('DB_FILE_NAME environment variable is not set.');
}
const db = drizzle(dbFileName);
const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.post('/user', async (c) => {
  insertUser()
    .then(() => {
      return c.json({ message: 'User created successfully!' });
    })
    .catch((error) => {
      console.error('Error inserting user:', error);
      return c.json({ error: 'Failed to create user' }, 500);
    });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

const insertUser = async () => {
  const user: typeof usersTable.$inferInsert = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
  };
  await db.insert(usersTable).values(user);
  console.log('New user created!');
  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users);
};
