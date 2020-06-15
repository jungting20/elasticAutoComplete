import React, { useState } from 'react';
import './App.css';
import TotalSearchInfoCompoent from './component/TotalSearchResult';
import styled from 'styled-components';
import SearchInput from './component/SearchComponent';
import { searchRes } from './api/reqApi';
import { of, from, forkJoin } from 'rxjs';
import {
    pluck,
    mapTo,
    filter,
    map,
    switchMap,
    tap,
    delayWhen,
    mergeMap,
    catchError,
} from 'rxjs/operators';
import { popularGetSearchRes, popularinsertSearchRes } from './api/reqApi';
const AppLayout = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;
/* 
const makeSearchObjReal = (query) => {
    return {
        query: {
            bool: {
                should: [
                    {
                        bool: {
                            should: [
                                {
                                    match: {
                                        title: {
                                            query,
                                            analyzer: 'standard',
                                        },
                                    },
                                },
                            ],
                            filter: [
                                {
                                    term: {
                                        _index: 'docs',
                                    },
                                },
                            ],
                        },
                    },
                    {
                        bool: {
                            must: [
                                {
                                    match: {
                                        name: {
                                            query,
                                            boost: 10,
                                        },
                                    },
                                },
                            ],
                            filter: [
                                {
                                    term: {
                                        _index: 'artists',
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    };
}; */

const makeSearchObjReal = (query) => {
    return {
        query: {
            bool: {
                should: [
                    {
                        bool: {
                            should: [
                                {
                                    multi_match: {
                                        query,
                                        fields: [
                                            'title^3',
                                            'contents^2',
                                            'artists',
                                        ],
                                    },
                                },
                            ],
                            filter: [
                                {
                                    term: {
                                        _index: 'docs',
                                    },
                                },
                            ],
                        },
                    },
                    {
                        bool: {
                            must: [
                                {
                                    match: {
                                        name: {
                                            query,
                                            boost: 20,
                                        },
                                    },
                                },
                            ],
                            filter: [
                                {
                                    term: {
                                        _index: 'artists',
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    };
};
const partition = (keyfn, array) => {
    return array.reduce(
        (a, b) => {
            if (keyfn(b)) {
                a[0].push(b);
            } else {
                a[1].push(b);
            }
            return a;
        },
        [[], []]
    );
};
//aggregations,group_by_state,buckets
function App() {
    const [searchResult, setsearchResult] = useState([]);
    const [popularWordList, setpopularWordList] = useState([]);

    const submit = (e, value) => {
        forkJoin(
            of(e).pipe(
                filter((e) => e.keyCode === 13),
                mapTo(value),
                switchMap((query) => {
                    return from(searchRes(makeSearchObjReal(query))).pipe(
                        pluck('data'),
                        map(({ hits }) => hits.hits),
                        map((a) => partition((b) => b._index === 'artists', a))
                    );
                })
            ),
            of(e).pipe(
                filter((e) => e.keyCode === 13),
                mapTo(value),
                delayWhen((query) =>
                    from(popularinsertSearchRes(query)).pipe(
                        catchError((error) => {
                            return of('error');
                        })
                    )
                ),
                mergeMap((query) =>
                    from(popularGetSearchRes()).pipe(
                        pluck('data'),
                        map((obj) => obj.aggregations.group_by_state.buckets)
                    )
                )
            )
        ).subscribe(([searchresult, wordlist]) => {
            setsearchResult(searchresult);
            setpopularWordList(wordlist);
        });
    };

    return (
        <AppLayout>
            <SearchInput submit={submit} />
            <TotalSearchInfoCompoent
                searchResult={searchResult}
                popularWordList={popularWordList}
            />
            ;
        </AppLayout>
    );
}

export default App;
