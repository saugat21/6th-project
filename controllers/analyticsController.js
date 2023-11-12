import Order from '../models/orderModel.js'
import productModel from '../models/productModel.js'

export const getAnalytics = async (req, res) => {
  try {
    const products = await productModel.find({}).populate('category')

    const categoryCounts = {}

    if (!products) {
      return res.status(404).json({ message: 'Products not found' })
    }
    products.forEach((item) => {
      const categoryName = item.category.name
      if (categoryCounts[categoryName]) {
        categoryCounts[categoryName]++
      } else {
        categoryCounts[categoryName] = 1
      }
    })
    const categoryTotals = Object.keys(categoryCounts).map((categoryName) => ({
      category: categoryName,
      productCount: categoryCounts[categoryName],
    }))

    const orders = await Order.find({}).populate('orderItems.product')

    const orderItems = []

    orderItems.push(...orders.map((order) => order.orderItems))

    const allOrderItems = [].concat(...orderItems)

    const productCounts = {}
    allOrderItems.forEach((orderItem) => {
      const productId = orderItem.product._id
      const productName = orderItem.product.name

      if (!productCounts[productId]) {
        productCounts[productId] = {
          _id: productId,
          name: productName,
          count: 1,
        }
      } else {
        productCounts[productId].count++
      }
    })

    // Convert the productCounts object to an array
    const productCountArray = Object.values(productCounts)

    res.json({ categoryTotals, productCountArray })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message })
  }
}
