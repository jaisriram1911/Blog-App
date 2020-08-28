import Layout from '../../../components/Layout'
import Admin from '../../../components/auth/AdminRoute'
import BlogCreate from '../../../components/crud/BlogCreate'
import Head from 'next/head'
import Private from '../../../components/auth/PrivateRoute'

const Blog = () => {

    const head = () => (
        <Head>
            <title>Connect | Create a new Blog</title>
        </Head>
    )

    return(
        <React.Fragment>
             {head()}
        <Layout>
        <Private>
        <div className='mt-5 container-fluid'>
        <BlogCreate />
        </div>
        </Private>
        </Layout>
        </React.Fragment>

    )
}

export default Blog;
