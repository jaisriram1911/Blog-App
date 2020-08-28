import {useEffect , useState} from 'react'
import Router from 'next/router'
import {getCookie ,  updateUser} from '../../actions/auth'
import {update , getProfile} from '../../actions/user'
import Message from '../../components/message/Message'
import { API } from '../../config'

import './ProfileUpdate.css'

const ProfileUpdate = () => {

    const [values , setValues] = useState({
        name : '',
        username : '',
        username_for_photo: '',
        about: '',
        password : '',
        error :false,
        success :false,
        loading :false,
        userData : process.browser && new FormData(),
        photo : '',
        email : ''

    })

    const {name , email ,username ,username_for_photo, about , password , error, success, loading , userData , photo} = values;
    const token = getCookie('token')

    const init = () => (
        getProfile(token).then(data =>{
            if(data.error){
                setValues({...values , error: data.error})
            } else {
                setValues({...values ,  username_for_photo: data.username, name: data.name, email: data.email , about: data.about , password: data.password , username: data.username})
            }

        })
    )

    useEffect(() => {
        init()
        setValues({ ...values, userData: new FormData() });
    } ,[])

    const handleSubmit = (e) => {
        e.preventDefault()
        setValues({...values , loading: true})
        update(token , userData).then(data => {
            if(data.error){
                setValues({ ...values, error: data.error, loading: false });
            } else {
                updateUser(data , () => {

                    setValues({...values , 
                        username: data.username,
                        name: data.name, 
                        email: data.email , 
                        about: data.about , 
                        password: '',
                    success:true,
                    loading: false
                    })

                })
                Router.push(`/profile/${username}`)
               
            }
        })
    }

    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        userData.set(name, value);
        console.log(...userData); 
        setValues({ ...values, [name]: value, userData, error: false, success: false });
    };

    const profileForm = () => (
        <form onSubmit={handleSubmit}>

            <div className="form-group">
                <label className="text-muted">User Name</label>
                <input type="text" className="form-control" onChange={handleChange("username")} value={username} />
            </div>

            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" className="form-control" onChange={handleChange("name")} value={name} />
            </div>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input type="email" className="form-control" onChange={handleChange("email")} value={email} />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input type="password" className="form-control" onChange={handleChange("password")} value={password} />
            </div>

            <div className="form-group">
                <label className="text-muted">About</label>
                <textarea type="text" className="form-control" onChange={handleChange("about")} value={about} />
            </div>

            <div>
                <button type="submit" className="btn btn-dark">Submit</button>
            </div>
        </form>
    )

    const showLoading = () => (loading ? <Message name='Loading...'  styles='alert-info'/> : '')
    const showError = () => (error ? <Message name={error} styles='alert-danger' /> : '' ) 
    const showMessage = () => (success ? <Message name='Profile is updated Successfully!' styles='alert-success' /> : '')

    return (
        <React.Fragment>
        {showMessage()}
        {showError()}
        {showLoading()}
        
        <div className='profile-update'>
            
            <div className='profile-update_user-image'>
            <img src={`${API}/user/photo/${username_for_photo}`} alt={username_for_photo} />
            <div className="form-group">
             <label className='btn btn-dark btn-block btn-sm'>Upload Image
            <input onChange={handleChange('photo')} hidden accept='image/*' type='file' />
            </label>
            </div>
            </div>

            <div className='profile-update_user-info'>
            
            {profileForm()}
            </div>
        </div>
        </React.Fragment>
    )
}

export default ProfileUpdate;