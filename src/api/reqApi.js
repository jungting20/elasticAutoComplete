import axios from 'axios';
/* import { AutoCompleteUrl } from '../config/autocomplete'; */

export const instance = axios.create({
    baseURL:
        'https://search-testdomain-ishym4337emgkq75ryklxvupt4.us-west-2.es.amazonaws.com',
    headers: { 'Content-Type': 'application/json' },
    auth: {
        username: 'theqoos',
        password: '!5rk=Tqoos',
    },
});

export default instance;
