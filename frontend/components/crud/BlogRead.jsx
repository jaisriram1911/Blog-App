import Link from 'next/link';
import {useState , useEffect} from 'react';
import {getCookie , isAuth} from '../../actions/auth';
import { list , removeBlog } from '../../actions/blogAction';
import moment from 'moment'

import './BlogRead.css'

const BlogRead = ({username}) => {

    const [blogs , setBlogs] = useState([])
    const [message , setMessage] = useState('')
    const token = getCookie('token')

    useEffect(() => {
        loadBlogs()
    },[])

    const loadBlogs = () => {
        list(username).then(data => {
            if(data.error){
                console.log(data.error);
            } else {
                setBlogs(data)
            }
        })
    }

    const deleteBlog = (slug) => {
        removeBlog(slug , token).then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                setMessage(data.message)
                loadBlogs()
            }
        })
    }

    const handleDelete =( slug ) => {
        let answer = window.confirm('Are you sure that you want to delete your Blog?')
        
        if(answer){
            deleteBlog(slug)
        }
    }

    const showBlogs = () => {
        return blogs.map((blog , i) => {
            return(
                <div key={i} className='blog_read_box'>
                <Link href={`/blogs/${blog.slug}`} ><a><h5 className='mb-3' style={{cursor: 'pointer'}}>{blog.title}</h5></a></Link>
                <div className='blog_read_created_by-flex'>
                <p className='blog_read_written_by' > Written By <Link href={`/`}><a>{blog.postedBy.name}</a></Link> | {moment(blog.updatedAt).format("ll")}</p>
                <div className='blog_read_ud-flex' >
                <h6 style={{cursor: 'pointer'}} onClick={() => handleDelete(blog.slug)} ><i class="fas fa-trash-alt"></i> Delete</h6>
                {showUpdateButton(blog)}
                </div>
                </div>
                </div>
            )
        }) 
    }

    const showUpdateButton = (blog) => {
        if(isAuth() && isAuth().role === 0){
            return (
                <a style={{cursor: 'pointer'}} href={`/user/crud/${blog.slug}`} >
                <h6 className="ml-3"><i class="fas fa-pen"></i> Update</h6>
                </a>
            )
        }

        else if(isAuth() && isAuth().role === 1) {
            return(
                <Link  href={`/admin/crud/${blog.slug}`} >
                    <h6 style={{cursor: 'pointer'}}  className='ml-3'><i class="fas fa-pen"></i> Update</h6>
                </Link>
            ) 
        }
    }

    return(
        <React.Fragment>
            {message && <div className='alert alert-warning'>{message}</div>}
            {showBlogs()}
        </React.Fragment>
    )
}

export default BlogRead