import Head from 'next/head'
import SignupComponent from '../components/auth/SignupComponent'

const Signup = () => {

    const head = () => (
        <Head>
            <title>Connect | Sign Up</title>
        </Head>
    )

    return(
        <React.Fragment>
        {head()}
            <SignupComponent />
        </React.Fragment>
    )
}

export default Signup;