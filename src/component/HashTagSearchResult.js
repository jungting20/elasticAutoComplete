import React from 'react';
import styled from 'styled-components';

const HashTagSearchResultBlock = styled.ul`
    display: flex;
    flex-direction: column;
    width: 55vw;
    margin-top: 1rem;
    font-size: 2rem;
`;

const HashTagSearchResult = ({ hashtagList }) => {
    return (
        <HashTagSearchResultBlock>
            {hashtagList.map((tag) => (
                <li>{`#${tag.key}    count:${tag.doc_count}`}</li>
            ))}
        </HashTagSearchResultBlock>
    );
};

export default HashTagSearchResult;
