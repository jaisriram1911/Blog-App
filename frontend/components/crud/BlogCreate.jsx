import Link from 'next/link';
import {useState , useEffect} from 'react';
import Router from 'next/router'
import dynamic from 'next/dynamic';
import {withRouter} from 'next/router';
import {getCookie , isAuth} from '../../actions/auth';
import { getCategories } from '../../actions/categoryAction';
import { getTags } from '../../actions/tagAction'
import { createBlog } from '../../actions/blogAction';
import { QuillFormats , QuillModules } from '../../helpers/quillHelpers';
import Message from '../message/Message'

import './blogCrud.css'

const ReactQuill = dynamic(() => import('react-quill') , {ssr: false});
import '../../node_modules/react-quill/dist/quill.snow.css';

const BlogCreate = ({router}) => {
    
    const blogFromLS = () =>{
        if(typeof window === 'undefined'){
            return false
        }
        if(localStorage.getItem('blog')){
            return JSON.parse(localStorage.getItem('blog'))
        } else {
            return false
        }
    }
    
    const [ checkedCategory , setCheckedCategory ] = useState([])
    const [ checkedTag , setCheckedTag ] = useState([])
    const [categories , setCategories] = useState([])
    const [tags , setTags] = useState([])
    const [body , setBody] = useState(blogFromLS())
    const [values , setValues ] = useState({
        error: '',
        loading: false,
        sizeError: '',
        success: '',
        formData: '',
        title: '',
        description: '',
        hidePublishButton: false
    })

    const { error ,loading , sizeError , success , formData , title , description , hidePublishButton} = values
    const token = getCookie('token')

    useEffect(() => {
        setValues({...values , formData: new FormData()})
        initCategories()
        initTags()
    } , [router])

    const initCategories = () => {
        getCategories().then(data => {
            if(data.error){
                setCategories({...values , error: data.error})
            } else {
                setCategories(data)
            }
        })
    }

    const initTags = () => {
        getTags().then(data => {
            if(data.error) {
                setTags({...values , error: data.error})
            } else {
                setTags(data)
            }
        })
    }

    const publishBlog = (e) => {
        e.preventDefault()
        createBlog(formData , token).then(data => {
            setValues({...values, loading: true})
            if(data.error){
                setValues({...values , error: data.error})
            } else {
                setValues({...values , loading: false ,title: '' , description: '' , success: `A new Blog titled '${data.title} is Created'`})
                setBody('')
                setCategories([])
                setTags([]);
            }
        })
    }
    const handleChange = name => (e) => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value
        formData.set(name , value)
        setValues({...values , [name]: value , formData , error: '' })
    }

    const handleBody = (e) => {
        setBody(e)
        formData.set('body' , e)
        if(typeof window !== 'undefined'){
            localStorage.setItem('blog' , JSON.stringify(e))
        }
    }

    const handleToggle = (c) => () =>{
        setValues({...values , error:'' })
        const checkListCategory = checkedCategory.indexOf(c)
        const all = [...checkedCategory]
        if(checkListCategory === -1){
            all.push(c)
        } else {
            all.splice(checkListCategory , 1)
        }
        console.log(all);
        setCheckedCategory(all)
        formData.set('categories' , all)
    }

    const showCategories = () =>{
        return(
            categories && categories.map((c ,i) => (
                <li key={i} className='list-unstyled'>
                <input onChange={handleToggle(c._id)} type='checkbox' className='mr-2'/>
                <label className='form-check-label'>{c.name}</label>
                </li>
            ))
        )
    }

    const handleTagToggle = (t) => () => {
        setValues({...values , error: ''})
        const checkListTag = checkedTag.indexOf(t)
        const tagAll = [...checkedTag]
        if(checkListTag === -1){
            tagAll.push(t)
        } else {
            tagAll.splice(checkListTag , 1)
        }
        console.log(tagAll)
        setCheckedTag(tagAll)
        formData.set('tags' , tagAll)
    }

    const showTags = () => {
        return (
            tags && tags.map((t , i) => (
                <li key={i} className='list-unstyled'>
                    <input onChange={handleTagToggle(t._id)} type='checkbox' className='mr-2'/>
                    <label className='form-check-label'>{t.name}</label>
                </li>
            ))
        )
    }

    const showLoading = () => (
        loading && <Message name="loading..." styles="alert-info" />
    )

    const showError = () => (
       error && <Message name={error} styles='alert-danger' />
    )

    const showSuccess = () => (
        success && <Message name={success} styles='alert-success' />
    )

    const createBlogForm = () => {
        return(
            <form onSubmit={publishBlog}>
                <div className='form-group'>
                    <label className='text-muted'>Title</label>
                    <input type='text' placeholder='blog title' className='form-control' value={title} onChange={handleChange('title')} /> 
                </div>
                <div className='form-group'>
                    <label className='text-muted'>Description</label>
                    <textarea type='text' row='10' placeholder='blog description' className='form-control' value={description} onChange={handleChange('description')} /> 
                </div>
                <div className='form-group'>
                <ReactQuill modules={QuillModules} formats={QuillFormats} value={body} placeholder='write something ...' onChange={handleBody} />
                </div>
                <div>
                    <button type='submit' className='btn btn-primary mb-4'>Publish</button>
                </div>
            </form>
        )
    }

    return (
        <React.Fragment>
            {showError()}
            {showSuccess()}
            {showLoading()}
        <div className='container-fluid'>
        <div className='row'>
        <div className='col-md-4'>
            <div className='form-group pb-2'>
            <h5 className='crud-blog-title'>Featured Image</h5>
            <hr />
            <label className='btn btn-info'>Upload Featured Image
            <input onChange={handleChange('photo')} hidden accept='image/*' type='file' />
            </label>
            </div>
            <div>
            <h5 className='crud-blog-title'>Categories</h5>
            <hr />
            <ul style={{height: '120px' , overflowY: 'scroll'}}>{showCategories()}</ul>
            </div>
           <div>
           <h5 className='crud-blog-title mt-5'>Tags</h5>
            <hr />
            <ul style={{height: '120px' , overflowY: 'scroll'}}>{showTags()}</ul>
           </div>
            </div>
            <div className='col-md-8'>
            {createBlogForm()}
        </div>
        </div>
        </div>
        </React.Fragment>
    )
}

export default withRouter(BlogCreate);