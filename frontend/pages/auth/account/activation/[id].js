import { useState , useEffect} from 'react';
import Layout from '../../../../components/Layout';
import jwt from 'jsonwebtoken'
import { withRouter } from 'next/router';
import { signup } from '../../../../actions/auth';
import Message from '../../../../components/message/Message'

const AccountActivation =({router}) => {

    const [values, setValues] = useState({
        name: '',
        token: '',
        error: '',
        message: '',
        loading: false,
        showSignUpButton: true
    });

    const { showSignUpButton, loading , name, token, error, message } = values;

    useEffect(() => {
        let token = router.query.id
        if(token) {
            const {name} = jwt.decode(token)
        setValues({...values , name , token})
        }
        
    } ,[router])

    const handleSubmit = e => {
        e.preventDefault()
        setValues({...values , loading: true})
        signup({token}).then(data => {
            if(data.error){
                setValues({...values , error: data.error , loading: false})
            } else {
                setValues({...values , loading: false , message: data.message , showSignUpButton: false})
            } 
        })
    }

    const showButton = () => {
        return (
            <div>
                <button type="submit" onClick={handleSubmit} className="btn btn-primary">Activate your account</button>
            </div>
        )
    }

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
        {showMessage()}
        {showLoading()}
        {showError()}
        <Layout>
            <div className="container mt-5" style={{alignItems: 'center' , textAlign: 'center'}}>
            <h4 className="mt-5 mb-5">Hi! , {name} Activate Your Account.</h4>
            {showSignUpButton && showButton()}
            </div>
        </Layout>
        </React.Fragment>
    )

}

export default withRouter(AccountActivation)