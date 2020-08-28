import {useState} from 'react'
import Layout from '../../../components/Layout'
import { forgotPassword } from '../../../actions/auth'
import Message from '../../../components/message/Message'

const ForgottenPassword = (req , res) => {
    const [values , setValues] = useState({
        email: '',
        message: '',
        error: '',
        loading: false,
        showForm: true
    })

    const {email , message, error , loading , showForm} = values

    const handleChange = name => e => {
        setValues({...values , message: '' , error: '' , [name]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setValues({...values , error: '' , message: '' , loading: true })
        forgotPassword({email}).then(data => {
            if(data.error){
                setValues({...values , error: data.error , message: '' , loading:false})
            } else {
                setValues({...values , error: '' , message: data.message , showForm: false , loading: false})
            }
        })
    }

    const showFormPage = () => (
        <form onSubmit={handleSubmit} >
            <div className="form-group">
                
                <label className="text-muted">Enter your Email</label>
                <input placeholder="Enter your email" type="email" value={email} onChange={handleChange('email')} className="form-control" />

            </div>
            <div>
                <button type="submit" className="btn btn-primary" >Send Reset Link</button>
            </div>
        </form>
    )

    const showError = () => (
        error ? <Message name={error} styles="alert-danger" /> : ""
    )

    const showLoading = () => (
        loading ? <Message name="Loading" styles="alert-info" /> : ""
    )

    const showMessage = () => (
        message ? <Message name={message} styles="alert-success" /> : ""
    )

    return(
        <React.Fragment>
            {showLoading()}
            {showError()}
            {showMessage()}
        <Layout>
            <div className="container mt-5">
                {showFormPage()}
            </div>
        </Layout>
        </React.Fragment>
    )

}

export default ForgottenPassword;