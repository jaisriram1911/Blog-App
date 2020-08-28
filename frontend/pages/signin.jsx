import Head from 'next/head'
import SigninComponent from '../components/auth/SigninComponent'
import {withRouter} from 'next/router'
import Message from '../components/message/Message'

const Signin = ({router}) => {

    const head = () => (
        <Head>
            <title>Connect | Sign In</title>
        </Head>
    )

    const showRedirectMessage = () => {
        
        if(router.query.message) {
            return (
                <Message name={router.query.message} styles='alert-danger' />
            )
        }else {
            return ;
        }
       
    }

    return(
        <React.Fragment>
        {head()}
        {showRedirectMessage()}
            <SigninComponent />
        </React.Fragment>
    )
}

export default withRouter(Signin);