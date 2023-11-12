import React from 'react'
import Layout from '../components/Layout/Layout.js'
import { useSearch } from '../context/search.js'
import { useCart } from '../context/cart.js';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify'
import '../../src/styles/Homepage.css'

const Search = () => {
    const [values, setValues] = useSearch();
    const [cart, setCart] = useCart();
    const navigate = useNavigate();

    return (
        <Layout title={'Search results'}>
            <div className="container home-page">
                <div className="text-center">
                    <h1 className='mt-3 '>Search Results</h1>
                    <h6 className='text-success text-lg fw-bold'>{values?.results.length < 1 ? 'No Product Found' : `Found ${values?.results.length}`}</h6>
                    <div className="d-flex flex-wrap mt-4">
                        {values?.results.map((p) => (
                            // style = {{ width: "20rem", height: "25rem" }}
                            <div className="card m-2 " key={p._id}>
                                <img
                                    src={`${process.env.REACT_APP_API}/product-photo/${p._id}`}
                                    className="card-img-top images"
                                    alt={p.name}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">
                                        {p.description.substring(0, 30)}...
                                    </p>
                                    <p className="card-text"> Rs {p.price}</p>
                                    <button class="btn btn-primary ms-1" onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                    <button class="btn btn-secondary ms-1 mt-1" onClick={() => {
                                        setCart([...cart, p]);
                                        localStorage.setItem(
                                            "cart",
                                            JSON.stringify([...cart, p])
                                        );
                                        toast.success("Item Added to cart");
                                    }}>ADD TO CART</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Search