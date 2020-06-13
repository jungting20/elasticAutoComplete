import React, { useState } from 'react';
import './App.css';
import TotalSearchInfoCompoent from './component/TotalSearchResult';
import styled from 'styled-components';
import SearchInput from './component/SearchComponent';
import { searchRes } from './api/reqApi';
import { of, from } from 'rxjs';
import { pluck, mapTo, filter, map, switchMap, tap } from 'rxjs/operators';

const AppLayout = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const makeSearchObj = (query) => {
    return {
        query: {
            match: {
                title: {
                    query,
                },
            },
        },
    };
};

function App() {
    const [searchResult, setsearchResult] = useState([]);

    const submit = (e, value) => {
        of(e)
            .pipe(
                filter((e) => e.keyCode === 13),
                mapTo(value),
                switchMap((query) => {
                    console.log(query);
                    return from(searchRes(makeSearchObj(query))).pipe(
                        pluck('data'),
                        map(({ hits }) => hits.hits)
                    );
                }),
                tap(console.log)
            )
            .subscribe(setsearchResult);
    };

    return (
        <AppLayout>
            <SearchInput submit={submit} />
            <TotalSearchInfoCompoent searchResult={searchResult} />;
        </AppLayout>
    );
}

export default App;
