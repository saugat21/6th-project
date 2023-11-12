import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout.js'
import { Link } from "react-router-dom";
import useCategory from '../components/Hooks/useCategory.js'
const Categories = () => {
    const categories = useCategory();
    return (
        <Layout title={'All-Categoris'}>
            <div className="container">
                <div className=" d-flex ">
                    {categories.map((c) => (
                        <div className="col-md-6 mt-4 mb-5 " key={c._id}>
                            <Link to={`/category/${c.slug}`} className="btn btn-warning">
                                {c.name}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default Categories