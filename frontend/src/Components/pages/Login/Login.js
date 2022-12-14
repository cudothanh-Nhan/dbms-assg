import Button from "./Button"
import GoogleLogin from 'react-google-login';
import { Link, useHistory } from 'react-router-dom';
import { useState } from "react";
import axios from "axios";


export default function Login({auth, setAuth}) {
    var history = useHistory();
    var userName= "";
    var pwd = "";

    function submitLogin(e) {
        e.preventDefault();
        console.log(userName);
        console.log(pwd);
        setAuth(true);
        localStorage.setItem("userName", userName);
        // axios.post("/user/authenticate", 
        // {
        //     userName: userName,
        //     password: pwd
        // })
        // .then(res => {
        //     localStorage.setItem("userName", userName);
        //     setAuth(true);
        // })
        // .catch(err => {
        //     alert(err);
        // })
    }

    
    return (
        <div className='loginContainer'>
            <form method="post">
                <div className='center'>
                    <p className='headerFont'>Đăng nhập</p>
                </div>
                <div className='mb-3'>                    
                        <label className='labelForm' ><span className='star'>*</span>Tên đăng nhập</label>               
                        <input  type='text' class="form-control"  onChange={(event) => userName = event.target.value} />             
                </div>
                <div className='mb-3'>
                        <label className='labelForm'><span className='star'>*</span>Mật khẩu</label>
                        <input type='password' class="form-control" onChange={(event) => pwd = event.target.value}/>
                </div>
                <div className='center addMargin' onClick={submitLogin}>
                    <button type="submit" class="btn btn-primary" onClick={submitLogin}>Đăng nhập</button>
                </div>
            </form>
            <div className='center addMargin'>
                <p>Quên mật khẩu? <span><Link to='/forgetPass' className='star'>Nhấn tại đây</Link> </span> </p>
            </div>
            <div className='center addMargin'>
                <p>Bạn chưa có tài khoản EasyParking? <span><Link to='/signUp' className='star'>Đăng ký</Link> </span> </p>
            </div>
            <div className='center addMargin'>
                <GoogleLogin buttonText="Đăng nhập với Google" />
            </div>
        </div>
    )
}

