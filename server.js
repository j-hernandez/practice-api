const express = require("express");
const app = express();

// const app = require("express")();

// middleware
app.use(express.json());
app.use(express.urlencoded());

const PORT = 3001;
// Setup a connection to the database with pg-promise
const pgp = require("pg-promise")();
const db = pgp("postgres://hyeeumfv:1YwH3PINc4cZLU1YqnL2Lix1AtNwci7s@queenie.db.elephantsql.com:5432/hyeeumfv")

// CRUD Stuff down here

// Get all Users
app.get('/users', async (req, res) => {
    const users = await db.any("SELECT * from users").then((users) => {
        console.log(users); 
        return users;
    });
    res.send(users);
})

// Create a User entity
app.post('/users', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    await db.none("INSERT INTO users (name, email) VALUES ($1, $2);", [name, email])
    res.send('user created');
})

// Get a single User entity
app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    const user = await db.one(`SELECT * FROM users WHERE id = $1`, [id])
        .then((user) => {
            console.log(user);
            return user;
        })
    res.send(user);
})

app.put('/users/:id', async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const email = req.body.email;

    await db.none("UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email, id]);
    res.send('user updated');
})

app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;

    await db.none(`DELETE FROM users WHERE id = $1`, [id]);
    res.send('user deleted');
})

app.get('/ping', (req, res) => {
    res.send('pong');
})

app.listen(PORT, () => {
    console.log(`My API is now running on port ${PORT}`);
})