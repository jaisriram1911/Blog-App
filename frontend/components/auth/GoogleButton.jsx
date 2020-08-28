import { useState , useEffect } from 'react'
import Link from 'next/link'
import { loginWithGoogle , authenticate , isAuth } from '../../actions/auth'
import Router from 'next/router'
import Message from '../message/Message'
import GoogleLogin from 'react-google-login';
import { GOOGLE_CLIENT_ID } from '../../config'

const GoolgeButton = () => {

    const responseGoogle = response => {
        console.log(response);
        const tokenId = response.tokenId
        const user = { tokenId }
        loginWithGoogle(user).then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                authenticate(data , () => {
                    if(isAuth() && isAuth().role === 1){
                        Router.push('/admin');
                    }else{
                        Router.push('/user');
                    }
                });
            }
        })
      }
      
    return (
        <div className="">
            <GoogleLogin
    clientId={`${GOOGLE_CLIENT_ID}`}
    buttonText="Login with google"
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
  />
        </div>
    )
}

export default GoolgeButton