import Head from 'next/head'
import Layout from '../../components/Layout'
import Card from '../../components/blog/Card'
import { singleTags } from '../../actions/tagAction'

const Tag = ({tag , blogs}) => {

    const head = () => (
        <Head>
            <title>{`Connect | ${tag.name}`}</title>
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
                                <h1 className='font-weight-bold'>{tag.name}</h1>
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

Tag.getInitialProps = ({query}) => {
    return singleTags(query.slug).then(data => {
        if(data.error){
            console.log(data.error);
        } else {
            return {tag: data.tags , blogs: data.blogs}
        }
    })
}

export default Tag