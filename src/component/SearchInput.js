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

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { getAutoWordList } from '../config/autocomplete';

const SerachInputBlock = styled.div`
    display: flex;
    flex-direction: column;
    .testman {
        color: red;
    }
`;

const SearchInput = ({ submit, focus, close }) => {
    const [option, setoption] = useState([]);
    const [inputValue, setInputValue] = React.useState('');

    const keyup = (e) => {
        submit(e, inputValue);
    };
    const change = (e, newInputValue) => {
        //of(e.persist())
        of(e)
            .pipe(
                tap((e) => setInputValue(newInputValue)),
                debounceTime(500),
                mapTo(newInputValue),
                distinctUntilChanged(),
                switchMap(getAutoWordList),
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
                onOpen={() => focus()}
                onClose={() => close()}
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
                onInputChange={change}
                inputValue={inputValue}
                onKeyUp={keyup}
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
