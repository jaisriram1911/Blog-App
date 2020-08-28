import Link from 'next/link'
import moment from 'moment'
import {API} from '../../config'
import { smartTrim } from '../../helpers-front/blogHelper'

import './smallCard.css'

const SmallCard = ({blog}) => {

    return(
        <div className='small_card'>
        <div className='small-card_img'>
            <img src={`${API}/blog/photo/${blog.slug}`} alt={blog.title} />
        </div>
        <div className='small-card_right'>
            <Link href={`/blogs/${blog.slug}`}>
                <a className='small-card_title'>{blog.title}</a>
            </Link>
        <p className='small-card_mdesc'>{smartTrim(blog.description , 120 ,  '' , ' ...')}</p>
        <p className='small-card_createdby'><Link href={`/profile/${blog.postedBy.username}`} ><a>{blog.postedBy.name}</a></Link> | {moment(blog.updatedAt).format('ll')}</p>
        </div>
        </div>
    ) 
}

export default SmallCard;