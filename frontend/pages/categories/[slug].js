import Head from 'next/head'
import Layout from '../../components/Layout'
import { singleCategory } from '../../actions/categoryAction'
import Card from '../../components/blog/Card'

const Category = ({category , blogs}) => {

    const head = () => (
        <Head>
            <title>{`Connect | ${category.name}`}</title>
        </Head>
    )

    return(
        <React.Fragment>
        {head()}
            <Layout>
                <main>
                    <div className='container-fluid'>
                        <header>
                            <div className='col-md-12 pt-3'>
                                <h1 className='font-weight-bold'>{category.name}</h1>
                                <hr />
                                {blogs.map((b , i) => 
                                <div>
                                <Card key={i} blog={b} />
                                    <hr />
                                </div>
                                )}
                            </div>
                        </header>
                    </div>
                </main>
            </Layout>
        </React.Fragment>
    )
}

Category.getInitialProps = ({query}) => {
    return singleCategory(query.slug).then(data => {
        if(data.error){
            console.log(data.error);
        } else {
            return {category: data.categories , blogs: data.blogs}


        }
    })
}

export default Category