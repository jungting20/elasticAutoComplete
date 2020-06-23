import React from 'react';
import styled from 'styled-components';

const FocusBlock = styled.div`
    width: 100%;
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
`;

const ChallengeBlock = styled.ul`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    margin-top: 30px;
    div {
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    h1 {
        font-size: 1.5rem;
    }

    .tags {
        font-size: 0.8rem;
    }
`;

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
                    recommendList.map(({ _source }, i) => {
                        return (
                            <li key={i}>
                                <img src={_source.main_img} />
                                <p>{_source.name}</p>
                            </li>
                        );
                    })}
            </RecommendArtistsBlock>
            <HashTagBlock>
                {hashtagList &&
                    hashtagList.map((a, i) => (
                        <li key={i}>{`  #${a.key}  ,`}</li>
                    ))}
            </HashTagBlock>
            <ChallengeBlock>
                {challengeList &&
                    challengeList.map(({ _source }, i) => {
                        return (
                            <div>
                                <h1>{_source.title}</h1>
                                <p>{_source.contents}</p>
                                <p className="tags">
                                    {_source.hashtag
                                        .split(',')
                                        .map((a) => `#${a.trim()}`)
                                        .join(',')}
                                </p>
                            </div>
                        );
                    })}
            </ChallengeBlock>
        </FocusBlock>
    );
};

export default FocusComponent;
