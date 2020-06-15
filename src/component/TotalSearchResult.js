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

const TotalArtistInfoBlock = styled.div`
    display: flex;
    flex-direction: column;
`;

const ArtistsInfoBlock = styled.div`
    display: flex;
    margin-bottom: 30px;
    .album-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 10px;
    }
`;

const ArtistsInfoComponent = ({
    info: {
        _source: { album, main_img, name, type, profile_img },
    },
}) => {
    return (
        <ArtistsInfoBlock>
            <div>
                <p>인물정보</p>
                <figure>
                    <img src={profile_img} />
                    <figcaption>{name}</figcaption>
                </figure>
            </div>
            <div className="album-info">
                <p>앨범정보</p>
                <figure>
                    <img src={main_img} />
                    <figcaption>{album}</figcaption>
                </figure>
            </div>
        </ArtistsInfoBlock>
    );
};
//album,main_img,name,type

//main_img, title, artists, cp, create_ts, hashtag
const SearchResult = ({ searchResult }) => {
    const [artists, docs] = searchResult;

    return (
        <TotalArtistInfoBlock>
            {artists &&
                artists.map((a, index) => (
                    <ArtistsInfoComponent info={a} key={index} />
                ))}
            <SearchResultUl>
                {docs &&
                    docs.map(
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
        </TotalArtistInfoBlock>
    );
};

const PopularSearchComponent = ({ popularWordList }) => {
    return (
        <PopularSearchWordUl>
            <li>인기검색어</li>
            {popularWordList &&
                popularWordList.map((a, index) => (
                    <li key={index}>{`${index + 1}.  ${a.key}`}</li>
                ))}
        </PopularSearchWordUl>
    );
};

const TotalSearchInfoCompoent = ({ searchResult, popularWordList }) => {
    return (
        <TotalSearchInfoBlock>
            <SearchResult searchResult={searchResult} />
            <PopularSearchComponent popularWordList={popularWordList} />
        </TotalSearchInfoBlock>
    );
};

export default TotalSearchInfoCompoent;
