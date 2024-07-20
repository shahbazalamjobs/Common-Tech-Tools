
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./auth');
const dotenv = require('dotenv');
const port = process.env.SERVER_PORT || 3000;

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // Frontend origin
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }   // When true, the cookie is only sent over HTTPS (false here for development purposes)
}));

app.use(passport.initialize());
app.use(passport.session());

require('./passport-setup');

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API working');
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
