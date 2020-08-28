import Link from 'next/link'
import ReactHtmlParser from "react-html-parser" 
import moment from 'moment'
import {API} from '../../config'
import { smartTrim } from '../../helpers-front/blogHelper'

import './Card.css'

const Card = ({blog}) => {

    return(
        <div className='mb-5 card-blog_box' >
        <div>
        <Link href={`/blogs/${blog.slug}`}>
        <img className='card-blog_image-left'  src={`${API}/blog/photo/${blog.slug}`} alt={blog.title} />
        </Link>
        </div>
        <div className='card-blog_content_right' >
            <div>
            <Link href={`/blogs/${blog.slug}`}>
            <h4 className='mb-3 card-blog_title'>{blog.title}</h4>
            </Link>
            <p className='card-blog_excerpt'>{smartTrim(blog.description , 300 ,  '' , ' ...')}</p>
           <p className='card-mobile-description'>{smartTrim(blog.description , 120 ,  '' , ' ...')}</p>
            </div>
            <div className='card-blog-right_bottom_flex'>
            <p className='card-blog_createdBy'>
            <Link href={`/profile/${blog.postedBy.username}`}><a>{blog.postedBy.name}</a></Link> | {moment(blog.updatedAt).format('ll')}
            </p>
            <Link href={`/blogs/${blog.slug}`}>
            <button className='card-mobile_read-more'>Read more</button>
            </Link>
            </div>
        </div>
        </div>
    )
}

export default Card;