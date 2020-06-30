import { from, of } from 'rxjs';
import instance from '../api/reqApi';
import { catchError, map, pluck, tap } from 'rxjs/operators';
// aggregations.popular_artists.buckets
//new Date().toISOString().slice(0,10)

// const getrecommendArtits = () => {
//     // return instance.post('/docs_user/_search/template?pretty=true', {
//     return instance.post('/artists/_search/template?pretty=true', {
//         id: 'artist_template',
//     });
// };

const getrecommendArtits = () => {
    // return instance.post('/docs_user/_search/template?pretty=true', {
    let today = new Date();
    today.setMonth(today.getMonth() - 1);
    return instance.post('/artist_follower/_search/template?pretty=true', {
        id: 'popular_artist_template',
        params: {
            date_gt_query: today.toISOString().slice(0, 10),
            // date_gt_query: '2020-06-01',
            followed_artists:
                'MONSTA_X|SuperM|Golden_Child|HYUNA|GOT7|GUGUDAN|IDLE|IU|ITZY|IZONE|JYJ|JAY_PARK|JESSI|Kang_Daniel|LEE_HI|KARD|KCONLA|ZICO|SOMI|BTOB|BLACKPINK|BTS|BIGBANG|TWICE|ONLYONEOF|iKON',
        },
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
        map((a) => a.aggregations.popular_artist.buckets)
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
