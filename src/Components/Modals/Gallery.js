import React, { useEffect, useState } from 'react';
import styles from './Gallery.module.css';
import backgroundImage from '../../Assets/MenuTabs/Gallery/book.png';
import CloseModalButton from '../../Components/closeButton/CloseButton';
import { ContextFunction } from '../../Contexts/contextProvider';
import flipCardSound from '../../Assets/sounds/starting/cardFlip.mp3';
import useSound from 'use-sound';
import TutorialModal from '../tutorial/tutorial';

const cardBack = require('../../Assets/cardBorder.png');
const attack = require('../../Assets/shield.png');
const health = require('../../Assets/heart.png');

function GalleryModal({ setIsOpen, isOpen }) {
    const obj = ContextFunction();
    const { cards, user, setUser } = obj;

    function closeModal() {
        setIsOpen(false);
    }

    const [cardFlip] = useSound(flipCardSound, { volume: 1 });

    let startingObj = {
        attack: 0,
        health: 0,
        image: '',
        backImage: '',
    }
    const [currentImg, setCurrentImg] = useState(startingObj);

    const [defaultCards, setDefaultCards] = useState([]);

    useEffect(() => {
        let newCards = cards;
        const sorted = [...newCards].sort((a, b) => b['owned'] - a['owned']);
        setDefaultCards(sorted);
        let firstCard = sorted[0];
        setCurrentImg(firstCard);
    }, [])

    useEffect(() => {
        let newCards = cards;
        const sorted = [...newCards].sort((a, b) => b['owned'] - a['owned']);
        setDefaultCards(sorted);
    }, [cards])

    let tutorialArr = [
        {
            text: 'Here you can view all of your collected cards!',
            top: '-50vh',
            left: '-30vw',
        },
    ]

    const [currentStep, setCurrentStep] = useState(0);
    const [readyToShow, setReadyToShow] = useState(false);

    useEffect(() => {
        if (user && isOpen && user.firstTimeGallery) {
            setCurrentStep(1);
            // Close modal forever now in user
            setUser((prevUser) => {
                let newUserObj = { ...prevUser, firstTimeGallery: false };
                return newUserObj;
            });

            setTimeout(() => {
                setReadyToShow(true);
            }, 500)
        }
    }, [isOpen]);

    const moveOnToNextStep = () => {
        if (currentStep < tutorialArr.length) {
            setCurrentStep((prevStep) => {
                let newStep = prevStep + 1;
                return newStep;
            });
        } else {
            setCurrentStep(0);
        }
    }

    return (
        <div className={styles.panel} onClick={e => e.stopPropagation()}>
            {
                tutorialArr.map((item, index) => (
                    <div key={index} className={currentStep === index + 1 ? styles.overlayModalTut : styles.fadeInOutTut}>
                        {currentStep === index + 1 && readyToShow ? <div onClick={moveOnToNextStep}><TutorialModal index={index + 1} item={item} /></div> : <></>}
                    </div>
                ))
            }
            <div className={styles.container} onClick={e => e.stopPropagation()} style={{ backgroundImage: "url(" + backgroundImage + ")" }}>
                <div className={styles.closeButton}>
                    <CloseModalButton closeModal={closeModal} />
                </div>
                <div className={styles.header1}>
                    <h1>Details</h1>
                </div>
                <div className={styles.header2}>
                    <h1>Gallery</h1>
                </div>
                <div className={styles.cardList}>
                    {
                        defaultCards.map((item, index) => {
                            return <div key={index}>
                                {
                                    item.owned
                                        ? <div onClick={() => {
                                            cardFlip();
                                            setCurrentImg(item);
                                        }} className={styles.cardBorder}>
                                            <img className={styles.card} src={cardBack}></img>
                                            <img className={styles.cardImage} src={item.backImage} />
                                        </div>
                                        : <div onClick={() => {
                                            cardFlip();
                                            setCurrentImg(item);
                                        }} className={`${styles.cardBorder} ${styles.disabledCardBorder}`}>
                                            <img className={styles.card} src={cardBack}></img>
                                            <img className={styles.cardImage} src={item.backImage} />
                                        </div>
                                }
                            </div>
                        })
                    }
                </div>
                <div className={styles.column}>
                    <div className={styles.bigCardBox}>
                        <div className={styles.cardBorder2}>
                            <img className={styles.card2} src={currentImg.backImage}></img>
                        </div>
                    </div>
                    <div className={styles.healthAttack}>
                        <div className={styles.relative}>
                            <img className={styles.attack} src={attack}></img>
                            <div className={currentImg.attack.toString().length !== 1 ? styles.attackTextBig : styles.attackText}>{currentImg.attack}</div>
                        </div>

                        <div className={styles.relative}>
                            <img className={styles.health} src={health}></img>
                            <div className={currentImg.health.toString().length !== 1 ? styles.healthTextBig : styles.healthText}>{currentImg.health}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GalleryModal;