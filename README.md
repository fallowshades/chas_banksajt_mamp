# Skapa en Banksajt och publicera på aws

I dagens uppgift ska vi öva på att skapa en react-sajt med backend i express och publicera den på en ec2 instans i aws med scp.

## Data i backend

I bankens backend finns tre arrayer: En array `users` för användare, en array `accounts` för bankkonton och en array `sessions` för engångslösenord`.

**Users**
Varje användare har ett id, ett användarnamn och ett lösenord.

```
[{id: 101, username: "Joe", password: "hemligt" }, ...]
```

**Accounts**
Varje bankkonto har ett id, ett användarid och ett saldo.

```
[{id: 1, userId: 101, amount: 200 }, ...]
```

**Sessions**
När en användare loggar in skapas ett engångslösenord. Engångslösenordet och användarid läggs i sessions arrayen.

```
[{userId: 101, token: "nwuefweufh" }, ...]
```

### Sidor på sajten

Banken har följande sidor på sin sajt:

**Landningssida**
Ska innehålla navigering med länkar till Hem, logga in och skapa användare och en hero-section med knapp till skapa användare

**Skapa användare**
Ett fält för användarnamn och ett för lösenord. Datat ska sparas i arrayen users i backend och ett bankkonto skapas i backend med 0 kr som saldo.

**Logga in**
Ett fält för användarnamn och ett för lösenord och en logga in knapp. När man klickat på knappen ska man få tillbaka sitt engångslösenord i response och skickas till kontosidan med useRouter.

**Kontosida**
Här kan man se sitt saldo och sätta in pengar på kontot. För att göra detta behöver man skicka med sitt engångslösenord till backend.

## Hur du klarar uppgiften

1. Öppna en terminal och gå med `cd` där du vill skapa projektet.
2. Skapa där en folder: bank och gå med `cd` in i foldern.

### Skapa frontend

1. Skriv `npx create-next-app frontend`.
2. Gå in i projektet: `cd frontend`.

### Skapa backend

1. Backa en nivå med `cd ..`.
1. Skapa en folder: backend och gå med `cd` in i foldern.
1. Skriv `npm init` och tryck Enter på alla frågor.
1. Lägg till `"type": "module"`i package.json
1. I scripts i package.json lägg till: `"start": "nodemon server.js"`
1. Installera dependencies: `npm i express cors body-parser`
1. Börja skriva kod i `server.js`

### Endpoints och arrayer

1. I backend skapa tre tomma arrayer: `users`, `accounts` och `sessions`.
2. Skapa endpoints för:

- Skapa användare (POST): "/users"
- Logga in (POST): "/sessions"
- Visa salodo (POST): "/me/accounts"
- Sätt in pengar (POST): "/me/accounts/transactions"

3. När man loggar in ska ett engångslösenord skapas och skickas tillbaka i response.
4. När man hämtar saldot ska samma engångslösenord skickas med i Post.

### Startkod för server.js i backend

```
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Generera engångslösenord
function generateOTP() {
    // Generera en sexsiffrig numerisk OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

// Din kod här. Skriv dina arrayer


// Din kod här. Skriv dina routes:

// Starta servern
app.listen(port, () => {
    console.log(`Bankens backend körs på http://localhost:${port}`);
});

```

### Exempel på fetch för POST i frontend

```
fetch('http://localhost:3001/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: 'Användarnamn',
        password: 'Lösenord',
    }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch((error) => {
    console.error('Error:', error);
});

```

## Publicera på aws

1. Gå med cd upp en nivå så att du är i bank-mappen. Överför filerna med scp (radera node_modules först så går det snabbare) :

```
scp -i <din-nyckel>.pem -r ./ ubuntu@<din-ec2-instans>:/home/ubuntu/bank
```

2. logga in på din instans med ssh.

3. Installera Node.js om det inte redan är installerat.

4. Navigera till din backend-mapp och starta din server med node server.js.

5. Navigera till din frontend-mapp. Kör följande:

```
npm install
npm run build
npm run start
```

## Hur du lämnar in

1. Skapa ett repo på github.
2. Ladda up dina filer till github:

```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin <Adressen till ditt repo>
git push -u origin main
```

3. Klicka på uppgiften i canvas och ange länken till ditt repo.

---

### :boom: Success!

Efter denna uppgift ska ni kunna skapa en fullstack sajt med api och publicera på aws.

---

### :runner: Extrauppgifter

Klar? Här är lite mer att göra:

1. Installera pm2 på backend och se till att frontend och backend körs även när terminalen stängs.

## skapa backend identifiera objekt i array

```sh
npm init
```

skapa .git inore i backend mapped och ignorera node modules

server.js

- port 3001 eftersom jag använder port 3000 för frontend

```js
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const port = 3001

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Tomma arrayer för användare, konton och sessioner
let users = []
let accounts = []
let sessions = []
...

// Starta servern
app.listen(port, () => {
  console.log(`Bankens backend körs på http://localhost:${port}`)
})

```

- array metoder
  - identifiera via matchning
  - beroende av user matchning skapa object i array
  - sök objekt som beror på användare och session

```js
// Generera engångslösenord
function generateOTP() {
  // Generera en sexsiffrig numerisk OTP
  const otp = Math.floor(100000 + Math.random() * 900000)
  return otp.toString()
}

// Skapa användare
app.post('/users', (req, res) => {
  const { username, password } = req.body
  const user = { username, password }
  users.push(user)
  res.status(201).send('Användare skapad')
})
```

```js
// Logga in och skicka engångslösenord
app.post('/sessions', (req, res) => {
  const { username, password } = req.body
  const user = users.find(
    (u) => u.username === username && u.password === password
  )
  if (!user) {
    return res.status(401).send('Fel användarnamn eller lösenord')
  }

  const otp = generateOTP()
  sessions.push({ username, otp })
  res.status(200).json({ otp })
})
```

```js
// Visa saldo
app.post('/me/accounts', (req, res) => {
  const { username, otp } = req.body
  const session = sessions.find((s) => s.username === username && s.otp === otp)
  if (!session) {
    return res.status(401).send('Ogiltig session')
  }

  // Din kod för att visa saldo här

  res.status(200).send('Visa saldo')
})

// Sätt in pengar
app.post('/me/accounts/transactions', (req, res) => {
  const { username, otp } = req.body
  const session = sessions.find((s) => s.username === username && s.otp === otp)
  if (!session) {
    return res.status(401).send('Ogiltig session')
  }
```

## front end navigering

### basic chatGPT navigering

```sh
npx create-next-app@latest frontend
```

[route-groups]https://nextjs.org/docs/app/building-your-application/routing/route-groups

skapa sidor i dashboard

app
-(dashboard)
--accounts
--auth
---signup
---login
--profile

app\page.js

```js
'use client'
import Link from 'next/link'
function LandingPage() {
  return (
    <div>
      <nav className='flex gap-2'>
        <Link href='/'>Hem</Link>
        <Link href='/auth/login'>Logga in</Link>
        <Link href='/auth/signup'>Skapa användare</Link>
      </nav>
      <section className='hero-section'>
        <h1>Välkommen till banken</h1>
        <button>
          <Link href='/auth/signup'>Skapa användare</Link>
        </button>
      </section>
    </div>
  )
}

export default LandingPage
```

#### pages

login.js

```js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login({ params }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      if (response.ok) {
        const data = await response.json()
        setOtp(data.otp)
        router.push('/me/accounts')
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <h2>Logga in</h2>
      <input
        type='text'
        placeholder='Användarnamn'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type='password'
        placeholder='Lösenord'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Logga in</button>
    </div>
  )
}
```

signup\page.js

```js
'use client'
import { useState } from 'react'
import { handleSignup } from '@/utils/actions'
import { useRouter } from 'next/navigation'
export default function SignupPage({ params }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  return (
    <div>
      <h2>Skapa användare</h2>
      <input
        type='text'
        placeholder='Användarnamn'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type='password'
        placeholder='Lösenord'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Skapa användare</button>
    </div>
  )
}
```

accounts\page

```js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

function Accounts({ params }) {
  const [otp, setOtp] = useState('')
  const [balance, setBalance] = useState(0)
  const router = useRouter()

  const handleGetBalance = async () => {
    try {
      const response = await fetch('http://localhost:3001/me/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'username', otp }),
      })
      if (response.ok) {
        // Hantera saldo data
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <h2>Kontosida</h2>
      <button onClick={handleGetBalance}>Visa saldo</button>
      <p>Saldo: {balance}</p>
    </div>
  )
}

export default Accounts
```

### ordentlig navigering med style

```sh
npx shadcn-ui@latest init
npx shadcn-ui@latest add button dropdown-menu form input select badge separator card
npm install next-themes
```

#### global style

appproviders.js

```js
'use client'
import { ThemeProvider } from '@/components/theme-provider'
const Providers = ({ children }) => {
  return (
    <>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </>
  )
}
export default Providers
```

app\layout

- note hydration

```jsx
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

#### dashboard style

(dashboard)\layout.jsx

- sidebar is responsive

```jsx
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

function layout({ children }) {
  return (
    <main className='grid lg:grid-cols-5'>
      {/* first-col hide on small screen */}
      <div className='hidden lg:block lg:col-span-1 lg:min-h-screen'>
        <Sidebar />
      </div>
      {/* second-col hide dropdown on big screen */}

      <div className='lg:col-span-4'>
        <Navbar />
        <div className='py-16 px-4 sm:px-8 lg:px-16'>{children}</div>
      </div>
    </main>
  )
}
export default layout
```

#### responsive navbar with potential sidebar capabillity

Navbar.jsx

```jsx
import LinksDropdown from './DropdownLinks'
import ThemeToggle from './ThemeToggle'

function Navbar() {
  return (
    <nav className='bg-muted py-4 sm:px-16 lg:px-24 px-4 flex items-center justify-between'>
      <div>
        <LinksDropdown />
      </div>
      <div className='flex items-center gap-x-4'>
        <ThemeToggle />
      </div>
    </nav>
  )
}
export default Navbar
```

DropdownLinks.jsx

```jsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AlignLeft } from 'lucide-react'
import { Button } from './ui/button'
import links from '@/utils/links'
import Link from 'next/link'
function DropdownLinks() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='lg:hidden'>
        <Button variant='outline' size='icon'>
          <AlignLeft />

          <span className='sr-only'>Toggle links</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-52 lg:hidden '
        align='start'
        sideOffset={25}
      >
        {links.map((link) => {
          return (
            <DropdownMenuItem key={link.href}>
              <Link href={link.href} className='flex items-center gap-x-2 '>
                {link.icon} <span className='capitalize'>{link.label}</span>
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default DropdownLinks
```

ThemeToggle.jsx

```jsx
'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

sidebar.jsx

```jsx
'use client'

import links from '@/utils/links'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className='py-4 px-8 bg-muted h-full'>
      <div className='flex flex-col mt-20 gap-y-4'>
        {links.map((link) => {
          return (
            <Button
              asChild
              key={link.href}
              variant={pathname === link.href ? 'default' : 'link'}
            >
              <Link href={link.href} className='flex items-center gap-x-2 '>
                {link.icon} <span className='capitalize'>{link.label}</span>
              </Link>
            </Button>
          )
        })}
      </div>
    </aside>
  )
}
export default Sidebar
```

## login is fun with chatgtp

### this

\login\page.js

```js
router.push('/accounts')
```

signup\page.jsx

```js
const handleSignup = async () => {
  try {
    // Send a POST request to the backend
    const response = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    if (response.ok) {
      // Redirect the user to another page upon successful signup
      router.push('/auth/login') // Example: redirect to login page
    } else {
      // Handle the error response
      throw new Error('Signup failed')
    }
  } catch (error) {
    console.error('Signup failed:', error)
    // Handle error, such as displaying an error message to the user
  }
}
```

## account request response cycles

### happy objects

#### create extra parameter and provide info to identify object

accounts\page.js

```js
import { Button } from '@/components/ui/button'
function Accounts({ params }) {
  ...

  const [amount, setAmount] = useState(0)

  const handleDeposit = async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/me/accounts/transactions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: 'username', otp, amount }),
        }
      )
      if (response.ok) {
        // Reload balance or update UI
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

return (
  <div>
    <div>
      <h2>Kontosida</h2>
      <Button onClick={handleGetBalance}>Visa saldo</Button>
      <p>Saldo: {balance}</p>
    </div>
    <div>
      <h2>Kontosida</h2>
      <label>
        Engångslösenord:
        <input
          type='password'
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </label>
      <label>
        Belopp att sätta in:
        <input
          type='number'
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
      </label>
      <Button onClick={handleDeposit}>Sätt in pengar</Button>
    </div>
  </div>
)
}
```

server.js

- yeah this is what we call math. yuck! i am truly disgusted

```js
// Visa saldo
app.post('/me/accounts', (req, res) => {
  ...

  const saldo = accounts[session].balance

  res.status(200).send(saldo)
})

