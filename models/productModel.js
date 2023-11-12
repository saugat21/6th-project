import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: 'Category',
    },
    quantity: {
      type: Number,
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      type: Boolean,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
    },
    ratings: {
      type: [
        {
          star: Number,
          postedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'users',
          },
        },
      ],
    },
  },
  { timestamps: true }
)

export default mongoose.model('Products', productSchema)
