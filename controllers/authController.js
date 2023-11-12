import { comparePassword, hashPassword } from '../helpers/authHelper.js'
import userModel from '../models/userModel.js'
import orderModel from '../models/orderModel.js'
import Jwt from 'jsonwebtoken'

// POST REGISTER
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body
    //validation
    if (!name) {
      return res.send({ message: 'Name is required' })
    }
    if (!password) {
      return res.send({ message: 'password is required' })
    }
    if (!phone) {
      return res.send({ message: 'Phone is required' })
    }
    if (!address) {
      return res.send({ message: 'Address is required' })
    }
    if (!answer) {
      return res.send({ message: 'Answer is required' })
    }
    if (!email) {
      return res.send({ message: 'Email is required' })
    }
    //Check user
    const existingUser = await userModel.findOne({ email })

    //existing users
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: 'Already register please login',
      })
    }
    //register user
    const hashedPassword = await hashPassword(password)
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save()
    res.status(201).send({
      success: true,
      message: 'User Register successfully',
      user,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'error in registration',
    })
  }
}

// POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body
    // validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: 'Invalid email or password',
      })
    }
    //checking user
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Email is not registered',
      })
    }
    //matching password to procced login
    const match = await comparePassword(password, user.password)
    if (!match) {
      return res.status(404).send({
        success: false,
        message: 'Invalid password',
      })
    }
    // token
    const token = await Jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })
    res.status(200).send({
      success: true,
      message: 'Login successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error in login',
      error,
    })
  }
}

//POST FORGOT PASSWORD
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body
    if (!email) {
      res.status(400).send({ message: 'Email is required' })
    }
    if (!answer) {
      res.status(400).send({ message: 'Answer is required' })
    }
    if (!newPassword) {
      res.status(400).send({ message: 'NewPassword is required' })
    }

    //check
    const user = await userModel.findOne({ email, answer })
    //validation
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'Wrong Email or Answer',
      })
    }
    const hashed = await hashPassword(newPassword)
    await userModel.findByIdAndUpdate(user._id, { password: hashed })
    res.status(200).send({
      success: true,
      message: 'Password Reset Successfully',
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'something went wrong',
      error,
    })
  }
}

//test Controller
export const testController = (req, res) => {
  try {
    res.send('protected routes')
  } catch (error) {
    console.log(error)
    res.send({ error })
  }
}

//update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body
    const user = await userModel.findById(req.user._id)
    //password
    if (password && password.length < 6) {
      return res.json({ error: 'Password is required and 6 character long' })
    }
    const hashedPassword = password ? await hashPassword(password) : undefined
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    )
    res.status(200).send({
      success: true,
      message: 'Profile Updated successfully',
      updatedUser,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error while updating profile',
      error,
    })
  }
}

//orders
export const getOrdersController = async (req, res) => {
  console.log(req.user._id)
  try {
    const orders = await orderModel
      .find({ user: req.user._id })
      .populate('user', 'name')
      .populate('orderItems.product')
      .sort({ createdAt: '-1' })
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error WHile Geting Orders',
      error,
    })
  }
}

//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate('user', 'name')
      .populate('orderItems.product')
      .sort({ createdAt: '-1' })
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error WHile Geting Orders',
      error,
    })
  }
}

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    )
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error While Updateing Order',
      error,
    })
  }
}
