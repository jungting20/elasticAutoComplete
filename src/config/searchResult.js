import { merge } from 'rxjs';

import getSearchResult$ from './basicSearch';
import getSearchResultUser$ from './userSearch';

export const getSearchResult = (query) =>
    merge(getSearchResult$(query), getSearchResultUser$(query));
