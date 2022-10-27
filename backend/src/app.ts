import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { Pool } from 'pg';
import cors from 'cors';

const apiLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 60, // Limit each IP to one request per second
  message: "Too many requests",
	standardHeaders: true,
	legacyHeaders: false,
})

const createAccountLimiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 3, // Limit each IP to create three accounts per five minutes
	message: "Too many accounts created from this IP, please try again later",
	standardHeaders: true,
	legacyHeaders: false,
})

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
})

const port = 3000
const app = express();
app.use(express.json());
app.use(cors());
app.use(apiLimiter);

type RegisterBody = { username: string, password: string };
type LoginBody = { username: string, password: string };
type PostBody = { todo: string };
type PatchBody = { done: boolean, text: string };

const USER_ALREADY_EXISTS_ERROR = "Username already exists";
const USER_NOT_FOUND_ERROR = "Username or password incorrect";
const PASSWORD_TOO_SHORT_ERROR = "Password too short";
const UNAUTHORIZED_ERROR = "User unauthorized";
const UNEXPECTED_ERROR = "An unexpected error has occured";


function authorize(authorization: string): Promise<string> {
  const b64auth = (authorization || '').split(' ')[1] || ''
  const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':')
  return lookupUser(username, password)
}

async function lookupUser(username: string, password: string): Promise<string> {
  const authResult = await db.query("SELECT 1 FROM users WHERE username = $1 AND password = $2", [username, password])
  if (authResult.rowCount == 1) {
    return username
  }
  return null
}

async function checkUserExists(username: string): Promise<boolean> {
  const result = await db.query("SELECT 1 FROM users WHERE username = $1", [username])
  return result.rowCount > 0
}

async function getTodos(username: string) {
  const result = await db.query("SELECT ID, text, done FROM todos WHERE username = $1", [username])
  return result.rows
}

app.post("/register", createAccountLimiter, async (request: Request, response: Response) => {
  try {
    const body: RegisterBody = request.body
    if (await checkUserExists(body.username)) {
      response.status(409).send(USER_ALREADY_EXISTS_ERROR)
    } else if (body.password.length < 8) {
      response.status(403).send(PASSWORD_TOO_SHORT_ERROR)
    } else {
      await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [body.username, body.password])
      response.status(200).send()
    }
  } catch (err) {
    response.status(500).send(UNEXPECTED_ERROR)
  }
})

app.post("/login", async (request: Request, response: Response) => {
  try {
    const body: LoginBody = request.body
    const username = await lookupUser(body.username, body.password)
    if (username) {
      response.status(200).send()
    } else {
      response.status(404).send(USER_NOT_FOUND_ERROR)
    }
  } catch (err) {
    response.status(500).send(UNEXPECTED_ERROR)
  }
})

app.get("/todo", async (request: Request, response: Response) => {
  try {
    const username = await authorize(request.headers.authorization)
    if (username) {
      response.status(200).json(await getTodos(username))
    } else {
      response.status(401).send(UNAUTHORIZED_ERROR)
    }
  } catch (err) {
    response.status(500).send(UNEXPECTED_ERROR)
  }
})

app.post("/todo", async (request: Request, response: Response) => {
  try {
    const body: PostBody = request.body
    const username = await authorize(request.headers.authorization)
    if (username) {
      await db.query("INSERT INTO todos (text, username, done) VALUES ($1, $2, $3)", [body.todo, username, false])
      response.status(201).json(await getTodos(username))
    } else {
      response.status(401).send(UNAUTHORIZED_ERROR)
    }
  } catch (err) {
    response.status(500).send(UNEXPECTED_ERROR)
  }
})

app.patch("/todo/:id", async (request: Request, response: Response) => {
  try {
    const body: PatchBody = request.body;
    const username = await authorize(request.headers.authorization)
    if (username) {
      await db.query("UPDATE todos SET text = $1, done = $2 WHERE id = $3 AND username = $4", [body.text, body.done, request.params.id, username])
      response.status(200).json(await getTodos(username))
    } else {
      response.status(401).send(UNAUTHORIZED_ERROR)
    }
  } catch (err) {
    response.status(500).send(UNEXPECTED_ERROR)
  }
})

app.delete("/todo/:id", async (request: Request, response: Response) => {
  try {
    const username = await authorize(request.headers.authorization)
    if (username) {
      await db.query("DELETE FROM todos WHERE id = $1 AND username = $2", [request.params.id, username])
      response.status(200).json(await getTodos(username))
    } else {
      response.status(401).send(UNAUTHORIZED_ERROR)
    }
  } catch (err) {
    response.status(500).send(UNEXPECTED_ERROR)
  }
})


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});