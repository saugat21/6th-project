import Order from '../models/orderModel.js'

export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body

    if (orderItems && orderItems.length === 0) {
      res.status(400)
      throw new Error('No order items')
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      })

      await order.save()
      res.status(201).send({
        message: 'Order created successfully',
        success: true,
        order,
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const payOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()

      const updatedOrder = await order.save()
      res.send({ message: 'Order Paid', order: updatedOrder })
    } else {
      res.status(404).send({ message: 'Order not found' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
    res.send(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
