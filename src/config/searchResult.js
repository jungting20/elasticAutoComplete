import { from, of } from 'rxjs';
import instance from '../api/reqApi';
import { tap, catchError, map, pluck, mergeMap, toArray } from 'rxjs/operators';
import { groupBy } from 'ramda';
const searchRes = (query) => {
    return instance.post('/_msearch/template?pretty=true', query);
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
const grouppingdocs = groupBy(
    (a) => `${a._index}${a._source.type ? '-' + a._source.type : ''}`
);

const flatten = (array) => array.reduce((a, b) => a.concat(...b), []);

const makeSearchTemplate = (query) =>
    `{"index" : "artists"}\n{"id": "artist_search_template", "params": {"artist_name": "${query}"}}\n{"index" : "community"}\n{"id": "challenge_search_template", "params": {"community_query": "${query}"}}\n{"index" : "community"}\n{"id": "quiz_search_template", "params": {"community_query": "${query}"}}\n{"index" : "community"}\n{"id": "poll_search_template", "params": {"community_query": "${query}"}}\n{"index" : "community"}\n{"id": "post_search_template", "params": {"community_query": "${query}"}}\n{"index" : "docs"}\n{"id": "docs_search_template", "params": {"docs_query": "${query}"}}\n\n`;

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
    return from(searchRes(makeSearchTemplate(query))).pipe(
        map((a) => a.data.responses),
        mergeMap((a) => from(a).pipe(map(({ hits }) => hits.hits))),
        toArray(),
        map(flatten),
        tap(console.log),
        map((a) => partition((b) => b._index === 'artists', a)),
        map(([a, b]) => [a, grouppingdocs(b)])
    );
};
