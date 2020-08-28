import Layout from '../components/Layout'
import Head from 'next/head'
import ContactForm from '../components/form/ContactForm'

const Contact = () => {
    
    const head = () => (
        <Head>
            <title>Connect | Contact</title>
        </Head>
    )

    return(
        <React.Fragment>
        {head()}
        <Layout>
        <div className="container mt-5">
                <ContactForm />
        </div>
        </Layout>
        </React.Fragment>
    )
}

export default Contact;