import express from 'express'
import {
  createOrder,
  getMyOrders,
  payOrder,
} from '../controllers/orderController.js'
import { requireSignIn } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/orders').post(requireSignIn, createOrder)
router.route('/orders/:id/pay').put(requireSignIn, payOrder)
router.route('/orders/myorders').get(requireSignIn, getMyOrders)

export default router
