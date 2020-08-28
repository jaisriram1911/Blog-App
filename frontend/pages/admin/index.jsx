import {useState , useEffect} from 'react'
import Admin from '../../components/auth/AdminRoute'
import {getCookie} from '../../actions/auth'
import { getProfile } from '../../actions/user'
import Link from 'next/link'
import Head from 'next/head'
import { API } from '../../config'
import BlogRead from '../../../frontend/components/crud/BlogRead'

import './adminDashboard.css'

const AdminIndex = () => {

    const head = () => (
        <Head>
            <title>Connect | Admin</title>
        </Head>
    )

    const [user , setUser] = useState({
        name : '',
        username: '',
        email : '',
        about: ''
    })

    const {name , email , username} = user
    
    useEffect(() => {
        userInfo()
    } ,[])

    const token = getCookie('token')

    const userInfo = () => {
        getProfile(token).then(data => {
            if(data.error){
                console.log(data.error);
            }
            setUser({...user , name: data.name , username: data.username , email: data.email})
        })
    }

    return(
        <React.Fragment>
        {head()}
        <Admin>
        <div className='dashboard-page'>
            <div className='dashboard-page_side-bar'>
            <div className='dashboard-page_user-info'>
            <img src={`${API}/user/photo/${username}`} alt={username} />
            <span>
            <h1>{name}</h1>
            <p>{email}</p>
            </span>
            </div>
            <div className='dashboard-page_home-link'>
                <Link href="/"><a><i class="fas fa-home"></i> Home</a></Link>
            </div>
            </div>
            <div className='dashboard-page_main'>
            <div className='dashboard-page_blog-create_box'>
            <h3>{`Hey, ${name} ready to make some creation.`}</h3>
            <Link href="/admin/crud/blog"><a className='btn btn-sm btn-dark'>Create Blog</a></Link>
            </div>
            <div className='dashboard-page_blog-read_box'>
            <BlogRead />
            </div>
            </div>
        </div>
        </Admin>
        </React.Fragment>
    )
}

export default AdminIndex;

{/* <div className='dashboard_page'>
        <div className='dashboard_sideBar'>
        <div className='ml-2 mt-3 dashboard_user_info'>
        <div>
            <img src={`${API}/user/photo/${username}`} alt={username} className='dashboard_user_photo' />
            </div>
            <div className='ml-4 dashboard_user_info_name_email'>
            <h4>{name}</h4>
            <p className='mt-1'>{email}</p>
            </div>
        </div>
        <div className='ml-3 mb-3 dashboard_link_home'>
        <Link href='/'>
            <a><i class="fas fa-home mr-2"></i> Home</a>
        </Link>
        <Link href={`/user/update`}>
            <a><i class="fas fa-pen mr-2"></i> edit</a>
        </Link>
        </div>
        </div>
        <div className='dashboard_main'>
            <div className='dashboard_create_blog'>
            <h1 className='ml-5 dashboard_create_blog_title'>
                Hey, {name} Ready to make Some Awsome Creation...
            </h1>
            <a href='/admin/crud/blog'>
                <button className='ml-5 mt-4 btn btn-light dashboard_button'>Create new blog</button>
            </a>
            </div>
            <div className='dashboard_blog_list'>
                <div className='ml-5 mb-3 pt-4 dashboard_create_blog_title'>
                    <h6 className='dashboard_create_blog_title'>Blog's That where Created By you.</h6>
                </div>
                <div className='dashboard_blog_list_box'>
                <BlogRead />
                </div>
            </div>
        </div>
        </div> */}