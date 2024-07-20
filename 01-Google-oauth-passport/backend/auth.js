const router = require('express').Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('http://localhost:5173/dashboard');
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});


router.get('/user', (req, res) => {
  res.send(req.user);
});

module.exports = router;
