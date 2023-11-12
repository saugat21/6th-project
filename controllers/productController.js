import productModel from '../models/productModel.js'
import CategoryModel from '../models/CategoryModel.js'
import userModel from '../models/userModel.js'
import slugify from 'slugify'
import orderModel from '../models/orderModel.js'
import braintree from 'braintree'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
})

//creating product
export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields
    const { photo } = req.files
    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: 'name is required' })
      case !description:
        return res.status(500).send({ error: 'description is required' })
      case !price:
        return res.status(500).send({ error: 'price is required' })
      case !category:
        return res.status(500).send({ error: 'category is required' })
      case !quantity:
        return res.status(500).send({ error: 'quantity is required' })
      case photo && photo.size > 9000000:
        return res
          .status(500)
          .send({ error: 'phot is required and should be less than 9mb' })
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) })
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path)
      products.photo.contentType = photo.type
    }
    await products.save()
    res.status(201).send({
      message: 'phot uploaded successfully',
      success: true,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: 'error is creating product',
    })
  }
}

//get all product
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate('category')
      .select('-photo')
      .limit(12)
      .sort({ createdAt: -1 })
    res.status(200).send({
      message: 'getting products successfully',
      countTotal: products.length,
      success: true,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: 'error is getting product',
    })
  }
}

export const getTopRatedProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate('category')
      .sort({ averageRating: -1 })
      .limit(3)

    console.log(products.length)
    res.status(200).send({
      message: 'getting products successfully',
      countTotal: products.length,
      success: true,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: 'error is getting product',
    })
  }
}

//get single products
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select('-photo')
      .populate('category')
    res.status(200).send({
      success: true,
      message: 'Single products Fetched',
      product,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error while getting single products',
      error,
    })
  }
}

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select('photo')
    if (product.photo.data) {
      res.set('Content-Type', product.photo.contentType)
      return res.status(200).send(product.photo.data)
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error while getting photo',
      error,
    })
  }
}
//delete Controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select('-photo')
    res.status(200).send({
      success: true,
      message: ' deleting product Successfully',
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error while deleting product',
      error,
    })
  }
}

//updat product
export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields
    const { photo } = req.files
    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: 'name is required' })
      case !description:
        return res.status(500).send({ error: 'description is required' })
      case !price:
        return res.status(500).send({ error: 'price is required' })
      case !category:
        return res.status(500).send({ error: 'category is required' })
      case !quantity:
        return res.status(500).send({ error: 'quantity is required' })
      case photo && photo.size > 9000000:
        return res
          .status(500)
          .send({ error: 'phot is required and should be less than 9mb' })
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    )
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path)
      products.photo.contentType = photo.type
    }
    await products.save()
    res.status(201).send({
      message: 'product updated successfully',
      success: true,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error while updating product',
      error,
    })
  }
}

//filters product
export const productFiltersContoller = async (req, res) => {
  try {
    const { checked, radio } = req.body
    let args = {}
    if (checked.length > 0) args.category = checked
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
    const products = await productModel.find(args)
    res.status(200).send({
      success: true,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error while Filtering product',
      error,
    })
  }
}

//product count
export const productCoutnController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount()
    res.status(200).send({
      success: true,
      total,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error while Counting product',
      error,
    })
  }
}

// product list based on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6
    const page = req.params.page ? req.params.page : 1
    const products = await productModel
      .find({})
      .select('-photo')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
    res.status(200).send({
      success: true,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error while Counting product',
      error,
    })
  }
}

function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr
  }

  const middle = Math.floor(arr.length / 2)
  const left = arr.slice(0, middle)
  const right = arr.slice(middle)

  return merge(mergeSort(left), mergeSort(right))
}

function merge(left, right) {
  let result = []
  let leftIndex = 0
  let rightIndex = 0

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex].name < right[rightIndex].name) {
      result.push(left[leftIndex])
      leftIndex++
    } else {
      result.push(right[rightIndex])
      rightIndex++
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex))
}

function binarySearch(sortedProducts, keyword) {
  let low = 0
  let high = sortedProducts.length - 1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const currentProduct = sortedProducts[mid]
    const productName = currentProduct.name.toLowerCase()

    if (productName.includes(keyword)) {
      return currentProduct // Found the object with a name similar to the keyword
    } else if (productName < keyword) {
      low = mid + 1 // Search in the right half
    } else {
      high = mid - 1 // Search in the left half
    }
  }

  return null // No matching object found
}

//search product controller
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params
    const products = await productModel.find({}).select('-photo')

    const sortedProducts = mergeSort(products)
    const result = binarySearch(sortedProducts, keyword.toLowerCase())

    if (result === null) {
      return res.status(200).send([])
    }

    res.json([result])
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error while Searching product',
      error,
    })
  }
}

//similar product
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select('-photo')
      .limit(6)
      .populate('category')
    res.status(200).send({
      success: true,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error while getting related product',
      error,
    })
  }
}

//get product wise category
export const productCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug })
    const products = await productModel.find({ category }).populate('category')
    res.status(200).send({
      success: true,
      category,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error while getting  product',
      error,
    })
  }
}

//payment gateway api
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.send(response)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

//payment
export const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body
    let total = 0
    cart.map((i) => {
      total += i.price
    })
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save()
          res.json({ ok: true })
        } else {
          res.status(500).send(error)
        }
      }
    )
  } catch (error) {
    console.log(error)
  }
}

// Rate the product
export const productRateController = async (req, res) => {
  try {
    const { pid } = req.params
    const { star, userId } = req.body
    const product = await productModel.findById(pid)
    const user = await userModel.findById(userId)
    const existingRating = product.ratings.find(
      (i) => i.postedBy.toString() === userId.toString()
    )

    if (existingRating === undefined) {
      product.ratings.push({ star, postedBy: userId })
      let ratings = []
      product.ratings.map((i) => ratings.push(i.star))
      let average =
        ratings.reduce((prev, next) => prev + next, 0) / ratings.length
      product.averageRating = average
      await product.save()
      res.status(200).send({
        success: true,
        message: 'Rating added successfully',
        averageRating: product.averageRating,
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error while Rating product',
      error,
    })
  }
}
