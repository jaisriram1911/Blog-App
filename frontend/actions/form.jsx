import fetch from 'isomorphic-fetch';
import { API } from '../config';

export const contactForm = (data) => {
    let contactEndPoint;
    if(data.authorEmail) {
        contactEndPoint = `${API}/contact-form-author`
    } else {
        contactEndPoint = `${API}/contact`
    }
    return fetch(`${contactEndPoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
