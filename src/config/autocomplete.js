import { from } from 'rxjs';
import { mergeMap, distinctUntilChanged, map, pluck } from 'rxjs/operators';
import instance from '../api/reqApi';

export const AutoCompleteUrl = '/search_keyword/_search?pretty=true';
export const autocomplete = (query) => {
    return instance.post(AutoCompleteUrl, query);
};

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

const gethits = ({ hits }) => hits.hits;
const getSearch_keyword = (b) => b._source.search_keyword;
export const getAutoWordList = (query) => {
    return from(autocomplete(makeautoCompletequery(query))).pipe(
        pluck('data'),
        map(gethits),
        mergeMap((a) =>
            from(a).pipe(
                map(getSearch_keyword),
                distinctUntilChanged(
                    (a, b) => a.replace(/\s+/gi, '') === b.replace(/\s+/gi, '')
                )
            )
        )
    );
};
