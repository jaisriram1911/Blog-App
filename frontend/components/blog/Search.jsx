import Link from 'next/link'
import ReactHtmlParser from "react-html-parser" 
import {useState , useEffect} from "react"
import { blogSearch } from '../../actions/blogAction'
import Card from "./Card"

const Search = () => {

    const [values , setValues] = useState({
        search: undefined,
        result: [],
        message: "",
        searched: false
    })

    const {search , result , message , searched} = values

    const handleSubmit = e => {
        e.preventDefault()
        blogSearch({ search }).then(data => (
            setValues({...values , result: data , searched: true , message: `${data.length} blogs found`})
        ))
    }

    const handleChange = e => {
        console.log(e);
        setValues({...values , search: e.target.value , searched: false , result: []})
    }

    const searchResult = (result= []) => (
            <div>
            {result.map((blog ,i) => (
                <Card blog={blog} />
            ))}
            </div>

    )

    const searchForm = () => (
        <form  onSubmit={handleSubmit}>
        <div className="search-box">
        <input onChange={handleChange} placeholder="search.." type="text" className="search-input" />
        <button type="submit" className="search-button"><i class="fas fa-search"></i></button>
        </div>
        </form>
    )

    return(
        <div className="container mt-4 mb-5" >
        <div className="mb-5">{searchForm()}</div>
        {searched && <div className="mt-5 mb-5">{searchResult(result)}</div>}
        </div>
    )
}

export default Search;