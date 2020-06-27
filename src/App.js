import React, { useState, useEffect } from 'react';
import './App.css';
import TotalSearchInfoCompoent from './component/TotalSearchResult';
import styled from 'styled-components';
import SearchInput from './component/SearchInput';
import PopularWordList from './component/PopularWordList';
import { of, forkJoin } from 'rxjs';
import { mapTo, filter, switchMap } from 'rxjs/operators';
import * as R from 'ramda';
import { getSearchResult } from './config/searchResult';
import { popularSearchRes$ } from './config/basicSearch';
import {
    getrecommendArtits$,
    gethashtag$,
    getchallenge$,
} from './config/focus';
import FocusComponent from './component/Focus';
import { isBasic, isUser } from './config/searchOfType';
import UserSearchResult from './component/UserSearchResult';

const AppLayout = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const isNotEmpty = R.pipe(R.isEmpty, R.not);

function App() {
    const [searchResult, setsearchResult] = useState([]);
    const [popularWordList, setpopularWordList] = useState([]);
    const [focusdata, setfocusdata] = useState({});
    const [userList, setuserList] = useState([]);
    const submit = (e, value) => {
        of(e)
            .pipe(
                filter((e) => e.keyCode === 13),
                mapTo(value),
                switchMap(getSearchResult)
            )
            .subscribe((a) => {
                const setresult = R.cond([
                    [
                        isBasic,
                        (value) => {
                            const [
                                searchresult,
                                newpopularWordlist,
                            ] = value.value;
                            setsearchResult(searchresult);
                            setpopularWordList(newpopularWordlist);
                            setfocusdata({});
                        },
                    ],
                    [
                        isUser,
                        (value) => {
                            //console.log(value, 'asdsadasdsad');
                            setuserList(value.value);
                            setfocusdata({});
                        },
                    ],
                ]);

                setresult(a);
            });
    };

    const focus = (e) => {
        forkJoin(
            getrecommendArtits$(),
            gethashtag$(),
            getchallenge$()
        ).subscribe(([artists, hashtag, challenge]) => {
            setfocusdata({
                artists,
                hashtag,
                challenge,
            });
        });
    };

    const close = (e) => {
        // setfocusdata({});
    };

    useEffect(() => {
        popularSearchRes$.subscribe((newpop) => setpopularWordList(newpop));
    }, []);
    return (
        <AppLayout>
            <PopularWordList popularWordList={popularWordList} />
            <SearchInput submit={submit} focus={focus} close={close} />
            {isNotEmpty(focusdata) ? (
                <FocusComponent focusItem={focusdata} />
            ) : (
                <></>
            )}
            {isNotEmpty(searchResult) ? (
                <TotalSearchInfoCompoent searchResult={searchResult} />
            ) : (
                <></>
            )}
            {isNotEmpty(userList) ? (
                <UserSearchResult userList={userList} />
            ) : (
                <></>
            )}
        </AppLayout>
    );
}

export default App;
