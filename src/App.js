import React, { useState, useEffect } from 'react';
import './App.css';
import TotalSearchInfoCompoent from './component/TotalSearchResult';
import styled from 'styled-components';
import SearchInput from './component/SearchInput';
import PopularWordList from './component/PopularWordList';
import { of, forkJoin } from 'rxjs';
import {
    mapTo,
    filter,
    switchMap,
    delayWhen,
    withLatestFrom,
} from 'rxjs/operators';
import {
    insertpoplarSearchRes$,
    getSearchResult$,
    popularSearchRes$,
} from './config/searchResult';
import {
    getrecommendArtits$,
    gethashtag$,
    getchallenge$,
} from './config/focus';
import FocusComponent from './component/Focus';
const AppLayout = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

function App() {
    const [searchResult, setsearchResult] = useState([]);
    const [popularWordList, setpopularWordList] = useState([]);
    const [focusdata, setfocusdata] = useState({});

    const submit = (e, value) => {
        of(e)
            .pipe(
                filter((e) => e.keyCode === 13),
                mapTo(value),
                delayWhen(insertpoplarSearchRes$),
                switchMap(getSearchResult$),
                withLatestFrom(popularSearchRes$)
            )
            .subscribe(([searchresult, newpopularWordlist]) => {
                setsearchResult(searchresult);
                setpopularWordList(newpopularWordlist);
                setfocusdata({});
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
            <FocusComponent focusItem={focusdata} />
            <TotalSearchInfoCompoent searchResult={searchResult} />;
        </AppLayout>
    );
}

export default App;
