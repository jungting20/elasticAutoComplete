import { from, of } from 'rxjs';
import instance from '../api/reqApi';
import { catchError, map, pluck } from 'rxjs/operators';

const searchRes = (query) => {
    return instance.post('/_search?pretty=true', query);
};

const popularinsertSearchRes = (query) => {
    return instance.post('/search_keyword/_doc', {
        search_keyword: query,
    });
};
const popularGetSearchRes = () => {
    return instance.post('/search_keyword/_search?pretty=true', {
        size: 0,
        aggs: {
            group_by_state: {
                terms: {
                    field: 'search_keyword.keyword',
                },
            },
        },
    });
};
const partition = (keyfn, array) => {
    return array.reduce(
        (a, b) => {
            if (keyfn(b)) {
                a[0].push(b);
            } else {
                a[1].push(b);
            }
            return a;
        },
        [[], []]
    );
};

const makeSearchObjReal = (query) => {
    return {
        query: {
            bool: {
                should: [
                    {
                        bool: {
                            should: [
                                {
                                    multi_match: {
                                        query,
                                        fields: [
                                            'title^3',
                                            'contents^2',
                                            'artists',
                                        ],
                                    },
                                },
                            ],
                            filter: [
                                {
                                    term: {
                                        _index: 'docs',
                                    },
                                },
                            ],
                        },
                    },
                    {
                        bool: {
                            must: [
                                {
                                    match: {
                                        name: {
                                            query,
                                            boost: 20,
                                        },
                                    },
                                },
                            ],
                            filter: [
                                {
                                    term: {
                                        _index: 'artists',
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    };
};

export const popularSearchRes$ = from(popularGetSearchRes()).pipe(
    pluck('data'),
    map((obj) =>
        obj.aggregations.group_by_state.buckets.filter((a, i) => i <= 4)
    )
);
export const insertpoplarSearchRes$ = (query) =>
    from(popularinsertSearchRes(query)).pipe(
        catchError((error) => {
            return of('error');
        })
    );

export const getSearchResult$ = (query) => {
    return from(searchRes(makeSearchObjReal(query))).pipe(
        pluck('data'),
        map(({ hits }) => hits.hits),
        map((a) => partition((b) => b._index === 'artists', a))
    );
};
