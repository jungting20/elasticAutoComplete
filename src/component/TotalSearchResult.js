import React from 'react';
import styled from 'styled-components';

const TotalSearchInfoBlock = styled.div`
    display: flex;
    justify-content: space-between;
    width: 70vw;
    height: 70vh;
`;

//Popular search

const SearchResultUl = styled.ul`
    display: flex;
    flex-direction: column;
    width: 50vw;

    li {
        display: flex;
        margin-bottom: 19px;
    }
    li > img {
        width: 100px;
        height: 100px;
        margin-right: 10px;
    }
    .infomation {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .sub-infomation {
        margin-bottom: 10px;
    }

    .infomation span {
        font-size: 10px;
    }
`;
const PopularSearchWordUl = styled.ul`
    li:nth-child(1) {
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
    }
    li {
        font-size: 20px;
    }
`;
//main_img, title, artists, cp, create_ts, hashtag
const SearchResult = ({ searchResult }) => {
    return (
        <SearchResultUl>
            {searchResult.map(
                (
                    {
                        _source: {
                            main_img,
                            title,
                            artists,
                            cp,
                            create_ts,
                            hashtag,
                        },
                    },
                    index
                ) => {
                    const { url, width, height } = JSON.parse(main_img);
                    return (
                        <li key={index}>
                            <img src={url} />
                            <div className="infomation">
                                <p>{title}</p>
                                <div className="sub-infomation">
                                    <span>{`${artists}    ,`}</span>
                                    <span>{`${cp}   ,`}</span>
                                    <span>{`${create_ts}    ,`}</span>
                                </div>
                            </div>
                        </li>
                    );
                }
            )}
        </SearchResultUl>
    );
};

const PopularSearchComponent = () => {
    return (
        <PopularSearchWordUl>
            <li>인기검색어</li>
            <li>
                <em>1</em> 딱쿠스
            </li>
            <li>
                <em>2</em> 황정호
            </li>
            <li>
                <em>3</em> 방탈출 탈슈
            </li>
            <li>
                <em>4</em> 방탈출 탈슈
            </li>
            <li>
                <em>5</em> 방탈출 탈슈
            </li>
            <li>
                <em>6</em> 방탈출 탈슈
            </li>
            <li>
                <em>7</em> 방탈출 탈슈
            </li>
        </PopularSearchWordUl>
    );
};

const TotalSearchInfoCompoent = ({ searchResult }) => {
    return (
        <TotalSearchInfoBlock>
            <SearchResult searchResult={searchResult} />
            <PopularSearchComponent />
        </TotalSearchInfoBlock>
    );
};

export default TotalSearchInfoCompoent;
