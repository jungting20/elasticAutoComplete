import { from, of, merge } from 'rxjs';
import instance from '../api/reqApi';
import { pluck, mergeMap, delayWhen, map, tap } from 'rxjs/operators';
import { HashTagType } from './searchOfType';
import * as R from 'ramda';

export const HashTagSearchObject = {
    url: '/hashtag/_search/template?pretty=true',
    template: (query) => ({
        id: 'hashtag_search_template',
        params: { search_hashtag: query.replace('#', '') },
    }),
    gethits: R.path(['aggregations', 'aggs_hashtag', 'buckets']),
};

export const getHashTagList$ = (query) => {
    return HashTagType(query).pipe(
        mergeMap((query$) =>
            from(
                instance.post(
                    HashTagSearchObject.url,
                    HashTagSearchObject.template(query$)
                )
            )
        ),
        pluck('data'),
        map(HashTagSearchObject.gethits),
        tap(console.log)
    );
};

const getSearchResultHashTag$ = (query) => {
    return getHashTagList$(query).pipe(
        map((a) => ({ type: 'hashtag', value: a })),
        tap(console.log)
    );
};

export default getSearchResultHashTag$;
