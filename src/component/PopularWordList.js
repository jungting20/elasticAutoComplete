import React from 'react';
import styled from 'styled-components';

const PopularSearchWordUl = styled.ul`
    display: flex;
    li:nth-child(1) {
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
    }
    li {
        font-size: 0.8rem;
    }
`;

const PopularSearchComponent = ({ popularWordList }) => {
    return (
        <PopularSearchWordUl>
            <li>인기검색어:</li>
            {popularWordList &&
                popularWordList.map((a, index) => (
                    <li key={index}>{`${a.key},`}</li>
                ))}
        </PopularSearchWordUl>
    );
};

export default PopularSearchComponent;
