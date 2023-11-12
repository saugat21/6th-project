import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { toast } from 'react-toastify'
import { useNavigate, useLocation } from 'react-router-dom';
import "../../styles/AuthStyle.css";
import axios from 'axios';
import { useAuth } from '../../context/auth';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    //form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/login`, { email, password });
            if (res && res.data.success) {
                toast.success(res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                });
                localStorage.setItem('auth', JSON.stringify(res.data));
                navigate(location.state || "/");
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong')
        }
    }

    return (
        <Layout title={'Login'}>
            <div className="form-container">

                <form onSubmit={handleSubmit}>
                    <h1 className='title'>Login Form</h1>

                    <div className="mb-3 form-group">

                        <input type="email" value={email} className="form-control" id="exampleInputEmail" placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3 form-group">

                        <input type="password" value={password} className="form-control" id="exampleInputPassword" placeholder='Enter your Password' onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className='loginbuttons'>
                        <button type="submit" className="btn btn-primary login">LOGIN</button>
                        <button type="button" className="btn btn-primary" onClick={() => { navigate('/forgot-password') }}>FORGET PASSWORD</button>
                    </div>

                </form>

            </div>
        </Layout>
    )
}

export default Login