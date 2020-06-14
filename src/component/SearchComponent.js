import React, { useState } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { of, from } from 'rxjs';
import {
    debounceTime,
    switchMap,
    map,
    pluck,
    mapTo,
    tap,
    mergeMap,
    toArray,
    distinctUntilChanged,
} from 'rxjs/operators';
import { searchRes } from '../api/reqApi';

import CustomAutoComplete from './CustomAutoComplete';

const SerachInputBlock = styled.div`
    display: flex;
    flex-direction: column;
`;

/* const AutoCompleteUl = styled.ul`
    display: flex;s
    flex-direction: column;
    align-items: center;
`; */
const makeautoCompletequery = (query) => ({
    query: {
        match: {
            title: query,
        },
    },
    highlight: {
        fields: {
            title: {},
        },
    },
});

const SearchInput = ({ submit }) => {
    const [option, setoption] = useState([]);
    const [inputValue, setInputValue] = React.useState('');

    const keyup = (e) => {
        submit(e, inputValue);
    };

    const change = (e) => {
        of(e.persist())
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                mapTo(inputValue),
                switchMap((query) => {
                    return from(searchRes(makeautoCompletequery(query))).pipe(
                        pluck('data'),
                        map(({ hits }) => hits.hits)
                    );
                }),
                mergeMap((a) =>
                    from(a).pipe(mergeMap((b) => b.highlight.title))
                ),
                map((title) => ({ title })),
                toArray()
            )
            .subscribe(setoption);
    };

    return (
        <SerachInputBlock>
            <Autocomplete
                id="combo-box-demo"
                options={option}
                getOptionLabel={(option) => option.title}
                style={{ width: 300 }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="검색어를 입력해주세요"
                    />
                )}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                inputValue={inputValue}
                onKeyUp={keyup}
                onKeyDown={change}
            />
        </SerachInputBlock>
    );
};

export default SearchInput;
