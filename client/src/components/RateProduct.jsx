import React, { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import axios from 'axios'

const RateProduct = ({ user, product }) => {
  const [currentValue, setCurrentValue] = useState(1)
  const [hoverValue, setHoverValue] = useState(undefined)
  const [prevProducts, setPrevProducts] = useState([])

  const handleClick = (value) => {
    setCurrentValue(value)
  }

  const handleMouseOver = (newHoverValue) => {
    setHoverValue(newHoverValue)
  }

  const handleMouseLeave = () => {
    setHoverValue(undefined)
  }

  const colors = {
    orange: '#FFBA5A',
    grey: '#a9a9a9',
  }

  const stars = Array(5).fill(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const rating = {
      star: currentValue,
      userId: user?.id,
    }
    const { data } = await axios.post(
      `${process.env.REACT_APP_API}/rate-product/${product?._id}`,
      rating
    )

    if (data.success) {
      alert('Thank you for your rating')
    }
  }

  const getmyOrders = async () => {
    const { data: orders } = await axios.get(
      `${process.env.REACT_APP_API}/orders/myorders`
    )
    const extractedProducts = []
    orders.forEach((order) => {
      const orderItemProducts = order.orderItems.map(
        (orderItem) => orderItem.product
      )
      extractedProducts.push(...orderItemProducts)
    })
    setPrevProducts(extractedProducts)
  }

  useEffect(() => {
    getmyOrders()
  }, [])

  return (
    prevProducts.includes(product?._id) &&
    !product?.ratings.some((obj) => obj.postedBy === user?.id) && (
      <div className='my-5 row container'>
        <h2>Rate the product</h2>
        <div className='d-flex'>
          {stars.map((_, index) => (
            <FaStar
              key={index}
              size={24}
              onClick={() => {
                handleClick(index + 1)
              }}
              style={{
                marginRight: 10,
                cursor: 'pointer',
              }}
              onMouseOver={() => handleMouseOver(index + 1)}
              onMouseLeave={handleMouseLeave}
              color={
                (hoverValue || currentValue) > index
                  ? colors.orange
                  : colors.grey
              }
            />
          ))}
        </div>

        <button
          type='submit'
          onClick={handleSubmit}
          className='btn btn-primary ms-3 mt-3 w-auto'
        >
          Submit
        </button>
      </div>
    )
  )
}

export default RateProduct
