import Head from 'next/head'
import Link from 'next/link'
import {withRouter} from 'next/router'
import Layout from '../components/Layout'
import {useState} from 'react'
import { listBlog } from '../actions/blogAction'
import Card from '../components/blog/Card'
import {DOMAIN} from '../config'

const Blogs = ({blogs , categories , tags , blogLimit , blogSkip , totalBlog , router}) => {

    const head = () => (
        <Head>
            <title>Connect</title>
            <meta name='description' content='Programing Blog by jaisriram' />
            <link rel='canonical' href={`${DOMAIN}${router.pathname}`} />
            <meta property='og:title' content={`Blog App | Latest Web development Blog`} />
            <meta property='og:description' content='Programing Blog by jaisriram' />
            <meta property='og:type' content='website' />
            <meta property='og:url' content={`${DOMAIN}${router.pathname}`}/>
            <meta property='og:image' content={`${DOMAIN}/static/images/blogimage.jpg`} />
            <meta property='og:site_name' content='Blog App' />
            <meta property='og:image:secure_url' content={`${DOMAIN}/static/images/blogimage.jpg`} />
            <meta property='og:image:type' content='image/jpg' />
        </Head>
    )

        const [limit , setLimit] = useState(blogLimit)
        const [ skip , setSkip ] = useState(0)
        const [size , setSize] = useState(totalBlog)
        const [loadedBlog , setLoadedBlog] = useState([])

        const loadMore = () => {
            let toSkip = skip + limit
            listBlog(toSkip , limit).then(data => {
                if(data.error){
                    console.log(data.error);
                } else {
                    setLoadedBlog([...loadedBlog , ...data.blogs])
                    setSize(data.size)
                    setSkip(toSkip)

                }
            })
        }

        const loadButton = () => {
            return(
                size > 0 && size >= limit && (
                    <button onClick={loadMore} className='btn btn-primary'>Load More</button>
                )
            )
        }

        const ShowLoadedBlogs = () => {
            return loadedBlog.map((blog , i) => (
                <article key={i}>
                    <Card blog={blog} />
                    <hr />
                </article>
            ))
        }

    const showAllBlogs = () => {

        return blogs.map((blog , i) => {

           return (
           <article key={i}>
            <Card blog={blog} />
            </article>
            ) 
        })
    }

    const showAllCategories = () => (
        categories.map((c , i) => (
            <Link className='category-nav-items' href={`/categories/${c.slug}`} >
                <a className='btn btn-primary btn-sm mr-1 ml-1 mt-3'>{c.name}</a>
            </Link>
        ))
    )

    return(
        <React.Fragment>
        {head()}
        <Layout>
        <main>
        <div className='container'>
        <header>
            <div className='col-md-12 pt-3'>
            <h1 className='display-5 mt-5 mb-5 font-weight-bold text-center' style={{color: '#363636'}}>
                Programming Blog
                <div>
                    {showAllCategories()}
                </div>
            </h1>
            </div>
        </header>
        </div>
        <div className='container'>
                    {showAllBlogs()}
        </div>
        <div className='container'>
                    {ShowLoadedBlogs()}
        </div>
        <div className='text-center pt-5 pb-5' >
        {loadButton()}
        </div>
        </main>
        </Layout>
        </React.Fragment>
    )
}

Blogs.getInitialProps = () => {
    let limit = 6;
    let skip = 0
    return listBlog(skip , limit).then(data => {
        if(data.error) {
            console.log(data.error);
        } else {
            return {
                blogs: data.blogs,
                categories: data.categories,
                tags: data.tags,
                blogLimit: limit,
                blogSkip: skip,
                totalBlog: data.size
            }            
        }
    })
}

export default withRouter(Blogs)