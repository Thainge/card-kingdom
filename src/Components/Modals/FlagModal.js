import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../../Assets/mission.png';
import CloseModalButton from '../../Components/closeButton/CloseButton';
import styles from './FlagModal.module.css';
import ReactFitText from 'react-fittext';
import buttonBattleSound from '../../Assets/sounds/starting/battleStart.mp3';
import useSound from 'use-sound';
import { ContextFunction } from '../../Contexts/contextProvider';

function FlagModal({ setIsOpen, item }) {
    const obj = ContextFunction();
    const { music, setMusic } = obj;
    const { min, max, text } = item;

    const [battleButton] = useSound(buttonBattleSound, { volume: .4 });

    function closeModal() {
        setIsOpen(false);
    }

    const startMusic = () => {
        if (music.playingMusic2 === false) {
            // Start music 2
            let newObj = {
                playingMusic1: false,
                playingMusic2: true,
            }
            // end music 1
            setMusic(newObj);
        }
    }

    let image = false;

    return (
        <div className={styles.panel} onClick={e => e.stopPropagation()}>
            <div className={styles.container} onClick={e => e.stopPropagation()} style={{ backgroundImage: "url(" + backgroundImage + ")" }}>
                <div className={styles.closeButton}>
                    <CloseModalButton closeModal={closeModal} smaller={true} />
                    <Link className={styles.toBattle} onClick={() => {
                        battleButton();
                        startMusic();
                    }} to={'/battle'} state={item}>
                        <img className={styles.toBattleButton} src={require('../../Assets/startBattle.png')}></img>
                    </Link>
                </div>
                <div className={styles.header1}>
                    <h1 className={styles.headerColor}>Objective</h1>
                </div>
                <div className={styles.header2}>
                    <h1 className={styles.headerColor}>Rewards</h1>
                </div>
                {
                    image
                        ? <div className={styles.information}>
                            <img className={styles.cardInfo} src={require('../../Assets/cardBack.png')}></img>
                            <h1 className={`${styles.starsTextTitle} ${styles.dText2}`}>
                                Stars
                            </h1>
                            <ReactFitText>
                                <div className={`${styles.diamondBox3} ${styles.dBox1}`}>
                                    <img className={styles.diamond} src={require('../../Assets/diamond.png')}></img>
                                    <div className={styles.diamondText}>{min} - 199</div>
                                </div>
                            </ReactFitText>
                            <h1 className={`${styles.diamondsTextTitle} ${styles.dText1}`}>
                                Diamonds
                            </h1>
                            <ReactFitText>
                                <div className={`${styles.diamondBox2} ${styles.dBox2}`}>
                                    <img className={styles.star} src={require('../../Assets/MainMenu/biggerstar.png')}></img>
                                    <div className={styles.diamondText}>3</div>
                                </div>
                            </ReactFitText>
                        </div>
                        : <div className={styles.information}>
                            <h1 className={styles.starsTextTitle}>
                                Stars
                            </h1>
                            <ReactFitText>
                                <div className={styles.diamondBox3}>
                                    <img className={styles.diamond} src={require('../../Assets/diamond.png')}></img>
                                    <div className={styles.diamondText}>{min} - {max}</div>

                                </div>
                            </ReactFitText>
                            <h1 className={styles.diamondsTextTitle}>
                                Diamonds
                            </h1>
                            <ReactFitText>
                                <div className={styles.diamondBox2}>
                                    <img className={styles.diamond} src={require('../../Assets/MainMenu/star.png')}></img>
                                    <div className={styles.diamondText}>3</div>
                                </div>
                            </ReactFitText>
                        </div>
                }
                <div className={styles.column}>
                    <div className={styles.textBoxContainer}>
                        <div className={styles.castleBox}>
                            <img className={styles.castle} src={require('../../Assets/castle.png')}></img>
                            <div className={styles.singleLetter}>{text.slice(0, 1)}</div>
                        </div>
                        <div className={styles.p}>{text.slice(1, text.length)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FlagModal;