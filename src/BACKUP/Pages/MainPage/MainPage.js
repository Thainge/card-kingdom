import React, { useEffect, useState } from 'react';
import styles from './MainPage.module.css';
import backgroundImg from '../../Assets/MainMenu/map.png';
import ButtonToggle from '../../Components/ButtonToggle/ButtonToggle';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import FlagLogo from '../../Components/Flag/Flag';
import GalleryModal from '../../Components/Modals/Gallery';
import SettingsModal from '../../Components/Modals/Settings';
import DeckModal from '../../Components/Modals/Deck';
import UpgradesModal from '../../Components/Modals/Upgrades';
import Loader from '../../Components/Loader/Loader';
import FlagModal from '../../Components/Modals/FlagModal';
import { ContextFunction } from '../../Contexts/contextProvider';
import ShopModal from '../../Components/Modals/Shop';
import openClick from '../../Assets/sounds/starting/open.mp3';
import useSound from 'use-sound';
import TutorialModal from '../../Components/tutorial/tutorial';

const normalDeck = require('./../../Assets/MainMenu/Deck.png');
const normalUpgrades = require('./../../Assets/MainMenu/Upgrades.png');
const normalGallery = require('./../../Assets/MainMenu/Gallery.png');
const normalOptions = require('./../../Assets/MainMenu/options.png');
const star = require('../../Assets/MainMenu/biggerstar.png');
const normalShop = require('../../Assets/MainMenu/shop.png')
const notificationImg = require('../../Assets/new.png');

