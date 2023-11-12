import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Helmet } from 'react-helmet'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
        <meta name='author' content={author} />

        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: '85vh' }}>{children}</main>
      <Footer />
    </div>
  )
}
Layout.defaultProps = {
  title: 'Food Recommendation System',
  description: 'Food recommendation system',
  keywords: 'pizza,chowmin,food,momo,burger',
  author: 'Saugat baral',
}

export default Layout
