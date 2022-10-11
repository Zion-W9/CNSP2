import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000

const db = new Pool({
  user: 'username',
  host: 'todo-db',
  database: 'cnsp',
  password: 'password',
  port: 5432,
})

type LoginBody = { username: string, password: string };
type PostBody = { todo: string };
type PatchBody = { done: boolean, text: string };

function authorize(authorization: string): Promise<string> {
  const b64auth = (authorization || '').split(' ')[1] || ''
  const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':')
  return lookupUser(username, password)
}

async function lookupUser(username: string, password: string): Promise<string> {
  const authResult = await db.query("SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'")
  if (authResult.rowCount == 1) {
    return username
  }
  return null
}

async function getTodos(username: string) {
  const result = await db.query("SELECT * FROM todos WHERE username = '" + username + "'")
  return result.rows
}

app.post("/login", async (request: Request, response: Response) => {
  try {
    const body: LoginBody = request.body
    const username = await lookupUser(body.username, body.password)
    if (username) {
      response.status(200).send()
    } else {
      response.status(400).send()
    }
  } catch (err) {
    response.status(400).send(err)
  }
})

app.get("/todo", async (request: Request, response: Response) => {
  try {
    const username = await authorize(request.headers.authorization)
    if (username) {
      response.status(200).json(await getTodos(username))
    } else {
      response.status(401).send()
    }
  } catch (err) {
    response.status(400).send(err)
  }
})

app.post("/todo", async (request: Request, response: Response) => {
  try {
    const body: PostBody = request.body
    const username = await authorize(request.headers.authorization)
    if (username) {
      await db.query("INSERT INTO todos (text, username, done) VALUES ('" + body.todo + "', '" + username + "', false)")
      response.status(201).json(await getTodos(username))
    } else {
      response.status(401).send()
    }
  } catch (err) {
    response.status(400).send(err)
  }
})

app.patch("/todo/:id", async (request: Request, response: Response) => {
  try {
    const body: PatchBody = request.body;
    const username = await authorize(request.headers.authorization)
    if (username) {
      await db.query("UPDATE todos SET done = " + body.done + ", text = '" + body.text + "' WHERE id = " + request.params.id + " AND username = '" + username + "'")
      response.status(200).json(await getTodos(username))
    } else {
      response.status(401).send()
    }
  } catch (err) {
    response.status(400).send(err)
  }
})

app.delete("/todo/:id", async (request: Request, response: Response) => {
  try {
    const username = await authorize(request.headers.authorization)
    if (username) {
      await db.query("DELETE FROM todos WHERE id = " + request.params.id + " AND username = '" + username + "'")
      response.status(200).json(await getTodos(username))
    } else {
      response.status(401).send()
    }
  } catch (err) {
    response.status(400).send(err)
  }
})


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});