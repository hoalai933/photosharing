
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// In-memory user (for demo)
const USERS = [
  { id: 1, username: 'admin', password: '123', role: 'admin' },
  { id: 2, username: 'user', password: 'abc', role: 'user' }
];

// In-memory posts
let POSTS = [
  { id: 1, title: 'Welcome', content: 'This is the first post', author: 'admin', createdAt: new Date().toISOString() },
  { id: 2, title: 'Second Post', content: 'Hello from backend', author: 'admin', createdAt: new Date().toISOString() }
];

function generateToken(user) {
  const payload = { id: user.id, username: user.username, role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ message: 'Missing Authorization header' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid Authorization format' });
  const token = parts[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// Login endpoint - check credentials server-side
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const token = generateToken(user);
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// Get posts list
app.get('/api/posts', (req, res) => {
  // Return list without full content for efficiency
  const list = POSTS.map(p => ({ id: p.id, title: p.title, author: p.author, createdAt: p.createdAt }));
  res.json(list);
});

// Get post detail
app.get('/api/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = POSTS.find(p => p.id === id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
});

// Create new post (protected)
app.post('/api/posts', authenticateToken, (req, res) => {
  const { title, content } = req.body || {};
  if (!title || !content) return res.status(400).json({ message: 'title and content required' });
  const newPost = {
    id: POSTS.length ? Math.max(...POSTS.map(p=>p.id)) + 1 : 1,
    title,
    content,
    author: req.user.username,
    createdAt: new Date().toISOString()
  };
  POSTS.unshift(newPost); // add to front
  res.status(201).json(newPost);
});

// Simple health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
