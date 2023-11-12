import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import "../../styles/AuthStyle.css";
import axios from 'axios';

const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [answer, setAnswer] = useState("");
    const navigate = useNavigate();
    //form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/register`, { name, email, password, phone, address, answer });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong')
        }
    }

    return (
        <Layout title={'Register'}>
            <div className="form-container">

                <form onSubmit={handleSubmit}>
                    <h1 className='title'>Register Now </h1>
                    <div className="mb-3 form-group">

                        <input type="text" value={name} className="form-control" id="exampleInputName" placeholder='Enter Your Name' onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-3 form-group">

                        <input type="email" value={email} className="form-control" id="exampleInputEmail" placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3 form-group">

                        <input type="password" value={password} className="form-control" id="exampleInputPassword" placeholder='Enter your Password' onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="mb-3 form-group">
                        <input type="text" value={phone} className="form-control" id="exampleInputPhone" placeholder='Enter Your Phone' onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="mb-3 form-group">
                        <input type="text" value={address} className="form-control" id="exampleInputAddress" placeholder='Enter Your Address' onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div className="mb-3 form-group">
                        <input type="text" value={answer} className="form-control" id="exampleInputAnswer" placeholder='What is your best Food?' onChange={(e) => setAnswer(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary register">REGISTER</button>
                </form>

            </div>
        </Layout>
    )
}

export default Register