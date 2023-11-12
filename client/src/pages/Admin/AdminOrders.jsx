import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Layout from '../../components/Layout/Layout'
import { useAuth } from '../../context/auth'
import moment from 'moment'
import AdminMenu from '../../components/Layout/AdminMenu'
import '../../styles/Homepage.css'
import { Select } from 'antd'
const { Option } = Select

const AdminOrders = () => {
  const [status, setStatus] = useState([
    'Pending',
    'Processing',
    'Shipped',
    'Deliverd',
    'Cancel',
  ])
  const [changeStatus, setCHangeStatus] = useState('')
  const [orders, setOrders] = useState([])
  const [auth, setAuth] = useAuth()
  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/all-orders`
      )
      console.log(data)
      setOrders(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (auth?.token) getOrders()
  }, [auth?.token])

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/order-status/${orderId}`,
        {
          status: value,
        }
      )
      getOrders()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Layout title={'All Orders Data'}>
        <div className='row dashboard'>
          <div className='col-md-3'>
            <AdminMenu />
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
                        <th scope='col'>Date</th>
                        <th scope='col'>Payment</th>
                        <th scope='col'>Payment Method</th>
                        <th scope='col'>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>
                          <Select
                            bordered={false}
                            onChange={(value) => handleChange(order._id, value)}
                            defaultValue={order?.status}
                          >
                            {status.map((stat, i) => (
                              <Option key={i} value={stat}>
                                {stat}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td>{order?.user?.name}</td>
                        <td>{moment(order?.createAt).fromNow()}</td>
                        <td>{order?.isPaid ? order?.paidAt : 'Not Paid'}</td>
                        <td>{order?.paymentMethod}</td>
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
                        <div className='col-md-4 '>
                          <img
                            src={`${process.env.REACT_APP_API}/product-photo/${item?.product._id}`}
                            className='adminorderimg'
                            alt={item.name}
                            // width="100px"
                            // height={"100px"}
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
      </Layout>
    </>
  )
}

export default AdminOrders
