import React, { useState, useEffect } from 'react'
import Layout from './../components/Layout/Layout.js'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import '../styles/ProductDetailsStyles.css'
import '../styles/Homepage.css'
import { useCart } from '../context/cart.js'
import ProductComponent from '../components/ProductComponent.jsx'
import { FaRegStar, FaStar } from 'react-icons/fa'
import RateProduct from '../components/RateProduct.jsx'
import { useAuth } from '../context/auth.js'

const ProductDetails = () => {
  const [auth, setAuth] = useAuth()

  const params = useParams()
  const navigate = useNavigate()
  const [cart, setCart] = useCart()
  const [product, setProduct] = useState({})
  const [relatedProducts, setRelatedProducts] = useState([])
  const [clientToken, setClientToken] = useState('')

  //initalp details
  useEffect(() => {
    if (params?.slug) getProduct()
  }, [params?.slug])
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

  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/get-product/${params.slug}`
      )
      setProduct(data?.product)
      getSimilarProduct(data?.product._id, data?.product.category._id)
    } catch (error) {
      console.log(error)
    }
  }
  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/related-product/${pid}/${cid}`
      )
      setRelatedProducts(data?.products)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Layout>
      <div className='row container mt-2 product-details'>
        <div className='col-md-6'>
          <img
            src={`${process.env.REACT_APP_API}/product-photo/${product._id}`}
            className='card-img-top '
            alt={product.name}
            height={'320 px'}
            width={'300px'}
          />
        </div>
        <div className='col-md-6 '>
          <h1 className='text-center'>Product Details</h1>
          <h6>Name : {product.name}</h6>
          <h6>Description : {product.description}</h6>
          <h6>Price : {product.price}</h6>
          <h6>Category : {product?.category?.name}</h6>
          <button
            className='btn btn-dark ms-1'
            onClick={() => {
              setCart([...cart, product])
              localStorage.setItem('cart', JSON.stringify([...cart, product]))
              toast.success('Item Added to cart')
            }}
          >
            Add To Cart
          </button>
        </div>
      </div>{' '}
      {auth?.token && <RateProduct user={auth?.user} product={product} />}
      <div className='row container'>
        <h6 className='text-center text-success similar'>Similar Items</h6>
        {relatedProducts.length < 1 && (
          <p className='text-center'>No Similar Items found</p>
        )}
        <div className='d-flex flex-wrap'>
          {relatedProducts?.map((p) => (
            <ProductComponent p={p} key={p._id} />
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default ProductDetails
