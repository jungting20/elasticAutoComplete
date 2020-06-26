import { of } from 'rxjs';
import * as R from 'ramda';
import { filter } from 'rxjs/operators';

export const basicmatch = R.test(/^[a-zA-Z]/);
export const usermatch = R.test(/^[@]/);
export const hashtagmatch = R.test(/^[#]/);

export const BasicType = (query) => of(query).pipe(filter(basicmatch));
export const UserType = (query) => of(query).pipe(filter(usermatch));
export const HashTagType = (query) => of(query).pipe(filter(hashtagmatch));

export const isBasic = R.propEq('type', 'basic');
export const isUser = R.propEq('type', 'user');
export const isHashtag = R.propEq('type', 'hashtag');
