import { merge } from 'rxjs';

import getSearchResult$ from './basicSearch';
import getSearchResultUser$ from './userSearch';
import getSearchResultHashTag$ from './hashTagSearch';

export const getSearchResult = (query) =>
    merge(
        getSearchResult$(query),
        getSearchResultUser$(query),
        getSearchResultHashTag$(query)
    );
