import Link from 'next/link';
import {useState , useEffect} from 'react';
import Router from 'next/router'
import dynamic from 'next/dynamic';
import {withRouter} from 'next/router';
import {getCookie , isAuth} from '../../actions/auth';
import { getCategories } from '../../actions/categoryAction';
import { getTags } from '../../actions/tagAction'
import { singleBlog , updateBlog } from '../../actions/blogAction';
import {QuillFormats , QuillModules } from '../../helpers/quillHelpers';
import BlogCreate from './BlogCreate';
const ReactQuill = dynamic(() => import('react-quill') , {ssr: false});
import '../../node_modules/react-quill/dist/quill.snow.css';

const BlogUpdate = ({router}) => {

    const [body , setBody] = useState('')
    const [values , setValues ] = useState({
        error: '',
        success: '',
        formData: '',
        title: ''
    })

    const [ checkedCategory , setCheckedCategory ] = useState([])
    const [ checkedTag , setCheckedTag ] = useState([])

    const [categories , setCategories] = useState([])
    const [tags , setTags] = useState([])

    const {error , success , formData , title} = values

    const token = getCookie('token')

    useEffect(() => {
        setValues({...values , formData: new FormData()})
        initBlog();
        initCategories();
        initTags();
    } , [router])

    const initBlog = () => {
        if(router.query.slug){
            singleBlog(router.query.slug).then(data => {
                if(data.error) {
                    console.log(data.error);
                } else {
                    setValues({...values, title: data.title});
                    setBody(data.body)
                    setCategoriesArray(data.categories)
                    setTagsArray(data.tags)
                }
            })
        }
    }

    const setCategoriesArray = blogCategories => {
        let ca = []
        blogCategories.map((c,i)=>{
            ca.push(c._id)
        })
        setCheckedCategory(ca)
    }

    const setTagsArray = blogTags => {
        let ta = []
        blogTags.map((t,i)=>{
            ta.push(t._id)
        })
        setCheckedTag(ta)
    }

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

    const findOutCategories = c => {
        let result = checkedCategory.indexOf(c)
        if(result !== -1) {
            return true
        } else {
            return false
        }
    }

    const findOutTags = t => {
        let result = checkedTag.indexOf(t)
        if(result !== -1){
            return true
        } else {
            return false
        }
    }


    const showCategories = () =>{
        return(
            categories && categories.map((c ,i) => (
                <li key={i} className='list-unstyled'>
                <input checked={findOutCategories(c._id)} onChange={handleToggle(c._id)} type='checkbox' className='mr-2'/>
                <label className='form-check-label'>{c.name}</label>
                </li>
            ))
        )
    }

    const showTags = () => {
        return (
            tags && tags.map((t , i) => (
                <li key={i} className='list-unstyled'>
                    <input checked={findOutTags(t._id)} onChange={handleTagToggle(t._id)} type='checkbox' className='mr-2'/>
                    <label className='form-check-label'>{t.name}</label>
                </li>
            ))
        )
    }

    const handleChange = name => (e) => {
        //console.log(e.target.value);
        const value = name === 'photo' ? e.target.files[0] : e.target.value
        formData.set(name , value)
        setValues({...values , [name]: value , formData , error: '' })
    }

    const handleBody = e => {
        setBody(e)
        formData.set('body' , e)
    }

    const editBody = (e) => {
        e.preventDefault()
        updateBlog(formData , token , router.query.slug).then(data => {
            if(data.error){
                setValues({...values , error: data.error})
            } else {
                setValues({...values , title: '' , success: `Blog Titled '${data.title}' is successfully Created!`})

                if(isAuth() && isAuth().role === 1){
                Router.replace(`/blogs/${router.query.slug}`)
                } else if(isAuth() && isAuth().role === 0) {
                Router.replace(`/blogs/${router.query.slug}`)
                }
            }
        })
    }

    const updateBlogForm = () => {
        return(
            <form onSubmit={editBody}>
                <div className='form-group'>
                    <label className='text-muted'>Title</label>
                    <input type='text' className='form-control' value={title} onChange={handleChange('title')} /> 
                </div>

                <div className='form-group'>
                <ReactQuill modules={QuillModules} formats={QuillFormats} value={body} placeholder='write something ...' onChange={handleBody} />
                </div>
                <div>
                <div className='pt-3'>
            </div>
                    <button type='submit' className='btn btn-primary'>Update</button>
                </div>
            </form>
        )
    }


    return (
        <React.Fragment>
        <div className='container-fluid'>
        
        <div className='row'>
        <div className='col-md-4'>

            <div className='form-group pb-2'>
            <h5>Featured Image</h5>
            <hr />
            <small className='text-muted mr-5'>Max Size : 1mb</small>
            <label className='btn btn-info'>Upload Featured Image
            <input onChange={handleChange('photo')} hidden accept='image/*' type='file' />
            </label>
            </div>

            <div>
            <h5>Categories</h5>
            <hr />
            <ul style={{height: '120px' , overflowY: 'scroll'}}>{showCategories()}</ul>
            </div>

           <div>
           <h5 className='mt-5'>Tags</h5>
            <hr />
            <ul style={{height: '120px' , overflowY: 'scroll'}}>{showTags()}</ul>
           </div>

            </div>

            <div className='col-md-8'>
            <p>create blog form</p>
            {updateBlogForm()}
            <div className='pt-3'>
            </div>
        </div>
        </div>
        </div>
        </React.Fragment>

    )
}

export default withRouter(BlogUpdate)