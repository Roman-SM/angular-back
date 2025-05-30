class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.createDate = new Date()
    this.id = Math.trunc(Math.random(1) * 10000000)
  }
  static getList = () => this.#list

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      this.update(product, data)
      return true
    }
    return false
  }
  static update = (
    product,
    { name, price, description },
  ) => {
    if (product) {
      product.name = name
      product.price = price
      product.description = description
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    }
    return false
  }
}
