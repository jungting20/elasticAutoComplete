import React from 'react';
import styled from 'styled-components';

const UserSearchResultBlock = styled.ul`
    display: flex;
    flex-direction: column;
`;

const UserSearchResult = ({ userList }) => {
    console.log(userList);
    return (
        <UserSearchResultBlock>
            {userList.map((user) => (
                <li>{user._source.first_name}</li>
            ))}
        </UserSearchResultBlock>
    );
};

export default UserSearchResult;
