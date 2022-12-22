import React, { useState } from 'react';
import styles from './CardAnimation.module.css';
import Zoom from 'react-reveal/Zoom';
import Spin from 'react-reveal/Spin';
import Fade from 'react-reveal/Fade';
import CardInsideAnimation from './CardInsideAnimation';
import flipCardSound from '../../Assets/sounds/starting/cardFlip.mp3';
import openCardSound from '../../Assets/sounds/starting/cardOpen.mp3';
import useSound from 'use-sound';

function CardAnimation({ setIsOpen, item, cards }) {
    const [cardFlip] = useSound(flipCardSound, { volume: .3 });
    const [cardOpen] = useSound(openCardSound, { volume: .22 });

    const StartAnimation = () => {
        setStarted(true);
        setStartZoom(true)
        cardFlip();

        // reset
        setTimeout(() => {
            cardOpen();
            setSecondAnimation(true)
        }, [600])

        setTimeout(() => {
            setFinished(true)
        }, [1800])
    }

    const [started, setStarted] = useState(false);
    const [startZoom, setStartZoom] = useState(false);
    const [secondAnimation, setSecondAnimation] = useState(false);
    const [finished, setFinished] = useState(false);

    const closeModal = () => {
        if (finished) {
            setIsOpen(false);
            setStarted(false);
            setStartZoom(false);
            setSecondAnimation(false);
            setFinished(false);
        }
    }

    return (
        <div
            className={secondAnimation ? styles.all : styles.none}
            onClick={closeModal}
        >
            {/* Onclick starts animation */}
            {!started
                ? <Fade distance={'5em'} up><img onClick={StartAnimation} className={styles.boosterPack} src={item.unlockedBG}></img></Fade>
                : <></>}

            {/* spin and zoom in card */}
            <Spin duration={600} when={startZoom}>
                <Zoom opposite duration={800} when={!startZoom}>
                    {started
                        ? <img className={styles.booster} src={item.unlockedBG}></img>
                        : <></>
                    }
                </Zoom>
            </Spin>

            {/* Pop up cards one at a time */}
            {
                secondAnimation
                    ? <div className={styles.cards}>
                        {
                            cards.map((item, index) => (
                                <div key={index}>
                                    <CardInsideAnimation item={item} index={index} />
                                </div>
                            ))
                        }
                    </div>
                    : <></>
            }
        </div >
    )
}

export default CardAnimation;