import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/Layout'
import {useState, useEffect} from 'react'
import { singleBlog, listRelated } from '../../actions/blogAction'
import {DOMAIN , API} from '../../config'
import ReactHtmlParser from "react-html-parser" 
import moment from 'moment'
import SmallCard from '../../components/blog/smallCard'
import DisqusThread from '../../components/DisqusThread'

import './singleBlog.css'

const SingleBlog = ({ blog , query}) => {

    const [related , setRelated] = useState([])

    const loadRelated = () => {
        listRelated({blog}).then(data => {
            if(data.error){
                console.log(data.error);
            } else{
                setRelated(data)
            }
        })
    }

    const showRelatedBlog = () => {
        return related.map((b,i) => (
                <article key={i}>
                    <SmallCard blog={b} />
                </article>
        ))
    }

    useEffect(() => {
        loadRelated();
    },[])

    const showBlogCategories = blog => (
        blog.categories.map((c , i) => (
            <div className='tags'>
            <Link key={i} href={`/categories/${c.slug}`} >
                <a className='ml-3 mr-1 mt-4'><i class="fas fa-receipt"></i> {c.name}</a>  
            </Link>
            </div>
        ))
    )

    const showBlogTags = blog => (
        blog.tags.map((t , i) => (
            <div className='tags'>
            <Link key={i} href={`/tags/${t.slug}`} >
                <a className='ml-3 mr-1 mt-4'><i class="fas fa-tag"></i> {t.name}</a>  
            </Link>
            </div>
        ))
    )

    const head = () => (
        <Head>
            <title>{`Connect | ${blog.title}`}</title>
            <meta name='description' content={blog.mdesc} />
           <link rel='canonical' href={`${DOMAIN}/blogs/${query.slug}`} />
            <meta property='og:title' content={`Blog App | ${blog.title}`} />
            <meta property='og:description' content={blog.mdesc} />
            <meta property='og:type' content='website' />
            <meta property='og:url' content={`${DOMAIN}/blogs/${query.slug}`}/>
            <meta property='og:image' content={`${API}/blog/photo/${blog.slug}`} />
            <meta property='og:site_name' content='Blog App' />
            <meta property='og:image:secure_url' content={`${API}/blog/photo/${blog.slug}`} />
            <meta property='og:image:type' content='image/jpg' />
        </Head>
    )

    const showComments = () => (
        <div>
            <DisqusThread id={blog.id} title={blog.title} path={`/blog/${blog.slug}`} />
        </div>
    )

    return( 
        <React.Fragment>
        {head()}
            <Layout>
                <main className='single-blog-page_container'>
                    <article>
                        <div className='single-blog-page_image'>
                        <img src={`${API}/blog/photo/${blog.slug}`} alt={blog.title} />
                        </div>
                        <section>
                            <h1 className='single-blog-page_title'>{blog.title}</h1>
                            <p className='lead mt-4 mark single-blog-page_written-by'>
                            Written by <Link href={`/profile/${blog.postedBy.username}`}><a>{blog.postedBy.name}</a></Link> | Published At {moment(blog.updatedAt).format('ll')}
                            </p>
                            <div className='single-blog-page_category-tag'>
                            {showBlogCategories(blog)}
                            {showBlogTags(blog)}
                            </div>
                        </section>
                        <div className='single-blog-page_body'>
                        <section>
                        {ReactHtmlParser(blog.body)}
                        </section>
                        </div>
                        <div className='single-blog-page_related-blog'>
                            <h4>Related Blogs</h4>
                            <hr />
                            {showRelatedBlog()}
                            <hr/>
                        </div>
                        <div>
                        {showComments()}
                        </div>
                    </article>
                </main>
            </Layout>
        </React.Fragment>
    )
}

SingleBlog.getInitialProps = ({query}) => {
    return singleBlog(query.slug).then(data => {
        if(data.error){
            console.log(data.error);
        } else {
            return { blog : data , query};
        }
    })
}

export default SingleBlog