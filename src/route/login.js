// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

const { User } = require('../class/User')
const { Confirm } = require('../class/Confirm')
const { Token } = require('../class/Token')
const { Profile } = require('../class/Profile')

const users = {
  user1: {
    email: 'user@mail.com',
    password: '123QWEqwe',
    isConfirm: true,
    token: 'xwZnju]U]MRq:L3(a$zSDnoPOs?8C6',
  },
  user2: {
    email: 'admin@mail.com',
    password: '123QWEqwe',
    isConfirm: true,
    token: 'dUPPVaR[t_jyjKfWn_ejqshOz;g:K_',
  },
  user3: {
    email: 'developer@mail.com',
    password: '123QWEqwe',
    isConfirm: true,
    token: 'ovKtzq2*JIzjv$H}lD>Ng{m{iFzx(N',
  },
}

User.create(
  users.user1.email,
  users.user1.password,
  users.user1.isConfirm,
  users.user1.token,
)
User.create(
  users.user2.email,
  users.user2.password,
  users.user2.isConfirm,
  users.user2.token,
)
User.create(
  users.user3.email,
  users.user3.password,
  users.user3.isConfirm,
  users.user3.token,
)

router.post('/signup', function (req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      message:
        'Error: All data must be provided to create a user',
    })
  }

  try {
    const user = User.getByEmail(email)
    if (user) {
      return res.status(400).json({
        message:
          'Error: A user with this email is already registered',
      })
    }

    const isConfirm = false

    const token = Token.getToken()

    const newUser = User.create(
      email,
      password,
      isConfirm,
      token,
    )

    Confirm.create(newUser.token)

    const code = Confirm.getCode(token)

    console.log(code)

    return res.status(200).json({
      message: 'User registered successfully',
      token,
      code,
    })
  } catch (e) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body

  if (!code || !token) {
    return res.status(400).json({
      message: 'Error: Required fields are missing',
    })
  }
  try {
    const userByToken = User.getByToken(token)
    if (!userByToken) {
      return res.status(400).json({
        message: 'Error: You are not logged in',
      })
    }
    const confirmCode = Confirm.getData(code.code)

    if (!confirmCode) {
      return res.status(400).json({
        message: 'Error: Code does not exist',
      })
    }

    const user = User.getByToken(token)

    user.isConfirm = true

    return res.status(200).json({
      message: 'Email confirmed successfully',
      token,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/signin', function (req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Error: Required fields are missing',
    })
  }

  try {
    const user = User.getByEmail(email)
    if (!user) {
      return res.status(400).json({
        message:
          'Error: A user with this email does not exist',
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Error: Incorrect password',
      })
    }

    // const token = Token.getToken()

    // user.token = token

    const token = user.token

    // console.log(token)

    if (!user.isConfirm) {
      Confirm.create(user.token)
    }

    const code = Confirm.getCode(token)

    return res.status(200).json({
      message: 'You have logged in',
      token,
      code,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/recovery', function (req, res) {
  const { email, token } = req.body

  if (!email || !token) {
    return res.status(400).json({
      message: 'Error: Required fields are missing',
    })
  }

  try {
    const token = User.getByToken(token)
    if (!token) {
      return res.status(400).json({
        message:
          'Error: A user with this email does not exist',
      })
    }

    Confirm.create(token)

    const code = Confirm.getCode(token)

    return res.status(200).json({
      message: 'Password recovery code has been sent',
      code,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/recovery-confirm', function (req, res) {
  const { password, code, token } = req.body

  if (!code || !password || !token) {
    return res.status(400).json({
      message: 'Error: Required fields are missing',
    })
  }

  try {
    const user = Confirm.getData(Number(code))
    if (!user) {
      return res.status(400).json({
        message: 'Error: Code does not exist',
      })
    }

    const token = User.getByToken(token)

    if (!token) {
      return res.status(400).json({
        message:
          'Error: A user with this token does not exist',
      })
    }
    token.password = password

    return res.status(200).json({
      message: 'Password successfully recovered',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/recovery-email', function (req, res) {
  const { token, password, newEmail } = req.body

  if (!password || !newEmail) {
    return res.status(400).json({
      message: 'Error: Required fields are missing',
    })
  }

  try {
    const user = User.getByToken(token)

    if (!user) {
      return res.status(400).json({
        message:
          'Error: A user with this email does not exist',
      })
    }

    if (user.email !== email) {
      return res.status(400).json({
        message: 'Error: Incorrect password',
      })
    }

    user.email = newEmail
    user.isConfirm = true

    return res.status(200).json({
      message: 'Email changed successfully',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/recovery-password', function (req, res) {
  const { oldPassword, newPassword, token } = req.body

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      message: 'Error: Required fields are missing',
    })
  }

  try {
    const user = User.getByToken(token)

    if (!user) {
      return res.status(400).json({
        message:
          'Error: A user with this email does not exist',
      })
    }

    if (user.password !== oldPassword) {
      return res.status(400).json({
        message: 'Error: Incorrect password',
      })
    }

    user.password = newPassword
    user.isConfirm = true

    return res.status(200).json({
      message: 'Password successfully changed',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// Експортуємо глобальний роутер
module.exports = router
