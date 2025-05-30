// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { Product } = require('../class/Product')

const product1 = {
  name: 'Product 1',
  price: 'price',
  description: 'description',
}
const product2 = {
  name: 'Product 2',
  price: 'price',
  description: 'description',
}
const product3 = {
  name: 'Product 3',
  price: 'price',
  description: 'description',
}
const product4 = {
  name: 'Product 4',
  price: 'price',
  description: 'description',
}

Product.add(product1)
Product.add(product2)
Product.add(product3)
Product.add(product4)

// ================================================================

router.get('/notifications-list', function (req, res) {
  try {
    const products = Product.getList()

    return res.status(200).json({
      products: products.map(
        ({ name, price, description, createDate, id }) => ({
          name,
          price,
          description,
          createDate,
          id,
        }),
      ),
    })
  } catch (e) {
    return res.status(400).json({ message: e.message })
  }
})

// router.get('/product-create', function (req, res) {
//   const productlist = Product.getList()
//   res.render('product-create', {
//     style: 'product-create',
//     data: {
//       list: {
//         productlist,
//         isEmpty: productlist.length === 0,
//       },
//     },
//   })
// })

// router.post('/product-create', function (req, res) {
//   const { name, price, description } = req.body
//   const product = new Product(name, price, description)
//   Product.add(product)
//   console.log(Product.getList())
//   res.render('alert-products', {
//     style: 'alert-products',
//     info: 'Товар створений',
//   })
// })

// router.get('/product-list', function (req, res) {
//   const productlist = Product.getList()
//   res.render('product-list', {
//     style: 'product-list',
//     data: {
//       products: {
//         productlist,
//         isEmpty: productlist.length === 0,
//       },
//     },
//   })
// })

// router.get('/product-edit', function (req, res) {
//   const { id } = req.query

//   const product = Product.getById(Number(id))

//   const productlist = Product.getList()

//   res.render('product-edit', {
//     style: 'product-edit',
//     data: {
//       product,
//       products: {
//         productlist,
//       },
//     },
//   })
// })

// router.post('/product-edit', function (req, res) {
//   const { name, price, description, id } = req.body

//   const result = Product.updateById(Number(id), {
//     name,
//     price,
//     description,
//   })

//   res.render('alert-products', {
//     style: 'alert-products',
//     info: result
//       ? 'Дані товару оновлені'
//       : 'Товар з таким ID не знайдено',
//   })
// })

// router.get('/product-delete', function (req, res) {
//   const { id } = req.query

//   const result = Product.deleteById(Number(id))

//   res.render('alert-products', {
//     style: 'alert-products',
//     info: result
//       ? 'Товар видалено'
//       : 'Товар з таким ID не знайдено',
//   })
// })

// Підключаємо роутер до бек-енду
module.exports = router
