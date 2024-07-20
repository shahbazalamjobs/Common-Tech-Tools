
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Pool } = require('pg');
// import pool from './db';
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URI
}, async (accessToken, refreshToken, profile, done) => {
  const { id, displayName, emails, _json } = profile;
  const email = emails[0].value;
  const picture = _json.picture;

  // Check if user already exists in database
  let user = await pool.query('SELECT * FROM users WHERE google_id = $1', [id]);
  if (user.rows.length === 0) {
    // If not, create a new user
    user = await pool.query('INSERT INTO users (google_id, name, email, picture) VALUES ($1, $2, $3, $4) RETURNING *', [id, displayName, email, picture]);
  }

  done(null, user.rows[0]);
}));


passport.serializeUser((user, done) => {
  done(null, user.google_id);
});

passport.deserializeUser(async (id, done) => {
  const user = await pool.query('SELECT * FROM users WHERE google_id = $1', [id]);
  done(null, user.rows[0]);
});
