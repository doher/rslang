import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { storeGame } from '../storeGame';
import { ItemTypes } from './ItemTypes';

function Word(props) {
  const gameState = useContext(storeGame);
  const dispatchGame = gameState.dispatch;
  const stateGame = gameState.state;
  const rightLength = stateGame.currentSentence.length;
  const [checkClass, setCheckClass] = useState('');
  const classes = `word ${props.guessWord ? 'guess__word' : ''}`;
  const [style, setStyle] = useState({});
  const [styleClip, setStyleClip] = useState({});
  const ref = useRef(null);
  const { id } = props;
  const [index, setIndex] = useState(props.index);
  const { moveWord } = props;
  const [bg, setBg] = useState(false);

  useEffect(() => {
    setBg(stateGame.roundImage);
  }, [stateGame.roundImage]);

  useEffect(() => {
    setIndex(props.index);
  }, [props.index]);
  function handleClick(value) {
    if (!props.buildingWord && !props.guessWord) return;
    if (props.buildingWord && stateGame.sentenceHasMistake === false) return;
    // false because null is when "Check" not clicked
    //
    const guessSentence = [...stateGame.guessSentence];
    const buildingSentence = [...stateGame.buildingSentence];
    if (props.guessWord) {
      guessSentence.splice(props.index, 1);
      buildingSentence.push(value);
    } else {
      buildingSentence.splice(props.index, 1);
      guessSentence.push(value);
    }
    dispatchGame({ type: 'buildingSentence', value: buildingSentence });
    dispatchGame({ type: 'guessSentence', value: guessSentence });
    dispatchGame({ type: 'checkReady', value: buildingSentence.length === rightLength });
  }

  useEffect(() => {
    const width = props.value ? props.value.text.length / props.sentenceWidth * 850 : 0;
    let offset = 0;
    if (!props.buildingWord) {
      offset = props.offset ? props.offset[props.sentence.indexOf(props.value)] : 0;
    } else {
      stateGame.currentSentence.forEach((word, i) => {
        if (word.text === props.value.text && word.id === props.value.id) {
          offset = props.offset[i];
        }
      });
    }
    const offsetWidth = (offset * 850).toFixed(0);
    const index = !props.guessWord ? props.sentenceIndex : (9 - stateGame.currWordIndex);
    let styles = {
      width: `${(width).toFixed(1)}px`,
      backgroundImage: `url(${bg.imageSrc})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '850px 460px',
      backgroundPosition: `-${offsetWidth}px -${index * 46}px`,
    };
    const offsetForCircle = (width + offset * 850) <= 830 ? (width + offset * 850) : 830;
    let stylesClip = {
      backgroundImage: `url(${bg.imageSrc})`,
      backgroundSize: '850px 460px',
      backgroundPosition: `-${(offsetForCircle).toFixed(0)}px ${-5 + index * -46}px`,
    };
    if (!stateGame.hints.imageHint && (props.guessWord || props.buildingWord)
        && (!stateGame.readyToContinue && (props.buildingWord || props.guessWord))) {
      styles = {
        ...styles,
        backgroundImage: 'none',
        backgroundPosition: 'none',
      };
      stylesClip = {
        ...stylesClip,
        backgroundImage: 'none',
        backgroundPosition: 'none',
      };
    }
    setStyle(styles);
    setStyleClip(stylesClip);
  }, [props.value, props.sentenceWidth, props.sentenceIndex, props.guessWord,
    stateGame.currWordIndex, props.offset, props.sentence, stateGame.hints.imageHint,
    props.buildingWord, stateGame.currentSentence, stateGame.readyToContinue, bg.imageSrc]);

  useEffect(() => {
    if (!props.mistake) setCheckClass('');
    else setCheckClass(`${props.mistake}-word`);
  }, [props.mistake]);

  const canDrop = !props.canDrop ? (item, monitor) => {} : undefined;
  const canDrag = !props.canDrag ? (monitor) => {} : undefined;

  const [, drop] = useDrop({
    accept: ItemTypes.WORD,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      const { sentenceIndex } = item;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }
      // Time to actually perform the action
      // console.log(id, index, ref.current.innerHTML,item);
      console.log(dragIndex, hoverIndex, sentenceIndex);
      moveWord(dragIndex, hoverIndex, sentenceIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
      console.log(item);
    },
    canDrop,
  });
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: ItemTypes.WORD, id, index, sentenceIndex: props.sentenceIndex,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag,
    end(item, monitor) {
      const res = monitor.getDropResult();
      if (!res) return;
      if (res.changedLine) {
        // console.log(monitor.getDropResult().changedLine);
        // removeWord(item.index);
        console.log(props.value);
        handleClick(props.value);
      }
    },
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <span
      className={`${classes} ${checkClass} ${isDragging ? 'dragging' : ''}`}
      onClick={() => handleClick(props.value)}
      style={{ ...style, opacity }}
      ref={ref}
      data-p={index}
    >
      <span><span>{props.value.text}</span></span>
      <svg className="svg">
        <clipPath id="my-clip-path" clipPathUnits="objectBoundingBox"><path d="M0,0 C1,0,1,1,0,1" /></clipPath>
      </svg>
      <div className="clipped" style={{ ...styleClip, opacity }} />
      <div className={`clipped2 ${checkClass}`} style={{ opacity }} />
    </span>
  );
}

export default Word;
