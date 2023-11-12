import React from 'react'
import { Link, NavLink } from 'react-router-dom'
const AdminMenu = () => {
  return (
    <>
      <div className='text-center'>
        <div className='list-group'>
          <Link to={'/dashboard/admin'} className='mb-3'>
            Admin Panel
          </Link>

          <NavLink
            to='/dashboard/admin/users'
            className='list-group-item list-group-item-action'
          >
            Users
          </NavLink>
          <NavLink
            to='/dashboard/admin/create-category'
            className='list-group-item list-group-item-action '
          >
            Create Category
          </NavLink>
          <NavLink
            to='/dashboard/admin/create-food'
            className='list-group-item list-group-item-action'
          >
            Create Food
          </NavLink>

          <NavLink
            to='/dashboard/admin/orders'
            className='list-group-item list-group-item-action'
          >
            Orders
          </NavLink>

          <NavLink
            to='/dashboard/admin/products'
            className='list-group-item list-group-item-action'
          >
            Products
          </NavLink>
        </div>
      </div>
    </>
  )
}

export default AdminMenu
