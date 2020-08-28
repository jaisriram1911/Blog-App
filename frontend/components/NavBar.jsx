import { useState, useEffect } from 'react'
import Link from 'next/link'
import { signout , isAuth } from '../actions/auth'
import Router from 'next/router'
import NProgress from 'nprogress';
import { getCookie } from '../actions/auth'
import {getProfile} from '../actions/user'
import '.././node_modules/nprogress/nprogress.css'
import {API} from '../config'

import './NavBar.css'

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

const NavBar = () => {

  const [user , setUser] = useState({
    name : '',
    email : '',
    username : '',
    photo: ''
  })

  const {name , email , username , photo} = user
  const token = getCookie("token")

  const init = () => {
    getProfile(token).then(data => {
      if(data.error) {
        console.log(data.error);
      } else {
        console.log(data);
        setUser({...user , name : data.name , email : data.email , username : data.username , photo: data.photo})
      }
    })
  }
  
  useEffect(() => {
    {isAuth() && init() }
  }, []);

  const showPhoto = () => {
    if(photo) {
        return(
            <div>
            <img className="navbar_user-photo" src={`${API}/user/photo/${username}`} alt={username} />
            </div>
        )
    } else {
        return(
            <button className='navbar_user-no-photo'><i class="fas fa-user"></i></button>
         )
    }
}

  return (
    <React.Fragment>
    <nav>
      
        <Link href="/"><h6 className='logo test-logo'>Connect</h6></Link>
      
      <div className=''>
      <Link href="/search/search-page"><a className='mr-5' style={{color: '#363636'}}><i class="fas fa-search"></i></a></Link>
      
      <div className='dropdown'>
      <span className="nav-dropdown">{showPhoto()}</span>
      <ul className="dropdown-content">
      <li className="">
          <Link href={`/profile/${username}`}><a>Profile</a></Link> 
        {!isAuth() && (<hr />)}
        </li>
        {isAuth() && (
          <li>
            <Link href={`/user/update`} ><a className=''>Edit Profile</a></Link>
            <hr />
            </li>
          )}
          <li  className="">
          <Link href="/form"><a>contact</a></Link>
        </li>
        <li className="">
          <a href='/admin/crud/blog'>Create Blog</a>
        </li>
        { isAuth() && isAuth().role === 0 && (<li>
          <Link href="/user"><a>Dashboard</a></Link>
          <hr />
        </li>)
        }
        {isAuth() && isAuth().role === 1 && (
          <li>
            <Link href="/admin"><a>Admin</a></Link>
            <hr />
          </li>
        )}
        {!isAuth() && (
          <React.Fragment>
          <li className="">
          {!isAuth() && (
            <hr />
          )}
        <a href='/signin'>sign in</a>
        </li>
        <li>
        <a href='/signup'>sign up</a>
        </li>
          </React.Fragment>
        )}
        {isAuth() && (
          <li>
            <Link href='/'><a onClick={() => signout(Router.replace(`/`))}>Sign Out</a></Link>
          </li>
        )}
      </ul>
      </div>
      </div>
    </nav>
    </React.Fragment>
  );
}

export default NavBar;