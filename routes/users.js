const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');
const router = express.Router();

const privateKey = "Hexschool";

const users = {
  "aaa@gmail.com": {
    username: "123",
    password: '',

  }
};


// 1. Register
router.post('/signup', async (req, res, next) => {
  const { email, password, username } = req.body;
  console.log(req.body)

  if(users[email]) {
    return res.status(400).send({ error: "user exist"});
  }

  // 1.1 encrypt password
  const hashPassword = await bcrypt.hash(password, 10);
  console.log(hashPassword)

  // 1.2 save data
  users[email] = { password: hashPassword, username };
  
  res.status(201).json({
    message: "Successfully signup"
  });
});

// 2. login
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  // 1.1 validate user is exist
  const user = users[email];
  if (!user) {
    return res.status(401).send({
      error: 'user not exist'
    })
  }

  // 1.2 validate password. password, after crypto password
  console.log(bcrypt.compare(password, user.password))
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({
      error: 'login error'
    });
  }

  // 1.3 JWT sign
  let payload = {
    email,
    username: user.username
  }
  

  const token = jwt.sign(payload, privateKey, { expiresIn: '1h', })
  // const token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' });
  console.log(token)

  // 1.4 Response
  res.json({
    message: "Successfully login",
    token
  });
});

// 3. validate user & get user data
router.get('/profile', verifyToken, async (req, res, next) => {
  // const token = req.headers['authorization'];
  // console.log(token)

  // // 3.1 validate have token
  // if (!token) {
  //   return res.status(401).send({
  //     error: 'still not have login'
  //   })
  // }


  // // 3.2 validate process
  // jwt.verify(token, privateKey, (err, user) => { // user is just save in jwy payload
  //   if (err) {
  //     return res.status(403).send({
  //       error: 'validate error'
  //     })
  //   }
  //   console.log(user)

  //   res.send({
  //     message: "Successfully validate",
  //     user
  //   });
  // });
  console.log(req)
  res.json({
    user: req.user
  });

});

module.exports = router;
