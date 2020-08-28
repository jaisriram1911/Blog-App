import { useState , useEffect } from 'react'
import Link from 'next/link'
import { signin , authenticate , isAuth } from '../../actions/auth'
import Router from 'next/router'
import Message from '../message/Message'
import GoogleButton from './GoogleButton'

import './Auth.css'

const SigninComponent = () =>{
    const [values , setvalues] = useState({
        email: 'newuser1@gmail.com',
        password: 'newuser1',
        error: '',
        loading: false,
        message: '',
        showForm: true
    })

    useEffect(() => {
        isAuth() && Router.push(`/`)
    },[])

    const { email , password , error , loading , message , showForm} = values;

    const handleSubmit = (e) =>{
        e.preventDefault();
        setvalues({...values , loading : true , error: false});
        const user = { email , password};
        signin(user).then(data => {
            if(data.error){
                setvalues({...values , error: data.error, loading: false})
            }else {
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

    const handleChange = name => e =>{
        setvalues({...values, error: false, [name] : e.target.value})
    }

    const showLoading = () => (loading ? <Message name='Loading...' styles='alert-info'/> : '')
    const showError = () => (error ? <Message name={error} styles='alert-danger' /> : '' ) 
    const showMessage = () => (message ? <Message name={message} styles='alert-success' /> : '')

    const signinForm = () =>{
        return(
            <form onSubmit={handleSubmit}>
             <h1 className='auth-title'>Connect</h1>
             <p className='auth-description'>Need an account? <Link href='/signup'><a>Sign up</a></Link></p>
             <div className='form-group'>
             <input value={email} onChange={handleChange('email')} type='email' className='form-control auth-input_size' placeholder='Enter your Email'/>
             </div>
             <div className='form-group mb-4'>
             <input value={password} onChange={handleChange('password')} type='password' className='form-control auth-input_size' placeholder='Enter your Password'/>
             </div>
             <Link href='/auth/password/forgot' className='auth_forgot-password'>
             <a className='auth-forgot'>forgot password?</a>
             </Link>
             <div className='mt-4 auth-button'>
             <button className='btn btn-primary auth-blog-button'>SignIn</button>
             <GoogleButton />
             </div>
            </form>
        )
    }

    return (
        <React.Fragment>
        {showError()}
        {showLoading()}
        {showMessage()}
        <div className='container auth-page' >
        {signinForm()}
        </div>
        </React.Fragment>
    )
};

export default SigninComponent;
