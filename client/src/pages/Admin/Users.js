import React from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'

const Users = () => {
    return (
        <Layout title={'Dashboard -All users'}>
            <div className="row mt-3">
                <div className="col-md-3">
                    <AdminMenu />
                </div>
                <div className="col-md-9 text-center">
                    <h1>All users</h1>
                </div>
            </div>
        </Layout>
    )
}

export default Users