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
    width: 80vw;
    li {
        display: flex;
        margin-bottom: 19px;
    }
    li > img {
        width: 80px;
        height: 80px;
        margin-right: 10px;
    }
    .infomation {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .infomation > p {
        font-size: 12px;
        max-width: 768px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3; /* 라인수 */
        -webkit-box-orient: vertical;
        word-wrap: break-word;
        line-height: 1.2em;
        height: 3.6em;
    }

    .sub-infomation {
        margin-bottom: 10px;
    }

    .infomation span {
        font-size: 10px;
    }

    & > div > h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
    }
`;

const TotalArtistInfoBlock = styled.div`
    display: flex;
    flex-direction: column;
`;

const ArtistsInfoBlock = styled.div`
    display: flex;
    margin-bottom: 30px;
    /* flex-direction: column; */
    .album-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 10px;
    }
    img {
        width: 80px;
        height: 80px;
    }
`;

const ArtistsInfoComponent = ({
    info: {
        _source: { album, main_img, name, type, profile_img },
    },
}) => {
    return (
        <ArtistsInfoBlock>
            <div className="human-info">
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
    const keys = Object.keys(docs);
    console.log(docs);
    return (
        <TotalArtistInfoBlock>
            {artists &&
                artists.map((a, index) => (
                    <ArtistsInfoComponent info={a} key={index} />
                ))}
            <SearchResultUl>
                {keys &&
                    keys.map((key, index) => (
                        <div key={index}>
                            <h2>
                                {(key.includes('-') && index === 0) ||
                                !key.includes('-')
                                    ? key.replace(/-.+/, '')
                                    : ''}
                            </h2>
                            <hr />
                            {docs[key] &&
                                docs[key].map(
                                    (
                                        {
                                            _source: {
                                                type,
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
                                        const {
                                            url,
                                            width,
                                            height,
                                        } = JSON.parse(main_img);
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
                        </div>
                    ))}
            </SearchResultUl>
        </TotalArtistInfoBlock>
    );
};

const TotalSearchInfoCompoent = ({ searchResult }) => {
    return (
        <TotalSearchInfoBlock>
            <SearchResult searchResult={searchResult} />
        </TotalSearchInfoBlock>
    );
};

export default TotalSearchInfoCompoent;
