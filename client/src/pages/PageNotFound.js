import React from 'react'
import Layout from '../components/Layout/Layout'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
    return (
        <Layout title={'Go back! page not found'}>
            <div className="pnf">
                <div className="pnf-title">404</div>
                <h2 className="pnf-heading">Oops! Page Not Found</h2>
                <Link to='/' className='pnf-btn'>
                    Go Back
                </Link>
            </div>
        </Layout>
    )
}

export default PageNotFound