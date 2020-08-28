import Head from 'next/head'
import Link from 'next/link'
import ReactHtmlParser from "react-html-parser" 
import { userPublicProfile } from '../../actions/user'
import {DOMAIN , API} from '../../config'

import './profile.css'

const userProfile = ({user , blogs , query}) => {

    const head = () => (
        <Head>
            <title>{`Connect | ${user.name}`}</title>
            <meta name='description' content={`Blogs by ${query.username}`} />
            <link rel='canonical' href={`${DOMAIN}/profile/${query.username}`} />
            <meta property='og:title' content={`Blog App | ${user.name}`} />
            <meta property='og:description' content={`Blogs by ${query.username}`} />
            <meta property='og:type' content='website' />
            <meta property='og:url' content={`${DOMAIN}/profile/${query.username}`}/>
            <meta property='og:image' content={`${DOMAIN}/static/images/blogimage.jpg`} />
            <meta property='og:site_name' content='Blog App' />
            <meta property='og:image:secure_url' content={`${DOMAIN}/static/images/blogimage.jpg`} />
            <meta property='og:image:type' content='image/jpg' />
        </Head>
    )

    const showBlogs = () =>  {
        return blogs.map((blog, i) => {
            return (
                <div className="profile-page_card mb-5" key={i} >
                    <img className="profile-page_card-blog-photo" src={`${API}/blog/photo/${blog.slug}`} alt={blog.slug} />
                    <div className="ml-5 profile-page_card-blog">
                        <div>
                        <h6 className="profile-page_card-blog-title">{blog.title}</h6>
                        <p className="profile-page_card-blog-para">{ReactHtmlParser(blog.mdesc)}...</p>
                        </div>
                        <div>
                        <Link href={`/blogs/${blog.slug}`}>
                            <a className="btn btn-dark btn-sm" >Read more</a>
                        </Link>
                        </div>
                    </div>
                </div>
            );
        });
    };

    const showPhoto = () => {
        if(user.photo) {
            return(
                <div>
                <img className="profile-user_photo image-test mt-5 mb-3" src={`${API}/user/photo/${query.username}`} alt={query.username} />
                </div>
            )
        } else {
            return(
                <div className='profile-user_no-photo mt-5 mb-3'><i class="fas fa-4x fa-user"></i></div>
             )
        }
    }

    const showAbout = () => {
        if(user.about){
            return(
            <p className="profile-page_user-about">{user.about}</p>

            )
        } else {
            return(
            <p className="mt-5 profile-page_user-about">no about</p>

            )
        }
    }

    return(
        <React.Fragment>
        {head()}
            <div className='profile-page' >
                <div className='profile-page_left-box' >
                        <a href='/' style={{color: '#363636' , textDecoration: "none" }}><i class="fas fa-2x fa-long-arrow-alt-left"></i></a>

                    {showPhoto()}
                    <div className="profile-name-flex">
                    <h1 className='profile-page_user-name'>{user.name} <a style={{color: '#363636'}} href='/user/update' className='ml-4'><i class="fas fa-pen"></i></a></h1>
                    
                    {showAbout()}
                    </div>
                    
                </div>
                <div className='profile-page_right-box' >
                <h4 className='mt-1 profile-page_blog-box-title'>Blogs created by {user.name}</h4>
                <div className='mt-5 profile-page_blog-list'>
                {showBlogs()}
                </div>
                </div>
            </div>
        </React.Fragment>
    )
}

userProfile.getInitialProps = ({query}) => {
    return userPublicProfile(query.username).then(data => {
        if(data.error) {
            console.log(data.error);
        } else {
            return {user: data.user , blogs: data.blogs , query}
        }
    })
}

export default userProfile