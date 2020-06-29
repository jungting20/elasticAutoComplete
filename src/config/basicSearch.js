import { from, of, merge } from 'rxjs';
import instance from '../api/reqApi';
import {
    withLatestFrom,
    tap,
    catchError,
    map,
    pluck,
    mergeMap,
    delayWhen,
} from 'rxjs/operators';
import * as R from 'ramda';
import { BasicType } from './searchOfType';

export const parseJSONimg = (obj) => {
    try {
        const value = JSON.parse(obj);
        return value;
    } catch (error) {
        console.log('error');
        return obj;
    }
};

export const isjson = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

const BasicSearchObject = {
    url: '/_msearch/template?pretty=true',
    template: (query) =>
        `{"index" : "artists"}\n{"id": "artist_search_template", "params": {"artist_name": "${query}"}}\n{"index" : "featured"}\n{"id": "featured_template"}\n{"index" : "community"}\n{"id": "challenge_search_template", "params": {"community_query": "${query}"}}\n{"index" : "community"}\n{"id": "quiz_search_template", "params": {"community_query": "${query}"}}\n{"index" : "community"}\n{"id": "poll_search_template", "params": {"community_query": "${query}"}}\n{"index" : "community"}\n{"id": "post_search_template", "params": {"community_query": "${query}"}}\n{"index" : "docs"}\n{"id": "docs_search_template", "params": {"docs_query": "${query}"}}\n\n`,
    gethits: (a) => a.hits.hits,
    community_group: (docs) =>
        `${docs._index}${docs._source.type ? '-' + docs._source.type : ''}`,
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

const grouppingdocs = R.groupBy(BasicSearchObject.community_group);

const flatMapAndPartition = R.pipe(
    R.prop('responses'),
    R.map(BasicSearchObject.gethits),
    R.flatten,
    R.partition(R.propEq('_index', 'artists'))
);

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

const getSearchResult$ = (query) => {
    return BasicType(query).pipe(
        delayWhen(insertpoplarSearchRes$),
        mergeMap((query$) =>
            from(
                instance.post(
                    BasicSearchObject.url,
                    BasicSearchObject.template(query$)
                )
            ).pipe(pluck('data'))
        ),
        map(flatMapAndPartition),
        map(([a, b]) => [a, grouppingdocs(b)]),
        withLatestFrom(popularSearchRes$),
        map((a) => ({ type: 'basic', value: a }))
    );
};

export default getSearchResult$;
