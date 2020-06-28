import React from 'react';
import styled from 'styled-components';

const UserSearchResultBlock = styled.ul`
    display: flex;
    flex-direction: column;
    width: 55vw;
    margin-top: 1rem;
    font-size: 2rem;
`;

const UserSearchResult = ({ userList }) => {
    return (
        <UserSearchResultBlock>
            {userList.map((user) => (
                <li>{user._source.first_name}</li>
            ))}
        </UserSearchResultBlock>
    );
};

export default UserSearchResult;
