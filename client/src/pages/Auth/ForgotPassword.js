import React from 'react'
import Layout from '../../components/Layout/Layout'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import "../../styles/AuthStyle.css";
import axios from 'axios';


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [answer, setAnswer] = useState("");

    const navigate = useNavigate();


    //form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/forgot-password`, { email, newPassword, answer });
            if (res && res.data.success) {
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
        <Layout title={'forgot-password'}>
            <div className="form-container">

                <form onSubmit={handleSubmit}>
                    <h1 className='title'>RESET PASSWORD</h1>

                    <div className="mb-3 form-group">

                        <input type="email" value={email} className="form-control" id="exampleInputEmail" placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3 form-group">

                        <input type="password" value={newPassword} className="form-control" id="exampleInputPassword" placeholder='Enter your New Password' onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                    <div className="mb-3 form-group">

                        <input type="text" value={answer} className="form-control" id="exampleInputNewPassword" placeholder='Enter your Favourite Food' onChange={(e) => setAnswer(e.target.value)} required />
                    </div>
                    <div className='loginbuttons'>
                        <button type="submit" className="btn btn-primary reset">RESET</button>

                    </div>

                </form>

            </div>
        </Layout>
    )
}

export default ForgotPassword