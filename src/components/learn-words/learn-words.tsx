import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button } from 'antd';
import moment from 'moment';
import styles from './learn-words.module.css';
import { getWordsFromBackend } from '../../services/getWords';
import { getSettings, UserSettings } from '../../services/settings';
import { getStatistic } from '../../services/statistic';
import ProgressIndicator from './progress-indicator/progress-indicator';
import Buttons from './buttons/buttons';
import CardsSlider from './cards-slider/cards-slider';
import AudioAutoplay from './audio-autoplay/audio-autoplay';

function LearnWords() {
  const history = useHistory();
  const [words, setWords] = useState([]);
  const [word, setWord] = useState('');
  const [correct, setCorrect] = useState(false);
  const [usersWord, setUsersWord] = useState('');
  const [indexes, setIndexes] = useState([]);
  const [index, setIndex] = useState(0);
  const [audioWord, setAudioWord] = useState(null);
  const [audioExample, setAudioExample] = useState(null);
  const [audioMeaning, setAudioMeaning] = useState(null);
  const [autoplay, setAutoplay] = useState(false);
  const [inProp, setInProp] = useState(true);
  const [transpAnswer, setTranspAnswer] = useState(false);
  const [maxCards, setMaxCards] = useState(10);
  const [settingsForCard, setSettings] = useState({});

  const [visible, setVisible] = useState(true);
  const [visibleNotification, setVisibleNotification] = useState(false);
  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);
  const [wordIndicator, setIndicator] = useState(1);

  /* eslint-disable */

  useEffect(() => {
    // eslint-disable-next-line
  }, []);

  const newWord = (word1: any) => setWord(word1);
  const correctCard = (isCorrect: boolean) => setCorrect(isCorrect);
  const newUsersWord = (word1: string) => setUsersWord(word1);
  const newIndex = () => setIndex(index + 1);
  const newAudioWord = (audio: any) => setAudioWord(audio);
  const newAudioExample = (audio: any) => setAudioExample(audio);
  const newAudioMeaning = (audio: any) => setAudioMeaning(audio);
  const newWordIndicator = (indicator: any) => setIndicator(indicator)
  const controlAutoplay = (isAutoplay: boolean) => setAutoplay(isAutoplay);
  const newInProp = (isInProp: boolean) => setInProp(isInProp);
  const newTranspAnswer = (isTranspAnswer: boolean) => setTranspAnswer(isTranspAnswer);
  const newProgress = (progress1: number) => setProgress(progress1);
  const newWords = (words: any) => setWords(words);
  const newMaxCards = (cardsAmount: number) => setMaxCards(cardsAmount);

  function handleOk(key: string): () => void | Promise<void> {
    return async function (): Promise<void> {
      setLoading(true);
      const settingsData = await getSettings();
      const settings: UserSettings = {
        wordsPerDay: settingsData.wordsPerDay,
        optional: {
          isUserOfOurSuperDuperApp: settingsData.optional.isUserOfOurSuperDuperApp,
          lastVisit: settingsData.optional.lastVisit,
          cardsPerDay: settingsData.optional.cardsPerDay,
          wordTranscription: settingsData.optional.wordTranscription,
          spellingOutSentence: settingsData.optional.spellingOutSentence,
          picture: settingsData.optional.picture,
          sentenceExample: settingsData.optional.sentenceExample,
          translateDescription: settingsData.optional.translateDescription,
          showResultButton: settingsData.optional.showResultButton,
          moveToDifficult: settingsData.optional.moveToDifficult,
          deleteWord: settingsData.optional.deleteWord,
          difficultyButtons: settingsData.optional.difficultyButtons,
        },
      };
      setSettings(settings);
      let filter = '';
      switch (key) {
        case 'new':
          filter = JSON.stringify({
            $and: [
              { 'userWord.optional.newWord': true },
              { 'userWord.optional.active': true }
            ]
          });
          break;
        case 'repeating':
          filter = JSON.stringify({

            $and: [{ 'userWord.optional.nextView': moment().format('DD/MM/YY') },
            { 'userWord.optional.newWord': false },
            { 'userWord.optional.active': true }
            ],
          }
          );
          break;
        default:
          filter = JSON.stringify({
            $or: [{
              $and: [{ 'userWord.optional.nextView': moment().format('DD/MM/YY') },
              { 'userWord.optional.newWord': false },
              { 'userWord.optional.active': true }
              ],
            },
            {
              $and: [
                { 'userWord.optional.newWord': true },
                { 'userWord.optional.active': true }]
            },
            {
              $and: [
                { 'userWord.optional.newWord': false },
                { 'userWord.optional.active': true }]
            }
            ],
          });
          break;
      }
      getStatistic().then((statistic: any) => {

        let wordForCards: number = settings.optional.cardsPerDay;

        if (statistic.optional.common.wordsToday.slice(-1)) {
          wordForCards = settings.optional.cardsPerDay - statistic.optional.common.wordsToday.slice(-1);
          wordForCards = (wordForCards <= 0) ? 0 : wordForCards;
          if (!wordForCards || settings.optional.cardsPerDay <= statistic.optional.common.wordsToday.slice(-1)) {
            setLoading(false);
            setVisible(false);
            Notification(statistic)
          }
        }
        if (wordForCards) {
          getWordsFromBackend(filter, wordForCards)
            .then((data) => {
              setWords(data[0].paginatedResults);
              setMaxCards(data[0].paginatedResults.length);
            })
            .then(() => {
              setLoading(false);
              setVisible(false);
            })
        }
      }

      )   
    };
  }

  function Notification(trainStatistic: any) {

    setWord('');
    Modal.info({
      title: 'Congrats!',
      visible: visibleNotification,
      centered: true,
      content: (
        <div className={styles.notifContainer}>
          <div className={styles.notifTitle}>You have learned all words for today!</div>
          <div className={styles.notifTitle}>
            <div>Cards passed: {trainStatistic.optional.common.wordsToday[trainStatistic.optional.common.wordsToday.length - 1]}</div>
            <div> Percent of correct words: {Math.round(trainStatistic.optional.common.correct[trainStatistic.optional.common.correct.length - 1] /
              (trainStatistic.optional.common.correct[trainStatistic.optional.common.correct.length - 1] + trainStatistic.optional.common.errors) * 100)} %</div>
            <div>New words: {trainStatistic.optional.common.newWordsToday} </div>
          </div>
        </div>
      ),
      onOk() {
        setVisibleNotification(false);
        history.push('/main-page');
      },
    });
  }

  return (

    <div className={styles.background}>
      <Modal
        className={styles.modal}
        visible={visible}
        title="Almost everything is ready"
        centered
        footer={[
          <Button className={styles.modalButtonNew} type="primary" loading={loading} onClick={handleOk('new')}>
            Only new words
          </Button>,
          <Button className={styles.modalButtonAll} type="primary" loading={loading} onClick={handleOk('all')}>
            All words
          </Button>,
          <Button className={styles.modalButtonDifficult} type="primary" loading={loading} onClick={handleOk('repeating')}>
            Words to repeat
          </Button>,
        ]}
      >
        <div>Please, choose which words you want to learn or repeat</div>
      </Modal>
      {words.length !== 0
        ? (
          <div className={styles.cardContainer}>
            <ProgressIndicator progress={progress} />
            <CardsSlider
            renderWithSettings={settingsForCard}
              wordIndicator={wordIndicator}
              setIndicator={newWordIndicator}
              maxWordsCards={maxCards}
              words={words}
              word={word}
              setWord={newWord}
              index={index}
              setIndex={newIndex}
              onCorrect={correctCard}
              correct={correct}
              setUsersWord={newUsersWord}
              usersWord={usersWord}
              indexes={indexes}
              setIndexes={setIndexes}
              setAudioWord={newAudioWord}
              setAudioExample={newAudioExample}
              setAudioMeaning={newAudioMeaning}
              autoplay={autoplay}
              setAutoplay={controlAutoplay}
              inProp={inProp}
              setInProp={newInProp}
              transpAnswer={transpAnswer}
              setTranspAnswer={newTranspAnswer}
            />
            {(autoplay && correct) && (
              <AudioAutoplay
              renderWithSettings={settingsForCard}
                audioWord={audioWord}
                audioExample={audioExample}
                audioMeaning={audioMeaning}
              />
            )}
            <Buttons
            renderWithSettings={settingsForCard}
              initialWords={words}
              setNewWords={newWords}
              setNewMaxCards={newMaxCards}
              setProgress={newProgress}
              word={word}
              onCorrect={correctCard}
              setUsersWord={setUsersWord}
              usersWord={usersWord}
              correct={correct}
              setIndexes={setIndexes}
              index={index}
              setIndex={newIndex}
              audioWord={audioWord}
              audioExample={audioExample}
              audioMeaning={audioMeaning}
              inProp={inProp}
              setInProp={newInProp}
              transpAnswer={transpAnswer}
              setTranspAnswer={newTranspAnswer}
              visibleNot={visibleNotification}
              setVisibleNot={(visibleNot: boolean) => setVisibleNotification(visibleNot)}
              maxCards={maxCards}
              notification={Notification}
            />
          </div>
        ) : null}
    </div>
  );
}
/* eslint-enable */
export default LearnWords;
