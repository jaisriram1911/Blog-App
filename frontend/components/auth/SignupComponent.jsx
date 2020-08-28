import { useState , useEffect } from 'react'
import Link from 'next/link'
import {signup , preSignup, isAuth} from '../../actions/auth'
import Router from 'next/router'
import Message from '../message/Message';
import Loading from '../Loading';

const SignupComponent = () =>{
    const [values , setvalues] = useState({
        name:'',
        email: '',
        password: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    })

    useEffect(() => {
        isAuth() && Router.push(`/`);
    },[])

    const {name , email , password , error , loading , message , showForm} = values;

    const handleSubmit = (e) =>{
        e.preventDefault()
        setvalues({...values , loading : true , error: false});
        const user = { name , email , password};

        preSignup(user).then(data => {
            if(data.error){
                setvalues({...values , error: data.error, loading: false})
            }else {
                setvalues({...values , 
                    email: '' , 
                    name: '' , 
                    password: '' , 
                    error: '' ,
                    message: data.message,
                    loading: false , 
                    showForm: false
                })
            }
        })
    }

    const handleChange = name => e =>{
        setvalues({...values, error: false, [name] : e.target.value})
    }

    const loadingSpin = () => (
        <div class="text-center">
  <div class="spinner-border text-light" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
    ) 

    const showLoading = () => (loading ? <Message name={loadingSpin()} styles='alert-info' /> : '')
    const showError = () => (error ? <Message name={error} styles='alert-danger' /> : '')
    const showMessage = () => (message ? <Message name={message} styles='alert-success' /> : '')

    const signupForm = () =>{
        return(
            <form onSubmit={handleSubmit}>
            <h1 className='auth-title'>Connect</h1>
            <p className='auth-description'>Already have an Account? <Link href='/signin'><a>Sign in</a></Link></p>
            <div className='form-group'>
            <input value={name} onChange={handleChange('name')} type='text' className='form-control auth-input_size' placeholder='Enter your Name'/>
            </div>
            <div className='form-group'>
            <input value={email} onChange={handleChange('email')} type='email' className='form-control auth-input_size' placeholder='Enter your Email'/>
            </div>
            <div className='form-group'>
            <input value={password} onChange={handleChange('password')} type='password' className='form-control auth-input_size' placeholder='Enter your Password'/>
            </div>
            <div className='sign-input'>
            <button className='btn btn-primary'>SignUp</button>
            </div>
            </form>
        )
    }

    return (
        <React.Fragment>
        {showError()}
        {showLoading()}
        {showMessage()}
        <div className='container auth-page'>
        {signupForm()}
        </div>
        </React.Fragment>
    )
};

export default SignupComponent;