import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout.js'
import UserMenu from '../../components/Layout/UserMenu.js'
import { useAuth } from '../../context/auth.js'
import axios from 'axios'
import moment from 'moment'
const Orders = () => {
  const [orders, setOrders] = useState([])
  const [auth, setAuth] = useAuth()

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/orders`)
      setOrders(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (auth?.token) getOrders()
  }, [auth?.token])

  return (
    <Layout title={'Your Orders'}>
      <div className='container-flui p-3 m-3 dashboard'>
        <div className='row'>
          <div className='col-md-3'>
            <UserMenu />
          </div>
          <div className='col-md-9'>
            <h1 className='text-center'>All Orders</h1>
            {orders?.map((order, i) => {
              return (
                <div className='border shadow' key={order._id}>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th scope='col'>#</th>
                        <th scope='col'>Status</th>
                        <th scope='col'>Buyer</th>
                        <th scope='col'> date</th>
                        <th scope='col'>Payment</th>
                        <th scope='col'>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>{order?.status}</td>
                        <td>{order?.user?.name}</td>
                        <td>{moment(order?.createAt).fromNow()}</td>
                        <td>{order?.isPaid ? order?.paidAt : 'Not Paid'}</td>
                        <td>{order?.orderItems?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className='container'>
                    {order?.orderItems?.map((item, i) => (
                      <div
                        className='row mb-2 p-3 card flex-row'
                        key={item._id}
                      >
                        <div className='col-md-4'>
                          <img
                            src={`${process.env.REACT_APP_API}/product-photo/${item?.product?._id}`}
                            className=' card-img-top'
                            alt={item?.product?.name}
                            width={'40px'}
                            height={'170px'}
                          />
                        </div>
                        <div className='col-md-8'>
                          <p>{item?.product?.name}</p>
                          <p>{item.qty}</p>
                          <p>Price : {item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Orders
