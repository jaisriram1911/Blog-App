import fetch from 'isomorphic-fetch';
import { API } from '../config';
import queryString from 'query-string'
import { isAuth , handleResponse } from './auth'

export const createBlog = (blog , token) => {
    let createBlog;
    if(isAuth() && isAuth().role === 1) {
        createBlog = `${API}/blog`
    } else if(isAuth() && isAuth().role === 0) {
        createBlog = `${API}/user/blog`
    }
    return fetch(`${createBlog}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization : `Bearer ${token}`
        },
        body: blog
    })
        .then(response => {
            handleResponse(response)
            return response.json();
        })
        .catch(err => console.log(err));
};

export const listBlog = (skip , limit) => {
    const data = {
        limit , skip
    }
    return fetch(`${API}/blogs-categories-tags` , {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        
    }).then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}

export const singleBlog = slug => {
    return fetch(`${API}/blog/${slug}` , {
        method: 'GET'
    })
    .then(response => {
        return response.json();
    })
    .catch( err => console.log(err))
}

export const listRelated = (blog) => {
    return fetch(`${API}/blogs/related` , {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blog)
        
    }).then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}

export const list = (username) => {
    let listBlogs = username
    if(username) {
        listBlogs = `${API}/${username}/blogs`
    } else {
        listBlogs = `${API}/blogs`
    }
    return fetch(`${listBlogs}` , {
        method: 'GET'
    })
    .then(response => {
        return response.json();
    })
    .catch( err => console.log(err))
}

export const removeBlog = (slug , token) => {
    let removeBlogBasedOnRole;
    if(isAuth() && isAuth().role === 1) {
        removeBlogBasedOnRole = `${API}/blog/${slug}`
    } else if(isAuth() && isAuth().role === 0) {
        removeBlogBasedOnRole = `${API}/user/blog/${slug}`
    }
    return fetch(`${removeBlogBasedOnRole}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization : `Bearer ${token}`
        }
    })
        .then(response => {
            handleResponse(response)
            return response.json();
        })
        .catch(err => console.log(err));
};

export const updateBlog = (blog , token , slug) => {
    let UpdateBlogBasedOnRole;
    if(isAuth() && isAuth().role === 1) {
        UpdateBlogBasedOnRole = `${API}/blog/${slug}`
    } else if(isAuth() && isAuth().role === 0) {
        UpdateBlogBasedOnRole = `${API}/user/blog/${slug}`
    }
    return fetch(`${UpdateBlogBasedOnRole}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization : `Bearer ${token}`
        },
        body: blog
    })
        .then(response => {
            handleResponse(response)
            return response.json();
        })
        .catch(err => console.log(err));
};

export const blogSearch = (params) => {
    let query = queryString.stringify(params)
    return fetch(`${API}/blogs/search?${query}` , {
        method: 'GET'
    })
    .then(response => {
        return response.json();
    })
    .catch( err => console.log(err))
}