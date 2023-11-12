import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AiFillWarning } from 'react-icons/ai'
import axios from 'axios'
import DropIn from 'braintree-web-drop-in-react'
import '../styles/CartStyles.css'
import Esewa from '../components/Esewa'

const CartPage = () => {
  const [auth, setAuth] = useAuth()
  const [cart, setCart] = useCart()
  const navigate = useNavigate()
  const [clientToken, setClientToken] = useState('')
  const [instance, setInstance] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery')

  //total price
  const totalPrice = () => {
    try {
      let total = 0
      cart?.map((item) => {
        total = total + item.price
      })
      return total
    } catch (error) {
      console.log(error)
    }
  }
  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart]
      let index = myCart.findIndex((item) => item._id === pid)
      myCart.splice(index, 1)
      setCart(myCart)
      localStorage.setItem('cart', JSON.stringify(myCart))
      toast.success('item remove successfully')
    } catch (error) {
      console.log(error)
    }
  }

  //get Payment geteway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/braintree/token`
      )
      setClientToken(data?.clientToken)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getToken()
  }, [auth?.token])

  const handleOrder = async (e) => {
    e.preventDefault()
    if (!auth?.token) {
      toast.error('Please login to create order')
      return
    }
    if (!auth?.user?.address) {
      toast.error('Please update your address')
      return
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    const orderItems = cart.map((item) => {
      return {
        product: item._id,
        qty: 1,
        price: item.price,
      }
    })

    const order = {
      orderItems,
      amount: totalPrice(),
      address: auth?.user?.address,
      user: auth?.user?._id,
      paymentMethod,
    }

    const config = {
      headers: {
        Authorization: `${auth?.token}`,
      },
    }
    const { data } = await axios.post(
      `${process.env.REACT_APP_API}/orders`,
      order,
      config
    )

    if (data.success) {
      toast.success('Order created successfully')
      if (data?.order?.paymentMethod === 'Esewa') {
        Esewa(totalPrice(), data?.order?._id)

        const { data: orderData } = await axios.put(
          `${process.env.REACT_APP_API}/orders/${data?.order?._id}/pay`,
          config
        )
        console.log(orderData)

        if (orderData.success) {
          toast.success('Order paid successfully')
          navigate('/dashboard/user/orders')
        }
      }
      setCart([])
      localStorage.removeItem('cart')
    }
  }

  return (
    <Layout>
      <div className='cart-page'>
        <div className='row'>
          <div className='col-md-12'>
            <h1 className='text-center bg-light p-2 mb-1'>
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className='text-center'>
              {cart?.length
                ? `You Have ${cart.length} items in your cart ${
                    auth?.token ? '' : 'please login to checkout'
                  }`
                : ' Your Cart Is Empty'}
            </h4>
          </div>
        </div>
        <div className='container'>
          <div className='row'>
            <div className='col-md-8'>
              {cart?.map((p) => (
                <div className='row mb-2 p-3 card flex-row'>
                  <div className='col-md-4 '>
                    <img
                      src={`${process.env.REACT_APP_API}/product-photo/${p._id}`}
                      className='card-img-top'
                      alt={p.name}
                      width={'100px'}
                      height={'160px'}
                    />
                  </div>
                  <div className='col-md-8'>
                    <p>{p.name}</p>
                    <p>{p.description.substring(0, 30)}</p>
                    <p>Rs {p.price}</p>
                    <button
                      className='btn btn-danger'
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className='col-md-4 text-center'>
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total : Rs {totalPrice()} </h4>
              {auth?.user?.address ? (
                <>
                  <div className='mb-3'>
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className='btn btn-outline-warning'
                      onClick={() => navigate('/dashboard/user/profile')}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className='mb-3'>
                  {auth?.token ? (
                    <button
                      className='btn btn-outline-warning'
                      onClick={() => navigate('/dashboard/user/profile')}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className='btn btn-outline-warning'
                      onClick={() =>
                        navigate('/login', {
                          state: '/cart',
                        })
                      }
                    >
                      Plase Login to checkout
                    </button>
                  )}
                </div>
              )}

              <form>
                <div>
                  <input
                    type='radio'
                    name='paymentMethod'
                    id='cashondelivery'
                    value={'Cash On Delivery'}
                    checked={paymentMethod === 'Cash On Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor='cashondelivery'>Cash On Delivery</label>
                </div>
                <div>
                  <input
                    type='radio'
                    name='paymentMethod'
                    id='esewa'
                    value={'Esewa'}
                    checked={paymentMethod === 'Esewa'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor='esewa'>Esewa</label>
                </div>
              </form>

              <button className='btn btn-primary mb-3' onClick={handleOrder}>
                Create Order {paymentMethod === 'Esewa' && 'and pay with Esewa'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CartPage
