import React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
const FocusBlock = styled.div`
    width: 100%;
    height: 50vh;
    margin-top: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

//아티스트:_source => main_img,name

//해시태그:key

const RecommendArtistsBlock = styled.ul`
    display: flex;

    li {
        margin-right: 10px;
    }
    li > img {
        width: 50px;
        height: 50px;
    }
`;

const HashTagBlock = styled.ul`
    display: flex;
    margin-top: 30px;
    li {
        font-size: 0.8rem;
    }
`;

const ChallengeBlock = styled.ul`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    margin-top: 30px;
    width: 80vw;
    /* div {
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    } */
    h1 {
        font-size: 1.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 라인수 */
        -webkit-box-orient: vertical;
        word-wrap: break-word;
        line-height: 1.2em;
        height: 3.6em;
    }

    .tags {
        font-size: 0.8rem;
    }
    .contents {
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
    .community-block {
        display: flex;
        flex-direction: row;
    }
    .community-contents {
        /*    width: 40%; */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .community-img {
        width: 80px;
        height: 80px;
        margin-right: 0.5rem;
    }

    .community-item {
        margin-top: 30px;
    }
`;

const recommendgetter = R.pipe(
    R.path(['hits', 'hits']),
    R.map((a) => a._source.profile_img),
    R.flatten
);

const FocusComponent = ({ focusItem }) => {
    const recommendList = focusItem.artists;
    const hashtagList = focusItem.hashtag;
    const challengeList = focusItem.challenge;

    /* contents: "IZ*ONE has set a new record for first-week sales with their new album! The girl group released their album Oneiric Diary on June 15, and Hanteo Chart has now confirmed that the album sold 389,334 copies in its first week (to June 21). That beats their previous record set with BLOOM*IZ, which sold 356,313 copies in its first week of release in February 2020."
create_ts: "2020-06-22T04:36:40Z"
hashtag: "twice, bts"
title: "IZ*ONE set new record for K-pop girl group first-week sales"
type: "challenge"
user: */

    return (
        <FocusBlock>
            <RecommendArtistsBlock>
                {recommendList &&
                    recommendList.map(({ key, profile_img }, i) => {
                        return (
                            <li key={i}>
                                <img src={recommendgetter(profile_img)} />
                                <p>{key}</p>
                            </li>
                        );
                    })}
            </RecommendArtistsBlock>
            <HashTagBlock>
                {hashtagList &&
                    hashtagList.map((a, i) => <li key={i}>{`#${a.key},`}</li>)}
            </HashTagBlock>
            <ChallengeBlock>
                {challengeList &&
                    challengeList.map(({ _source }, i) => {
                        const imgurl = JSON.parse(_source.main_img).url;
                        return (
                            <div className="community-block" key={i}>
                                <img
                                    src={imgurl}
                                    className="community-img community-item"
                                />
                                <div className="community-contents community-item">
                                    <h1 className="title">{_source.title}</h1>
                                    {/* <p className="contents">
                                        {_source.contents}
                                    </p> */}
                                    <p className="tags">
                                        {_source.hashtag
                                            .split(',')
                                            .map((a) => `#${a.trim()}`)
                                            .join(',')}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
            </ChallengeBlock>
        </FocusBlock>
    );
};

export default FocusComponent;
