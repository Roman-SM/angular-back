class User {
  static #list = []
  static #count = 1

  constructor(email, password, isConfirm, token) {
    this.id = User.#count++
    this.email = String(email).toLowerCase()
    this.password = String(password)
    this.isConfirm = isConfirm
    this.token = token
  }
  static create(email, password, isConfirm, token) {
    const user = new User(email, password, isConfirm, token)
    this.#list.push(user)
    return user
  }
  static getByEmail(email) {
    return (
      this.#list.find(
        (user) =>
          user.email === String(email).toLowerCase(),
      ) || null
    )
  }
  static getByToken(token) {
    return (
      this.#list.find((user) => user.token === token) ||
      null
    )
  }
  static deleteUser(token) {
    console.log(token)
    const newArr = this.#list.filter(
      (item) => item.token !== token,
    )
    console.log(newArr)
    return (this.#list = newArr)
  }
}

module.exports = {
  User,
}
