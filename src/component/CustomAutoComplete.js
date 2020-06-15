/* eslint-disable no-use-before-define */
import React from 'react';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

const useStyles = makeStyles((theme) => ({
    label: {
        display: 'block',
    },
    input: {
        width: 200,
        border: 'none',
    },
    listbox: {
        width: 200,
        margin: 0,
        padding: 0,
        zIndex: 1,
        position: 'absolute',
        listStyle: 'none',
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        maxHeight: 200,
        border: '1px solid rgba(0,0,0,.25)',
        '& li[data-focus="true"]': {
            backgroundColor: '#4a8df6',
            color: 'white',
            cursor: 'pointer',
        },
        '& li:active': {
            backgroundColor: '#2977f5',
            color: 'white',
        },
    },
}));

const SearchInputBlock = styled.div`
    border: 1px solid rgba(0, 0, 0, 0.87);
    width: 300px;
    height: 56px;
    display: flex;
    align-items: center;
    padding-left: 1rem;

    input {
        font-size: 1rem;
    }
`;

export default function UseAutocomplete({ options, change, keyup, value }) {
    const classes = useStyles();
    const {
        getRootProps,
        getInputLabelProps,
        getInputProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
    } = useAutocomplete({
        id: 'use-autocomplete-demo',
        options,
        getOptionLabel: (option) => option.title,
    });

    return (
        <SearchInputBlock>
            <div {...getRootProps()}>
                {/* <legend>엥이건뭐지</legend> */}
                <label className={classes.label} {...getInputLabelProps()}>
                    useAutocomplete
                </label>
                <input
                    className={classes.input}
                    {...getInputProps()}
                    onChange={change}
                    onKeyUp={keyup}
                    value={value}
                    placeholder="검색어를 입력해주세요"
                />
            </div>
            {groupedOptions.length > 0 ? (
                <ul className={classes.listbox} {...getListboxProps()}>
                    {groupedOptions.map((option, index) => (
                        <li {...getOptionProps({ option, index })}>
                            {option.title}
                        </li>
                    ))}
                </ul>
            ) : null}
        </SearchInputBlock>
    );
}
