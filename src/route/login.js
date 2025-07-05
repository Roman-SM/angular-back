// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

const { Confirm } = require('../class/Confirm')
const { Token } = require('../class/Token')
const { Profile } = require('../class/Profile')

router.post('/sign-up', function (req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message:
        'Error: All data must be provided to create a user',
    })
  }

  try {
    const user = Profile.getByEmail(email)
    if (user) {
      return res.status(400).json({
        message:
          'Error: A user with this email is already registered',
      })
    }

    const token = Token.getToken()

    const profileInfo = {
      id: Profile.getList().length + 1,
      email: email,
      password: password,
      isConfirm: false,
      token: token,
      userName: email.split('@')[0],
      avatarUrl: 'assets/images/svg/avatar-playsholder.svg',
      firstName: '',
      lastName: '',
      stack: [],
      city: '',
      isSubscribed: false,
      description: '',
      followers: [],
      following: [],
      postList: [],
    }
    const newUser = Profile.create(profileInfo)

    Confirm.create(newUser.token)

    const code = Confirm.getCode(token)

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

router.post('/sign-up-confirm', function (req, res) {
  const { code, token } = req.body

  if (!code || !token) {
    return res.status(400).json({
      message: 'Error: Required fields are missing',
    })
  }
  try {
    const userByToken = Profile.getByToken(token)
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

    const user = Profile.getByToken(token)

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

router.post('/sign-in', function (req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      message: 'Error: Required fields are missing',
    })
  }

  try {
    const user = Profile.getByEmail(email)
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

    if (!user.isConfirm) {
      Confirm.create(user.token)
    }

    const token = user.token

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
    const token = Profile.getByToken(token)
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

    const token = Profile.getByToken(token)

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

// Експортуємо глобальний роутер
module.exports = router
