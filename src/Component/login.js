import React, {useEffect, useState} from "react";
import "./join.css";
import {Link, useNavigate} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {fetchApi} from "../utils/api";
import {config} from "../APIHelper/apiUrl";
import {VisibilityOff} from "@mui/icons-material";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

const Login = () => {
    const loginUser=JSON.parse(localStorage.getItem("loginUser"));
    const [user, setUser] = useState({email: '', password: ''});
    const [pass, setPass] = useState({showPassword: false})
    const navigate = useNavigate();
    const handleChange = (e) => {
        let {name, value} = e.target;
        setUser({...user, [name]: value});
    }
    const handleClickShowPassword = () => {
        setPass({...pass, showPassword: !pass.showPassword})
    }

    const {email, password} = user;

    const handleSubmit = async () => {

        if (!email || !password) {
            toast.error('Please enter valid email or password !', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
                return;
        }
        const data = await fetchApi(`${config.ApiUrl}/login`, {
            method: "POST",
            body: JSON.stringify(user)
        })

        if (data) {
            navigate('/');
            localStorage.setItem("loginUser", JSON.stringify(data));
            toast.success('Login Successfully !', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
        }
    }

    useEffect(()=>{
        if (loginUser) {
            navigate('/')
        }
    },[])

    return (
        <div className="joinPage">
            <ToastContainer />
            <div className="joinContainer">
                <h1 style={{color: "white"}}>Login Here</h1>
                <div className="mt-5">
                    <input type="email" value={email} name="email" onChange={(e) => handleChange(e)} id="joinInput"
                           placeholder="Enter your Email"/>
                </div>
                <div className="mt-3">
                        <input type={pass.showPassword ? "text" : "password"} name="password"
                               onChange={(e) => handleChange(e)}
                               id="joinInput" placeholder="Enter password"/>
                        {<IconButton style={{marginLeft:"-40px"}}
                            onClick={handleClickShowPassword}>{pass.showPassword ?
                            <RemoveRedEyeIcon/> : <VisibilityOff/>}</IconButton>}
                </div>
                <div sx={{mt:5}}>
                <Link>
                    <Button variant="contained" className={'mt-3'} onClick={handleSubmit}>sign in</Button>
                    {/*<button type="button" onClick={handleSubmit} className="joinbtn mt-3">Sign in</button>*/}
                </Link>
                </div>
                <div className="mt-3">
                    <p style={{color:"white"}}>Not a member? <Link to="/register">Register</Link></p>
                </div>
            </div>
        </div>
    )
}
export default Login;