function MainPage() {
    const obj = ContextFunction();
    const { user, cards, music, setMusic, muteIsActive, setUser } = obj;

    const flags = user.flags;

    // Sound logic
    const [openButton] = useSound(openClick, { volume: .5 });

    // Open Modals
    const [deckModalState, setDeckModalState] = useState(false);
    const openDeck = () => {
        setDeckModalState(true);
    }

    const [upgradesModalState, setUpgradesModalState] = useState(false);
    const openUpgrades = () => {
        setUpgradesModalState(true);
    }

    const [galleryModalState, setGalleryModalState] = useState(false);
    const openGallery = () => {
        setGalleryModalState(true);
    }

    const [settingsModalState, setSettingsModalState] = useState(false);
    const openSettings = () => {
        setSettingsModalState(true);
    }

    // Loading in
    const [loading, setLoading] = useState(true);

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    const stopLoading = async () => {
        await timeout(1000);
        setLoading(false);
    }

    // Open flag modal
    const [flagModalState, setFlagModalState] = useState(false);

    const startFlag = {
        'id': '',
        'complete': false,
        'next': false,
        'left': 0,
        'bottom': 0,
        'text': '',
        'max': 0,
        'min': 0,
    }

    const [currentFlag, setCurrentFlag] = useState(startFlag);

    const openFlags = (item) => {
        setFlagModalState(true);
        setCurrentFlag(item)
    }

    const [shopModalState, setShopModalState] = useState(false);

    const openShop = () => {
        setShopModalState(true);
    }

    const [newCards, setNewCards] = useState(false);

    useEffect(() => {
        let newCardsArr = [];
        cards.forEach((item, index) => {
            if (item.owned && item.new) {
                newCardsArr.push(item);
            }
        });
        if (newCardsArr.length > 0) {
            setNewCards(true);
        } else {
            setNewCards(false);
        }
    }, [cards]);

    const startMusic = () => {
        if (music.playingMusic1 === false && muteIsActive === false) {
            // Start music 1
            let newObj = {
                playingMusic1: true,
                playingMusic2: false,
            }
            // end music 2
            setMusic(newObj);
        }
    }

    let tutorialArr = [
        {
            text: 'Welcome to Card Kingdoms soldier!',
            top: '0',
            left: '0',
        },
        {
            text: 'We need to drive the enemy out of our land, and to do that, we are going to need your help!',
            top: '0',
            left: '0',
        },
        {
            text: 'To get started, go ahead and click on the red flag to start your first battle!',
            top: '0',
            left: '0',
        },
    ]

    useEffect(() => {
        if (music.playingMusic2) {
            startMusic();
        }

        if (user && user.firstTimeMenu) {
            setCurrentStep(1);
            // Close modal forever now in user
            setUser((prevUser) => {
                let newUserObj = { ...prevUser, firstTimeMenu: false };
                return newUserObj;
            });

            setTimeout(() => {
                setReadyToShow(true);
            }, 1500)
        }
    }, []);

    let totalStars = 0;
    if (user) {
        totalStars = user.flags.length * 3;
    }

    const [currentStep, setCurrentStep] = useState(0);
    const [readyToShow, setReadyToShow] = useState(false);
    const [finished, setFinished] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const moveOnToNextStep = () => {
        // if it is finished, move on to next step
        if (finished && currentStep < tutorialArr.length) {
            setFinished(() => false);
            setShowAll(() => false);
            setCurrentStep((prevStep) => {
                let newStep = prevStep + 1;
                return newStep;
            });
        } else if (!finished) {
            setFinished(() => true);
            setShowAll(() => true);
        } else {
            setFinished(false);
            setShowAll(false);
            setCurrentStep(0);
        }
    }

    return (
        <div className={styles.papa} onClick={startMusic}>
            {
                tutorialArr.map((item, index) => (
                    <div key={index} onClick={moveOnToNextStep} className={currentStep === index + 1 ? styles.overlayModalTut : styles.fadeInOutTut}>
                        {currentStep === index + 1 && readyToShow ? <TutorialModal setFinished={setFinished} showAll={showAll} index={index + 1} item={item} /> : <></>}
                    </div>
                ))
            }
            <Loader loading={loading} time={1000} />

            <TransformWrapper
                initialScale={.6}
                minScale={.6}
                maxScale={.6}
                doubleClick={{
                    disabled: true
                }}
                limitToBounds={true}
                panning={{
                    velocitySensitivity: 0,
                }}
                alignmentAnimation={{ sizeY: 0, sizeX: 0, velocityAlignmentTime: 0 }}
                velocityAnimation={{ sensitivity: 200, animationTime: 500, equalToMove: false }}
                initialPositionX={0}
                initialPositionY={-720}
            >
                <TransformComponent
                    wrapperStyle={{
                        width: "100vw",
                        height: "100vh",
                        position: "absolute",
                        zIndex: '1',
                    }}>

                    <img src={backgroundImg} className={styles.backgroundImage} onLoad={stopLoading}></img>
                    {
                        flags.map((item, index) => {
                            return <FlagLogo item={item} key={index} openFlags={openFlags} />
                        })
                    }
                </TransformComponent>
            </TransformWrapper>

            {/* Options top left */}
            <div className={styles.topLeft}>
                <ButtonToggle initialState={normalOptions} options={true} setModal={openSettings} />
            </div>

            {/* Progress top right*/}
            <div className={styles.topRight}>
                <div className={styles.imageContainer}>
                    <img className={styles.progress} src={require('../../Assets/MainMenu/Progress.png')}></img>
                    <div className={styles.center}><div className={(user.stars + user.usedStars) > 100 ? styles.text2B : (user.stars + user.usedStars) > 10 ? styles.text2A : styles.text2}>{user.stars + user.usedStars} / {totalStars}</div> <img className={styles.star} src={require('../../Assets/MainMenu/star.png')}></img></div>
                </div>
            </div>

            <div className={styles.topRightUnder}>
                <div className={styles.imageContainer}>
                    <img className={styles.progress} src={require('../../Assets/MainMenu/Progress.png')}></img>
                    <div className={styles.center2}>
                        <div className={styles.text}>{user.diamonds}</div>
                    </div>
                    <img className={styles.diamond} src={require('../../Assets/diamond.png')}></img>
                </div>
            </div>

            {/* Buttons bottom right */}
            <div className={styles.overlay}>
                <div className={styles.menuFlex}>
                    <div className={styles.deck} onClick={openDeck}>
                        {
                            newCards
                                ? <div className={styles.biggerContainer}>
                                    <img className={`${styles.biggerStar} ${styles.notificationImg2}`} src={notificationImg}></img>
                                </div>
                                : <></>
                        }
                        <ButtonToggle initialState={normalDeck} setModal={openDeck} />
                    </div>
                    <div className={styles.upgrades} onClick={() => {
                        openButton();
                        openUpgrades();
                    }}>
                        {
                            user.stars > 0
                                ? <div className={styles.biggerContainer}>
                                    <img className={styles.biggerStar} src={star}></img>
                                    <div className={styles.biggerText}>{user.stars}</div>
                                </div>
                                : <></>
                        }
                        <img className={styles.button} src={normalUpgrades}></img>
                    </div>
                    <div className={styles.gallery}>
                        <ButtonToggle initialState={normalGallery} setModal={openGallery} />
                    </div>
                    <div className={styles.shop}>
                        <ButtonToggle initialState={normalShop} setModal={openShop} />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <div className={galleryModalState ? styles.overlayModal : styles.fadeInOut} onClick={() => setGalleryModalState(false)}>
                <GalleryModal setIsOpen={setGalleryModalState} isOpen={galleryModalState} />
            </div>

            <div className={deckModalState ? styles.overlayModal : styles.fadeInOut} onClick={() => setDeckModalState(false)}>
                <DeckModal setIsOpen={setDeckModalState} isOpen={deckModalState} />
            </div>

            <div className={upgradesModalState ? styles.overlayModal : styles.fadeInOut} onClick={() => setUpgradesModalState(false)}>
                <UpgradesModal setIsOpen={setUpgradesModalState} isOpen={upgradesModalState} />
            </div>

            <div className={settingsModalState ? styles.overlayModal : styles.fadeInOut} onClick={() => setSettingsModalState(false)}>
                <SettingsModal setIsOpen={setSettingsModalState} />
            </div>

            <div className={flagModalState ? styles.overlayModal : styles.fadeInOut} onClick={() => {
                setFlagModalState(false)
            }}>
                <FlagModal setIsOpen={setFlagModalState} item={currentFlag} />
            </div>
            <div className={shopModalState ? styles.overlayModal : styles.fadeInOut} onClick={() => setShopModalState(false)}>
                <ShopModal setIsOpen={setShopModalState} isOpen={shopModalState} />
            </div>
        </div >
    );
}

export default MainPage;