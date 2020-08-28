import {useState} from 'react'
import Link from 'next/link'
import { contactForm } from '../../actions/form'
import Message from '../message/Message'

import './ContactForm.css'

const ContactForm = ({authorEmail}) => {

    const [values , setValues] = useState({
        name : '' ,
        email : '' ,
        message : '',
        loading: false,
        success: false,
        error: false

    })

    const {name , email, message , loading , error , success} = values

    const handleSubmit = (e) => {
        e.preventDefault()
        setValues({...values , loading: true  })
        contactForm({authorEmail , name , email, message}).then(data => {
            if(data.error) {
                setValues({...values ,error: data.error})
            } else {
                setValues({...values ,success: true , loading: false , name: "" , message: "" , email: "" })
            }
        })
    }

    const handleChange = name => (e) => {
       
        setValues({...values , [name]: e.target.value , error: "" , success: false })
    }

    const showForm = () => {
        return (
            <React.Fragment>
        {showError()}
        {showSuccess()}
        {showLoading()}
            <form onSubmit={handleSubmit} className="form_size mt-5 pb-5">
            <h3 className="form_title mb-5">Contact Form</h3>
            <div className="form-input_flex">
                <div className="form-group">
                <label className="lead">Name</label>
                    <input type="text" placeholder="your name" value={name} onChange={handleChange("name")} required className="form-control form-input_size" />
                </div>

                <div className="form-group ">
                <label className="lead">Email</label>
                    <input type="email" placeholder="your email address" value={email} onChange={handleChange("email")} required className=" form-control form-input_size" />
                </div>
                </div>

                <div className="form-group">
                <label className="lead">Message</label>
                    <textarea type="text" placeholder="your message" value={message} row="10" onChange={handleChange("message")} required className="form-control form_textarea_size" />
                </div>

                <div>
                    <button className="btn btn-primary" >Send Message</button>
                </div>
            </form>
            </React.Fragment>
        )
    }

   const showError = () => (error ? <Message name={error} styles="alert-danger" /> : "" )
   const showSuccess = () => (success ? <Message name="Message has been successfully sent" styles="alert-success" /> : "" )
   const showLoading = () => (loading ? <Message name="Loading..." styles="alert-info" /> : "" )    
    return (
        <React.Fragment>
        {showForm()}
        </React.Fragment>
    )
}

export default ContactForm