const express = require('express');
const router = express.Router();
const passport = require('passport')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const db = require('../../../db')

const verify = (username, password, done) => {
  db.users.findByUsername(username, (err, user) => {
    if (err) {return done(err)}
    if (!user) { return done(null, false) }

    if( !db.users.verifyPassword(user, password)) {
      return done(null, false)
    }

    return done(null, user)
  })
}

const options = {
  usernameField: "username",
  passwordField: "password",
}

passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser( (id, cb) => {
  db.users.findById(id,  (err, user) => {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

router.use(express.urlencoded());
router.use(session({ secret: 'SECRET'}));

router.use(passport.initialize())
router.use(passport.session())

router.get('/login', (req, res) => {
    res.render('login')
  }
)

router.get('/me', (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('login')
    }
    next()
  },
  (req, res) => {
    res.render('me', {user: req.user})
  }
)

router.post('/login', 
  passport.authenticate('local', {
    successRedirect: 'me',
    failureRedirect: 'login' 
  })
)

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) { return next(err); }
        res.redirect('login');
      }
    )
  }
)

router.get('/signup', (req, res) => {
    res.render('signup')
  }
)

router.post('/signup', (req, res) => {
    db.users.addUser(req.body, (err, user) => {
      if (err) {res.status(500).json(err)}
      res.redirect('login')
    })
  }
)

module.exports = router