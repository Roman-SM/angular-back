class Confirm {
  static #list = []

  constructor(data) {
    this.code = Confirm.generateCode()
    this.data = data
  }
  static generateCode = () =>
    Math.floor(Math.random() * 9000) + 1000

  static create = (data) => {
    this.#list.push(new Confirm(data))
    setTimeout(() => {
      this.delete(code)
    }, 24 * 60 * 60 * 1000)
  }
  static delete = (code) => {
    const length = this.#list
    this.#list = this.#list.filter(
      (item) => item.code !== code,
    )
    return length > this.#list.length
  }
  static getData = (code) => {
    const obj = this.#list.find(
      (item) => item.code === code,
    )
    return obj ? obj.data : null
  }
  static getCode = (email) => {
    const obj = this.#list.find(
      (item) => item.data === email,
    )
    return obj ? obj.code : null
  }
}

module.exports = {
  Confirm,
}
