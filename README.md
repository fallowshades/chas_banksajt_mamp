# forts'tt med Banksajt men sql

## migrate local db to mysql

### managment of objeccts in the array

#### the user object in create user

```sh
npm mysql
```

[communication] https://sidorares.github.io/node-mysql2/docs/documentation/promise-wrapper

index.js

```js
import mysql from 'mysql2/promise'

// connect to DB
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bank',
  port: 8889,
})

// help function to make code look nicer
async function query(sql, params) {
  const [results] = await pool.execute(sql, params)
  return results
}

app.post('/users', async (req, res) => {

 try {
    const result = await query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    )

  ...

    res.status(201).send('User created')
  } catch (error) {
    console.error('Error creating user', error)
    res.status(500).send('Error creating user')
  }

}
```

thunderclient

```json
{
  "username": "abc",
  "password": "abc"
}
```

#### another table with a constrain defined in relation view

server.js

```js
app.post('/users', async (req, res) => {
  console.log(result.insertId)
  const userId = result.insertId

  const balance = 0
  // console.log(users)
  const accountInsertResult = await query(
    'INSERT INTO accounts (userId, balance) VALUES (?, ?)',
    [userId, balance]
  )
  console.log(accountInsertResult)
})
```
