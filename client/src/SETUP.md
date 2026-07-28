# Setup & Run

## 1. Server (your existing Express code)

Make sure your router is mounted in `server/index.js` like this:

```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); // your file

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/myapp');

app.use('/api/user', userRoutes);   // -> /api/user/signup, /api/user/login

app.listen(5000, () => console.log('Server on http://localhost:5000'));
```

If you mount the router at a different path, update the fetch URLs in
`Signup.jsx` and `Login.jsx` to match.

## 2. Client

```bash
npm create vite@latest client -- --template react
cd client
npm install
npm install react-router-dom
```

Then:
- Replace `client/src/App.jsx` with the provided `App.jsx`
- Create `client/src/pages/` and copy in `Signup.jsx`, `Login.jsx`, `Home.jsx`, `auth.css`
- You can delete `App.css` and clear `index.css` if you like

Add the proxy in `client/vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:5000' },
  },
});
```

## 3. Run both

Terminal 1:
```bash
cd server
node index.js
```

Terminal 2:
```bash
cd client
npm run dev
```

Open http://localhost:5173 — you'll land on the login page; use the link to sign up first.