app.post('/me/accounts/transactions'), (req, res) => {

    const { username, otp, amount } = req.body
     const nyttsaldo = (accounts[session].balance += amount) || 0
       res.status(200).send(nyttsaldo)
}
```

#### nodemon discover need global state (sad life)

login and signup

```js
const [username, setUsername] = useState('abc')
const [password, setPassword] = useState('abc')
```

accounts\page.js

- we want the page to reload thats why we need useState, but we need better state managment for dependent input variables such as user object

```js
function Accounts({ params }) {

   const handleGetBalance = async () => {
      ...
       const data = await response.json() // Parse response body as JSON
        setBalance(data.balance) // Update balance state with received balance
   }

    const handleDeposit = async () => {
        ...
         const data = await response.json() // Parse response body as JSON
        setBalance(data.balance) // Update balance state with received balance
    }
}
```

server.js

```js
app.post('/users', (req, res) => {
   console.log(users)
}

app.post('/sessions', (req, res) => {
   console.log(sessions)

}

app.post('/me/accounts', (req, res) => {
  const saldo = accounts[session].balance
    console.log(saldo)
}

app.post('/me/accounts/transactions', (req, res) => {

    // Din kod för att hantera transaktioner här
  accounts[session].balance += amount

  // Send the updated balance back to the client
  const newBalance = accounts[accountIndex].balance
  console.log(saldo)
}
```

### sad developer realize life is what it is. we need context

#### setup

```js

```

## but first the server

### server user account relationship

#### close to correct

server.js

```js
let userIds = 1
...
//visa saldo:

//1. skicka token
//2. token ger userId från sessions
//3. userId get salodo från accounts

// sätta in pengar
// 1. skicka token och antal kronor
// 2. token ger userId från sessions
// 3. updatera accouts med nytt saldo

app.post('/users', (req, res) => {
    const user = { id: userIds++, username, password }
    ...
      const account = { id: accounts.length + 1, userId: user.id, balance: 0 }
  accounts.push(account)
  console.log(account)
})

```

```js
app.post('/sessions', (req, res) => {
    ...
      const session = { userId: user.id, token: otp }
  sessions.push(session)
  console.log(`sessions ${session}`)
  console.log(`otp ${otp}`)
})
```

```js
app.post('/me/accounts', (req, res) => {
      console.log(otp)
  console.log('username:', username, 'otp:', otp)
  console.log(`sessions: ${sessions[0]}`)
  const session = sessions.find((s) => s.userId === username && s.token === otp)
  if (!session) {
    console.log('err session in accounts')
    return res.status(401).send('Ogiltig session')
  }
  console.log(session)
  const account = accounts.find((s) => s.userId === session.userId)
  if (!account) {
    console.log('err account in accounts')

      let saldo = 0
  if (account.balance) {
    saldo = account.balance
  }
})
```

```js
app.post('/me/accounts/transactions', (req, res) => {
  console.log('in transaction otp=', otp)
  console.log(sessions[0])
  //const session = sessions.find((s) => s.username === username && s.otp === otp)
  const session = sessions.find((s) => s.token === otp)

  console.log(session)

  const account = accounts.find((s) => s.userId === session.userId)
  if (!account) {
    console.log('err no account in transaction')
    return res.status(401).send('Ogiltig session')
  }
  account.balance += amount

  console.log(`account: ${account}`)
  // Send the updated balance back to the client
  const newBalance = account.balance
  console.log(`newBalance ${newBalance}`)
})
```

#### Fix transaction inputs

server.js

- only search for otp

```js
app.post('/me/accounts', (req, res) => {
  console.log(`users: ${JSON.stringify(users)}`)
  console.log(`accounts: ${JSON.stringify(accounts)}`)
  console.log(`sessions: ${JSON.stringify(sessions)}`)

  console.log('otp:', otp)
  console.log(`sessions: ${sessions} x $`)
  const session = sessions.find((s) => s.token === otp)
})

app.post('/me/accounts/transactions', (req, res) => {
  console.log(`users: ${JSON.stringify(users)}`)
  console.log(`accounts: ${JSON.stringify(accounts)}`)
  console.log(`sessions: ${JSON.stringify(sessions)}`)
})
```

acounts/page.js

- error aswell

```js
const handleGetBalance = async () => {
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
}
const handleDeposit = async () => {
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
}
return (
  <div>
    ...
    <label>
      otp.ie Token:
      <input type='text' value={otp} onChange={(e) => setOtp(e.target.value)} />
    </label>
    ...
  </div>
)
```
