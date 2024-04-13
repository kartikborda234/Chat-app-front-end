import React, {useEffect, useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {NavLink, useNavigate} from "react-router-dom";
import {fetchApi} from "../utils/api";
import {config} from "../APIHelper/apiUrl";
import IconButton from "@mui/material/IconButton";
import {VisibilityOff} from "@mui/icons-material";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import InputGroup from 'react-bootstrap/InputGroup';


const Register = () => {
    const [user, setUser] = useState({name: '', username: '', email: '', password: '', socketId: ''});
    const [pass, setPass] = useState({showPassword: false})
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (localStorage.getItem("user")) {
    //         navigate("/");
    //     }
    //     socket.on("me", ({id}) => {
    //         setUser({...user, ['socketId']: id})
    //     })
    // }, [socket])

    const handleChange = (e) => {
        let {name, value} = e.target;
        setUser({...user, [name]: value});
    }

    const {name, username, email, password} = user;

    const handleSubmit = async () => {

        if (!name || !username || !email ||!password) {
            toast.error('Please Enter All Fields!', {
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
        
        let data = await fetchApi(`${config.ApiUrl}/register`, {
            method: "POST",
            body: JSON.stringify(user)
        });

        if (data) {
              localStorage.setItem("user", JSON.stringify(data));
              navigate("/login")
              toast.success('Register Successfully !', {
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
        setUser({name: '', username: '', email: '', password: '', socketId: ''})
    }
    const handleClickShowPassword = () => {
        setPass({...pass, showPassword: !pass.showPassword})
    }

    return (
        <React.Fragment>
            <div className="container mt-5 vh-100 d-flex justify-content-center">
                <ToastContainer />
                <form className="register">
                    <h1>Sign up!</h1>
                    <div className="row mb-4 mt-5">
                        <div className="col">
                            <div className="form-outline">
                                <input required type="text" value={name} name="name" onChange={(e) => handleChange(e)}
                                       className="form-control" placeholder="Enter first name"/>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-outline">
                                <input type="text" value={username} name="username" onChange={(e) => handleChange(e)}
                                       placeholder="Enter username" id="form3Example2" className="form-control"/>
                            </div>
                        </div>
                    </div>
                    <div className="form-outline mb-4 mt-3">
                        <input type="email" required name="email" value={email} onChange={(e) => handleChange(e)}
                               placeholder="Enter email address" id="form3Example3" className="form-control"/>
                    </div>
                    <div className="form-outline mb-4">
                        <InputGroup>
                            <input required type={pass.showPassword ? "text" : "password"}
                                   name="password" onChange={(e) => handleChange(e)} id="form3Example4"
                                   className="form-control" placeholder="Enter your password"/>
                            {<IconButton
                                onClick={handleClickShowPassword}>{pass.showPassword ?
                                <RemoveRedEyeIcon/> : <VisibilityOff/>}</IconButton>}
                        </InputGroup>
                    </div>
                    <div className="text-center mt-3">
                        <button type="button" onClick={handleSubmit}
                                className="btn btn-primary btn-block mb-4 w-100">Sign up
                        </button>
                    </div>
                    <div className="text-center">
                        <p>Already Have an Account <NavLink to={"/login"}>Sign in</NavLink></p>
                    </div>
                </form>
            </div>
        </React.Fragment>
    )
}
export default Register;