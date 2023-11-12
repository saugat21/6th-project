import React, { useEffect, useState } from 'react'
import '../../src/styles/Homepage.css'
import Layout from '../components/Layout/Layout.js'
import axios from 'axios'
import { Checkbox, Radio } from 'antd'
import { Prices } from '../components/Prices.js'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/cart.js'
import { toast } from 'react-toastify'
import { AiOutlineReload } from 'react-icons/ai'
import bannerImage from '../components/Images/banner.jpg'
import { useAuth } from '../context/auth'
import { FaStar } from 'react-icons/fa'
import Rating from '../components/Rating'
import ProductComponent from '../components/ProductComponent'

const HomePage = () => {
  const [auth] = useAuth()

  const navigate = useNavigate()
  const [cart, setCart] = useCart()
  const [products, setProducts] = useState([])
  const [bannerProducts, setBannerProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [checked, setChecked] = useState([])
  const [radio, setRadio] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  //getting all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/get-category`
      )
      if (data?.success) {
        setCategories(data?.category)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllCategory()
    getTopRatedProductController()
    getTotal()
  }, [])
  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/product-list/${page}`
      )
      setLoading(false)
      setProducts(data.products)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  const getTopRatedProductController = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/get-product/toprated`
      )
      setBannerProducts(data.products)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/product-count`
      )
      setTotal(data?.total)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (page === 1) return
    loadMore()
  }, [page])
  //load more
  const loadMore = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/product-list/${page}`
      )
      setLoading(false)
      setProducts([...products, ...data?.products])
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked]
    if (value) {
      all.push(id)
    } else {
      all = all.filter((c) => c !== id)
    }
    setChecked(all)
  }

  useEffect(() => {
    if (!checked.length && !radio.length) getAllProducts()
  }, [checked.length, radio.length])

  useEffect(() => {
    if (checked.length || radio.length) filterProduct()
  }, [checked, radio])

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/product-filters`,
        {
          checked,
          radio,
        }
      )
      setProducts(data?.products)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout title={'Food Recommendation System'}>
      {/* banner image */}
      <div className='d-flex justify-content-center'>
        {bannerProducts?.map((p) => (
          <ProductComponent p={p} />
        ))}
      </div>
      {/* banner image */}
      <div className='container-fluid row mt-3 home-page'>
        <div className='col-md-3 filters'>
          <h4 className='text-center'>Filter By Category</h4>
          <div className='d-flex flex-column'>
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className='text-center mt-4'>Filter By Price</h4>
          <div className='d-flex flex-column'>
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className='d-flex flex-column'>
            <button
              className='btn btn-danger'
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className='col-md-9 '>
          <h1 className='text-center'>All Products</h1>
          <div className='d-flex flex-wrap'>
            {products?.map((p) => (
              <ProductComponent p={p} />
            ))}
          </div>
          <div className='m-2 p-3'>
            {products && products.length < total && (
              <button
                className='btn loadmore'
                onClick={(e) => {
                  e.preventDefault()
                  setPage(page + 1)
                }}
              >
                {loading ? (
                  'Loading ...'
                ) : (
                  <>
                    {' '}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage
