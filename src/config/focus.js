import { from, of } from 'rxjs';
import instance from '../api/reqApi';
import { catchError, map, pluck, tap } from 'rxjs/operators';

const getrecommendArtits = () => {
    return instance.post('/artists/_search/template?pretty=true', {
        id: 'artist_template',
    });
};
const gethashtag = () => {
    return instance.post('/community/_search/template?pretty=true', {
        id: 'hashtag_template',
    });
};
const getchallenge = () => {
    return instance.post('/community/_search/template?pretty=true', {
        id: 'challenge_template',
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
