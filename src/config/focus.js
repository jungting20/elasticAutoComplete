import { from, of } from 'rxjs';
import instance from '../api/reqApi';
import { catchError, map, pluck, tap } from 'rxjs/operators';

const getrecommendArtits = () => {
    return instance.post('/artists/_search?pretty=true', {
        size: 4,
        query: {
            match_all: {},
        },
    });
};
const gethashtag = () => {
    return instance.post('/community/_search?pretty=true', {
        size: 0,
        query: {
            match_all: {},
        },
        aggs: {
            popular_hashtag: {
                terms: {
                    field: 'hashtag',
                },
            },
        },
    });
};
const getchallenge = () => {
    return instance.post('/community/_search?pretty=true', {
        size: 4,
        sort: {
            create_ts: 'desc',
        },
        query: {
            match: {
                type: {
                    query: 'challenge',
                },
            },
        },
    });
};
export const getrecommendArtits$ = () =>
    from(getrecommendArtits()).pipe(
        pluck('data'),
        map((a) => a.hits.hits)
    );

export const gethashtag$ = () =>
    from(gethashtag()).pipe(
        pluck('data'),
        map((a) => a.aggregations.popular_hashtag.buckets)
    );

export const getchallenge$ = () =>
    from(getchallenge()).pipe(
        pluck('data'),
        map((a) => a.hits.hits)
    );
