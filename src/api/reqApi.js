import axios from 'axios';
import { takeUntil } from 'rxjs/operators';

export const res = axios.get(
    'https://search-testdomain-ishym4337emgkq75ryklxvupt4.us-west-2.es.amazonaws.com/docs/_search?pretty=true',
    {
        auth: {
            username: 'theqoos',
            password: '!5rk=Tqoos',
        },
    },
    {
        query: {
            match: {
                title: {
                    query: 'ffv dlfjef df',
                },
            },
        },
    }
);
//main_img.url,title,artists,cp,create_ts,hashtag

const instance = axios.create({
    baseURL:
        'https://search-testdomain-ishym4337emgkq75ryklxvupt4.us-west-2.es.amazonaws.com',
    headers: { 'Content-Type': 'application/json' },
});

export const searchRes = (query) => {
    return instance.post('/_search?pretty=true', query, {
        auth: {
            username: 'theqoos',
            password: '!5rk=Tqoos',
        },
    });
};

export const popularinsertSearchRes = (query) => {
    return instance.post(
        '/search_keyword',
        {
            search_keyword: query,
        },
        {
            auth: {
                username: 'theqoos',
                password: '!5rk=Tqoos',
            },
        }
    );
};
export const popularGetSearchRes = () => {
    return instance.post(
        '/search_keyword/_search?pretty=true',
        {
            size: 0,
            aggs: {
                group_by_state: {
                    terms: {
                        field: 'search_keyword',
                    },
                },
            },
        },
        {
            auth: {
                username: 'theqoos',
                password: '!5rk=Tqoos',
            },
        }
    );
};
