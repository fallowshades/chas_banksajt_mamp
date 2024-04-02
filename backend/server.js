import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const port = 3001

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Tomma arrayer för användare, konton och sessioner
let userIds = 1
let users = []
let accounts = []
let sessions = []

//visa saldo:

//1. skicka token
//2. token ger userId från sessions
//3. userId get salodo från accounts

// sätta in pengar
// 1. skicka token och antal kronor
// 2. token ger userId från sessions
// 3. updatera accouts med nytt saldo

// Generera engångslösenord
function generateOTP() {
  // Generera en sexsiffrig numerisk OTP
  const otp = Math.floor(100000 + Math.random() * 900000)
  return otp.toString()
}

// Skapa användare
app.post('/users', (req, res) => {
  const { username, password } = req.body
  const user = { id: userIds++, username, password }
  users.push(user)
  console.log(users)
  const account = { id: accounts.length + 1, userId: user.id, balance: 0 }
  accounts.push(account)
  console.log(account)
  res.status(201).send('Användare skapad')
})

// Logga in och skicka engångslösenord
app.post('/sessions', (req, res) => {
  const { username, password } = req.body
  const user = users.find(
    (u) => u.username === username && u.password === password
  )
  if (!user) {
    console.log('error')
    return res.status(401).send('Fel användarnamn eller lösenord')
  }

  const otp = generateOTP()
  const session = { userId: user.id, token: otp }
  sessions.push(session)
  console.log(`sessions ${session}`)
  console.log(`otp ${otp}`)
  res.status(200).json({ otp })
})

// Visa saldo
app.post('/me/accounts', (req, res) => {
  console.log(`users: ${JSON.stringify(users)}`)
  console.log(`accounts: ${JSON.stringify(accounts)}`)
  console.log(`sessions: ${JSON.stringify(sessions)}`)
  const { otp } = req.body
  console.log(otp)
  console.log('otp:', otp)
  console.log(`sessions: ${sessions} x $`)
  const session = sessions.find((s) => s.token === otp)
  if (!session) {
    console.log('err session in accounts')
    return res.status(401).send('Ogiltig session')
  }
  console.log(session)
  const account = accounts.find((s) => s.userId === session.userId)
  if (!account) {
    console.log('err account in accounts')
    return res.status(401).send('Ogiltig session')
  }
  // Din kod för att visa saldo här
  let saldo = 0
  if (account.balance) {
    saldo = account.balance
  }
  console.log(saldo)
  res.status(200).json({ saldo: saldo })
})

// Sätt in pengar
app.post('/me/accounts/transactions', (req, res) => {
  console.log(`users: ${JSON.stringify(users)}`)
  console.log(`accounts: ${JSON.stringify(accounts)}`)
  console.log(`sessions: ${JSON.stringify(sessions)}`)
  const { otp, amount } = req.body
  console.log(req.body)
  console.log('in transaction otp=', otp)
  console.log(JSON.stringify(sessions[0]))
  //const session = sessions.find((s) => s.username === username && s.otp === otp)
  const session = sessions.find((s) => s.token === otp)
  if (!session) {
    console.log('err no session in transaction')
    return res.status(401).send('Ogiltig session')
  }
  console.log(JSON.stringify(sessions))

  const account = accounts.find((s) => s.userId === session.userId)
  if (!account) {
    console.log('err no account in transaction')
    return res.status(401).send('Ogiltig session')
  }
  // Din kod för att hantera transaktioner här
  account.balance += amount

  console.log(`account: ${account}`)
  // Send the updated balance back to the client
  const newBalance = account.balance
  console.log(`newBalance ${newBalance}`)
  res.status(200).json({ balance: newBalance })
})

// Starta servern
app.listen(port, () => {
  console.log(`Bankens backend körs på http://localhost:${port}`)
})
