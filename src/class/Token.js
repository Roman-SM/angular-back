class Token {
  static getToken() {
    const letters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

    const allChars = letters + numbers + symbols
    let token = ''

    for (let i = 0; i < 30; i++) {
      const randomChar =
        allChars[
          Math.floor(Math.random() * allChars.length)
        ]
      token += randomChar
    }

    return token
  }
}

module.exports = {
  Token,
}
