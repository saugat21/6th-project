import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/cart.js'
import { toast } from 'react-toastify'

import '../styles/CategoryProductStyles.css'
import axios from 'axios'
import ProductComponent from '../components/ProductComponent'
const CategoryProduct = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [cart, setCart] = useCart()
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState([])

  useEffect(() => {
    if (params?.slug) getPrductsByCat()
  }, [params?.slug])
  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/product-category/${params.slug}`
      )
      setProducts(data?.products)
      setCategory(data?.category)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Layout>
      <div className='container mt-3 category'>
        <h4 className='text-center'>Category - {category?.name}</h4>
        <h6 className='text-center'>{products?.length} result found </h6>
        <div className='d-flex flex-wrap'>
          {products?.map((p) => (
            <ProductComponent p={p} key={p._id} />
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default CategoryProduct
