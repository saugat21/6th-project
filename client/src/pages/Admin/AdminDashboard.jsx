import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { useAuth } from '../../context/auth'
import BarChart from '../../components/Charts/BarChart'
import axios from 'axios'
import { toast } from 'react-toastify'
import PieChart from '../../components/Charts/PieChart'
const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState([])

  const getAnalytics = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/analytics`)
      setAnalytics(data)
    } catch (error) {
      console.log(error)
      toast.error('Someething Went Wrong')
    }
  }

  //lifecycle method
  useEffect(() => {
    getAnalytics()
  }, [])
  const [auth] = useAuth()
  return (
    <Layout>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <div className='card w-75 p-3'>
              <h3>Admin Name: {auth?.user?.name}</h3>
              <h3>Admin Email: {auth?.user?.email}</h3>
              <h3>Admin Phone: {auth?.user?.phone}</h3>
            </div>

            <h2>Charts</h2>

            <div className='d-flex'>
              <BarChart categoryData={analytics?.categoryTotals} />
              <PieChart productData={analytics?.productCountArray} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard
