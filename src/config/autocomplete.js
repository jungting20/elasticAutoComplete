import { from, merge, of } from 'rxjs';
import { mergeMap, map, pluck, tap } from 'rxjs/operators';
import instance from '../api/reqApi';
import * as R from 'ramda';
import { BasicType, UserType } from './searchOfType';
import { HashTagSearchObject, getHashTagList$ } from './hashTagSearch';

/* const makeautoCompletequery = (query) => {
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
}; */

const BasicAutoObject = {
    url: '/search_keyword/_search/template?pretty=true',
    template: (query) => ({
        id: 'autocomplete_template',
        params: { autocomplete_query: query },
    }),
    gethits: R.path(['aggregations', 'aggs_keyword', 'buckets']),
};

const UserAutoObject = {
    url: '/docs_user/_search/template?pretty=true',
    template: (query) => ({
        id: 'user_autocomplete_template',
        params: { user_autocomplete: query.replace('@', '') },
    }),
    gethits: R.path(['hits', 'hits']),
};

const basicAuto = R.pipe(
    BasicAutoObject.gethits,
    R.map((a) => ({ title: a.key }))
);

const userAuto = R.pipe(
    UserAutoObject.gethits,
    R.map((a) => ({ title: `@${a._source.first_name}` }))
);

const hashtagAuto = R.map((a) => ({ title: `#${a.key}` }));

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

/* aggregations:
dedup:
buckets */

export const autocompletebasic$ = (query) => {
    return BasicType(query).pipe(
        mergeMap((query$) =>
            from(
                instance.post(
                    BasicAutoObject.url,
                    BasicAutoObject.template(query$)
                )
            ).pipe(pluck('data'), map(basicAuto))
        )
    );
};

export const autocompleteuser$ = (query) => {
    return UserType(query).pipe(
        mergeMap((query$) =>
            from(
                instance.post(
                    UserAutoObject.url,
                    UserAutoObject.template(query$)
                )
            ).pipe(pluck('data'), map(userAuto))
        )
    );
};

export const autocompletehashTag$ = (query) => {
    return getHashTagList$(query).pipe(map(hashtagAuto));
};

export const getAutoWordList = (query) => {
    return merge(
        autocompletebasic$(query),
        autocompleteuser$(query),
        autocompletehashTag$(query)
    );
};
