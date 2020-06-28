import { from, of, merge } from 'rxjs';
import instance from '../api/reqApi';
import { pluck, mergeMap, delayWhen, map, tap } from 'rxjs/operators';
import { UserType } from './searchOfType';

const UserSearchObject = {
    url: '/docs_user/_search/template?pretty=true',
    template: (query) => ({
        id: 'user_search_template',
        params: { user_search: query.replace('@', '') },
    }),
    gethits: (a) => a.hits.hits,
};

const getSearchResultUser$ = (query) => {
    return UserType(query).pipe(
        mergeMap((query$) =>
            from(
                instance.post(
                    UserSearchObject.url,
                    UserSearchObject.template(query$)
                )
            )
        ),
        pluck('data'),
        map(UserSearchObject.gethits),
        map((a) => ({ type: 'user', value: a }))
    );
};

export default getSearchResultUser$;
