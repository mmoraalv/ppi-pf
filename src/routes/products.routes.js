import { Router } from 'express'
import ProductModel from '../models/products.models.js'

const productRouter = Router()

// Route to get all the products
productRouter.get('/', async (req, res) => {
  const { limit } = req.query

  try {
    const foundProducts = await ProductModel.find().limit(limit)

    res.status(200).send({ result: "OK", message: foundProducts })
  }

  catch (error) {
    res.status(400).send({ error: `Error consulting the products: ${error}` })
  }
})

// Route to get a specif product by ID
productRouter.get('/:pid', async (req, res) => {
  const { pid } = req.params

  try {
    const foundProduct = await ProductModel.findById(pid)

    if (foundProduct)
      res.status(200).send({ result: "OK", message: foundProduct })
    else
      res.status(404).send({ result: "Product Not Found", message: foundProduct })
  }

  catch (error) {
    res.status(400).send({ error: `Error consulting the product: ${error}` })
  }
})

// Route to add a new product
productRouter.post('/', async (req, res) => {
  const { code, title, description, category, team, price, stock } = req.body

  try {
    const addedProduct = await ProductModel.create({
      code, title, description, category, team, price, stock
    })

    res.status(200).send({ result: "OK", message: addedProduct })
  }

  catch (error) {
    res.status(400).send({ error: `Error creating the product: ${error}` })
  }
})

// Route to update a product
productRouter.put('/:pid', async (req, res) => {
  const { pid } = req.params
  const { code, title, description, category, team, price, stock, status } = req.body

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(pid, {
      code, title, description, category, team, price, stock, status
    })

    if (updatedProduct)
      res.status(200).send({ result: "OK", message: updatedProduct })
    else
      res.status(404).send({ result: "Product Not Found", message: updatedProduct })
  }

  catch (error) {
    res.status(400).send({ error: `Error updating the product: ${error}` })
  }
})

// Route to delete a product
productRouter.delete('/:pid', async (req, res) => {
  const { pid } = req.params

  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(pid)

    if (deletedProduct)
      res.status(200).send({ result: "OK", message: deletedProduct })
    else
      res.status(404).send({ result: "Product Not Found", message: deletedProduct })
  }

  catch (error) {
    res.status(400).send({ error: `Error deleting the product: ${error}` })
  }
})

export default productRouter