import mongoose from 'mongoose'

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: 'users',
    },
    orderItems: [
      {
        product: { type: String, require: true, ref: 'Products' },
        qty: { type: String, require: true },
        price: { type: String, require: true },
      },
    ],
    shippingAddress: {
      houseNumber: {
        type: String,
      },
      streetAddress: {
        type: String,
        require: true,
      },
      city: {
        type: String,
        require: true,
      },
      landmark: {
        type: String,
        require: true,
      },
    },
    paymentMethod: {
      type: String,
      require: true,
    },
    itemsPrice: { type: Number, require: true, default: 0.0 },
    shippingPrice: { type: Number, require: true, default: 0.0 },
    totalPrice: { type: Number, require: true, default: 0.0 },
    isPaid: { type: Boolean, require: true, default: false },
    paymentMethod: { type: String },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, require: true, default: false },
    deliveredAt: { type: Date },
    status: {
      type: String,
      require: true,
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model('Order', orderSchema)
export default Order
