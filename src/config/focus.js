import { from, of } from 'rxjs';
import instance from '../api/reqApi';
import { catchError, map, pluck, tap } from 'rxjs/operators';
// aggregations.popular_artists.buckets
const getrecommendArtits = () => {
    // return instance.post('/docs_user/_search/template?pretty=true', {
    return instance.post('/artists/_search/template?pretty=true', {
        id: 'artist_template',
    });
};
const gethashtag = () => {
    return instance.post('/hashtag/_search/template?pretty=true', {
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
        tap(console.log),
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
