import {useState , useEffect} from 'react'
import Private from '../../components/auth/PrivateRoute'
import {getCookie} from '../../actions/auth'
import { getProfile } from '../../actions/user'
import Link from 'next/link'
import Head from 'next/head'
import { API } from '../../config'
import { isAuth } from '../../actions/auth'
import BlogRead from '../../../frontend/components/crud/BlogRead'

import './userDashboard.css'

const AdminIndex = () => {

    let user_name = isAuth() && isAuth().username

    const head = () => (
        <Head>
            <title>Connect | User Dashboard</title>
        </Head>
    )

    const [user , setUser] = useState({
        name : '',
        username: '',
        email : '',
        about: ''
    })

    const {name , email, username} = user
    
    useEffect(() => {
        userInfo()
    } ,[])

    const token = getCookie('token')

    const userInfo = () => {
        getProfile(token).then(data => {
            if(data.error){
                console.log(data.error);
            }
            console.log(data);
            setUser({...user , name: data.name , username: data.username , email: data.email})
        })
    }

    return(
        <React.Fragment>
        {head()}
        <Private>
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
            <BlogRead username={user_name} />
            </div>
            </div>
        </div> 
        </Private>
        </React.Fragment>
    )
}

export default AdminIndex;