const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token  = require('../models/token');
const config = require('../config');

router.post('/signup', (req, res, next) => {
 let user = new User();
 user.name = req.body.name;
 user.email = req.body.email;
 user.password = req.body.password;
 user.picture = user.gravatar();
 user.isSeller = req.body.isSeller;

 User.findOne({ email: req.body.email }, (err, existingUser) => {
  if (existingUser) {
    res.json({
      success: false,
      message: 'Account with that email is already exist'
    });
  } else {
    user.save();
    var token = jwt.sign({
      user: user
    }, config.secret, {
      expiresIn: '7d'
    });
    res.json({
      success: true,
      message: 'Enjoy your token',
      token: token
    });
  }

 });
});

router.post('/login', (req, res, next) => {

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.json({
        success: false,
        message: 'Authenticated failed, User not found'
      });
    } else if (user) {
      let validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password'
        });
      } else {
        var token = jwt.sign({
          user: user
        }, config.secret, {
          expiresIn: '7d'
        });
        let tokenInstance = new Token();
        tokenInstance.email = user.email;
        tokenInstance.token = token;
        tokenInstance.save();
        res.json({
          success: true,
          message: "Enjoy your token",
          token: token
        });
      }
    }

  });
});

router.get('/users', (req, res, next) => {
    User.find((err, user) => {
        if(err) throw err;
        if (user) {
            res.json({
                success: true,
                data: user
            })
        }
        else {
            res.json({
                success: true,
                data: []
            })
        }
    })
});

router.get('/tokens', (req, res, next) => {
    try {
        Token.find((err, token) => {
            if(err) throw err;
            if (token) {
                res.json({
                    success: true,
                    data: token
                })
            }
        })
    }
    catch (e) {
        res.json({
            success: true,
            data: []
        })
    }
});

router.get('/logout', (req,res, next) => {
    var token = req.get('Token');
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) throw err;
            if (decoded) {
                Token.remove({email: decoded.user.email}, true);
            }
            res.json({
                success: true,
                data: {},
                message: 'Succesfully logged out'
            })
        })
    }
    else {
        res.json({
            success: false,
            data: {},
            message: 'Unauthorised request'
        })
    }
});



module.exports = router;
