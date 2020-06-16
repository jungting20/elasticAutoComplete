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
import { searchRes, autocomplete } from '../api/reqApi';

import CustomAutoComplete from './CustomAutoComplete';
import UseAutocomplete from './CustomAutoComplete';

import AutoCompleteK from 'react-autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const SerachInputBlock = styled.div`
    display: flex;
    flex-direction: column;
    .testman {
        color: red;
    }
`;

/* const AutoCompleteUl = styled.ul`
    display: flex;s
    flex-direction: column;
    align-items: center;
`; */
export const makeautoCompletequery = (query) => {
    /* query: {
        match: {
            title: query,
        },
    },
    highlight: {
        fields: {
            title: {},
        },
    }, */
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

const SearchInput = ({ submit }) => {
    const [option, setoption] = useState([]);
    const [inputValue, setInputValue] = React.useState('');

    const keyup = (e) => {
        submit(e, inputValue);
    };

    const change = (e, newInputValue) => {
        of(e)
            //of(e.persist())
            .pipe(
                tap((e) => setInputValue(newInputValue)),
                debounceTime(500),
                distinctUntilChanged(),
                mapTo(newInputValue),
                switchMap((query) => {
                    return from(
                        autocomplete(makeautoCompletequery(query))
                    ).pipe(
                        pluck('data'),
                        map(({ hits }) => hits.hits)
                    );
                }),
                mergeMap((a) =>
                    //from(a).pipe(mergeMap((b) => b.highlight.title))
                    from(a).pipe(
                        map((b) => b._source.search_keyword),
                        distinctUntilChanged(
                            (a, b) =>
                                a.replace(/\s+/gi, '') ===
                                b.replace(/\s+/gi, '')
                        )
                    )
                ),
                map((title) => {
                    return {
                        title: title.replace(/(<([^>]+)>)/gi, ''),
                    };
                }),
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
                /* onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }} */
                onInputChange={change}
                inputValue={inputValue}
                onKeyUp={keyup}
                /* onKeyDown={change} */
                renderOption={(option, { inputValue }) => {
                    const matches = match(option.title, inputValue);
                    const parts = parse(option.title, matches);

                    return (
                        <div>
                            {parts.map((part, index) => (
                                <span
                                    key={index}
                                    style={{
                                        fontWeight: part.highlight ? 700 : 400,
                                        color: part.highlight ? 'red' : '',
                                    }}
                                >
                                    {part.text}
                                </span>
                            ))}
                        </div>
                    );
                }}
            />
        </SerachInputBlock>
    );
};

export default SearchInput;
