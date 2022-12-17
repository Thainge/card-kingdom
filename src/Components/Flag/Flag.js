import React, { useState, useEffect } from 'react';
import styles from './Flag.module.css';
import { ContextFunction } from '../../Contexts/contextProvider';
import openClick from '../../Assets/sounds/starting/button.mp3';
import useSound from 'use-sound';
import Fade from 'react-reveal/Fade';
import Pulse from 'react-reveal/Pulse';

const FinishedFlagImg = require('../../Assets/MainMenu/FinishedFlag.png');
const FlagImg = require('../../Assets/MainMenu/Flag.png');

function FlagLogo({ item, openFlags }) {
    const obj = ContextFunction();
    const { deck } = obj;

    // Sound logic
    const [openButton] = useSound(openClick, { volume: .3 });

    // error message
    const [error, setError] = useState('');

    useEffect(() => {
        if (error.length > 1) {
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    }, [error])

    const startBattle = () => {
        if (deck.length > 3) {
            openFlags(item);
        } else {
            let string = 'Invalid deck length! 4 cards minimum.';
            setError(string)
        }
    }

    return (
        <>
            {
                error.length > 1
                    ? <Fade right delay={2} duration={500}>
                        <div className={styles.error} style={{ bottom: `${item.bottom - 4}em`, left: `${item.left - 10}em` }}>
                            {error}
                        </div>
                    </Fade> : <></>
            }
            {
                item.complete ?
                    <div
                        onClick={() => {
                            openButton();
                            startBattle()
                        }}
                        className={styles.flagContainer}
                        style={{ bottom: `${item.bottom}em`, left: `${item.left}em` }}
                    >
                        <img className={styles.flag} style={{ bottom: `${item.bottom}em`, left: `${item.left}em`, }} src={FinishedFlagImg} />
                    </div>
                    : <></>
            }
            {
                item.next ?
                    <div
                        onClick={() => {
                            openButton();
                            startBattle()
                        }}
                        className={styles.flagContainer2}
                        style={{ bottom: `${item.bottom}em`, left: `${item.left}em` }}
                    >
                        <Pulse forever duration={1200}>
                            <img className={styles.flag2} style={{ bottom: `${item.bottom}em`, left: `${item.left}em`, }} src={FlagImg} />
                        </Pulse>
                    </div>
                    : <></>
            }
        </>
    );
}

export default FlagLogo;