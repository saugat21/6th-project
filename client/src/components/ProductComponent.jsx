import React from 'react'
import Rating from './Rating'
import { useCart } from '../context/cart'
import { toast } from 'react-toastify'
import { NavLink, useNavigate } from 'react-router-dom'

const ProductComponent = ({ p }) => {
  const navigate = useNavigate()
  const [cart, setCart] = useCart([])

  return (
    <div className='card m-2 w-25' key={p._id}>
      <NavLink to={`/product/${p.slug}`} className='card-img-top'>
        <img
          src={`${process.env.REACT_APP_API}/product-photo/${p._id}`}
          className='card-img-top'
          width={200}
          height={300}
          alt={p.name}
        />
      </NavLink>
      <div className='card-body'>
        <div className='card-name-price'>
          <h5 className='card-title'>{p.name}</h5>
          <h5 className='card-title card-price'>Rs {p.price}</h5>
        </div>
        <p className='card-text'>{p.description.substring(0, 60)}...</p>
        <div className='mb-2'>
          <Rating value={p.averageRating} text={`100 reviwes`} />
        </div>

        <div className='card-name-price'>
          <button
            className='btn btn-info ms-1'
            onClick={() => navigate(`/product/${p.slug}`)}
          >
            More Details
          </button>
          <button
            className='btn btn-dark ms-1'
            onClick={() => {
              setCart([...cart, p])
              localStorage.setItem('cart', JSON.stringify([...cart, p]))
              toast.success('Item Added to cart')
            }}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductComponent
