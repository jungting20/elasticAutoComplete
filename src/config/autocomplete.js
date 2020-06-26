import { from, merge, of } from 'rxjs';
import {
    mergeMap,
    distinctUntilChanged,
    map,
    pluck,
    filter,
    tap,
} from 'rxjs/operators';
import instance from '../api/reqApi';
import * as R from 'ramda';
const makeautoCompletequery = (query) => {
    return {
        query: {
            match: {
                search_keyword: {
                    query,
                },
            },
        },
        highlight: {
            number_of_fragments: 3,
            fragment_size: 150,
            fields: {
                search_keyword: {},
                name: {},
            },
        },
    };
};

const basicmatch = R.test(/^[a-zA-Z]/);
const usermatch = R.test(/^[@]/);
const hashtagmatch = R.test(/^[#]/);

const basicAutoGetter = R.path(['aggregations', 'dedup', 'buckets']);
const userAutoGetter = R.path(['hits', 'hits']);

const basicAuto = R.pipe(
    basicAutoGetter,
    R.map((a) => ({ title: a.key }))
);

const userAuto = R.pipe(
    userAutoGetter,
    R.map((a) => ({ title: `@${a._source.first_name}` }))
);

/* 
export const AUTOCOMPLETEURLBASIC = '/search_keyword/_search?pretty=true';

export const autocompletebasic$ = (query) => {
    return of(query).pipe(
        filter(basicmatch),
        mergeMap((query$) =>
            from(
                instance.post(
                    AUTOCOMPLETEURLBASIC,
                    makeautoCompletequery(query$)
                )
            )
        )
    );
};


 */

export const AUTOCOMPLETEURLBASIC =
    'https://search-testdomain-ishym4337emgkq75ryklxvupt4.us-west-2.es.amazonaws.com/search_keyword/_search/template?pretty=true';

/* aggregations:
dedup:
buckets */

export const autocompletebasic$ = (query) => {
    return of(query).pipe(
        filter(basicmatch),
        mergeMap((query$) =>
            from(
                instance.post(AUTOCOMPLETEURLBASIC, {
                    id: 'autocomplete_template',
                    params: { autocomplete_query: query$ },
                })
            ).pipe(pluck('data'), map(basicAuto))
        )
    );
};

export const AUTOCOMPLETEURLUSER =
    'https://search-testdomain-ishym4337emgkq75ryklxvupt4.us-west-2.es.amazonaws.com/docs_user/_search/template?pretty=true';

export const autocompleteuser$ = (query) => {
    return of(query).pipe(
        filter(usermatch),
        mergeMap((query$) =>
            from(
                instance.post(AUTOCOMPLETEURLUSER, {
                    id: 'user_autocomplete_template',
                    params: { user_autocomplete: query$.replace('@', '') },
                })
            ).pipe(pluck('data'), map(userAuto))
        )
    );
};

export const getAutoWordList = (query) => {
    return merge(autocompletebasic$(query), autocompleteuser$(query));
};
