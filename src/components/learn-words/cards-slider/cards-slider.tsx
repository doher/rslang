/* eslint-disable */
import React, { useEffect } from 'react';
import Card from '../card/card';

interface SliderProps {
  maxWordsCards: number,
  setItTimeToNotification:any,
  repeatWords: any,
  words: any,
  word: any,
  setWord: any,
  index: number,
  setIndex: any,
  onCorrect: any,
  correct: boolean,
  setUsersWord: any,
  usersWord: string,
  indexes: any,
  setIndexes: any,
  setAudioWord: any,
  setAudioExample: any,
  setAudioMeaning: any,
  autoplay: boolean,
  setAutoplay: any,
  inProp: boolean,
  setInProp: any,
  transpAnswer: boolean,
  setTranspAnswer: any,
}

function CardsSlider({
  words, word, setWord, index, setIndex, onCorrect, correct, setUsersWord,
  usersWord, indexes, setIndexes,
  setAudioWord, setAudioExample, setAudioMeaning, autoplay, setAutoplay,
  inProp, setInProp, transpAnswer, setTranspAnswer, repeatWords, maxWordsCards, setItTimeToNotification
}: SliderProps) {

  let curword: any = {};

  if (index >= maxWordsCards - 1) {
    if (repeatWords.length) {
      curword = repeatWords.shift();
      curword.userWord.optional.repeat=false;
    } else {
      setItTimeToNotification(true);
    }

  } else {
    curword = words[index];
  }



  /* eslint-disable */
  useEffect(() => {
    setWord(curword);
    setAudioWord(word.audio);
    setAudioExample(word.audioExample);
    setAudioMeaning(word.audioMeaning);
  }, [curword, word, setWord, setAudioWord, setAudioExample, setAudioMeaning]);

  /* eslint-enable */
  return (
    <>
      <Card
        word={word}
        setWord={setWord}
        index={index}
        setIndex={setIndex}
        onCorrect={onCorrect}
        correct={correct}
        setUsersWord={setUsersWord}
        usersWord={usersWord}
        indexes={indexes}
        setIndexes={setIndexes}
        autoplay={autoplay}
        setAutoplay={setAutoplay}
        inProp={inProp}
        setInProp={setInProp}
        transpAnswer={transpAnswer}
        setTranspAnswer={setTranspAnswer}
      />
    </>
  );
}

export default CardsSlider;
