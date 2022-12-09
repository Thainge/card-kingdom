import React, { useEffect, useReducer, useState } from 'react';
import styles from './Shop.module.css';
import { ContextFunction } from '../../Contexts/contextProvider';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import CardAnimation from '../CardAnimation/CardAnimation'
import backgroundImage1 from '../../Assets/MenuTabs/Deck/back1.png';
import backgroundImage2 from '../../Assets/shopWall.png';
import ShopBox from '../ShopBox/ShopBox';
import buttonSound from '../../Assets/sounds/starting/button.mp3';
import buttonCloseSound from '../../Assets/sounds/starting/close.mp3';
import buttonBuySound from '../../Assets/sounds/starting/buyItem.mp3';
import useSound from 'use-sound';
import TutorialModal from '../tutorial/tutorial';

const close = require('../../Assets/MainMenu/close.png');
const closeActive = require('../../Assets/MainMenu/closeActive.png');

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function ShopModal({ setIsOpen, isOpen }) {
    const obj = ContextFunction();
    const { user, setUser, cards, setCards } = obj;

    const [closeButton] = useSound(buttonCloseSound, { volume: .5 });
    const [soundButton] = useSound(buttonSound, { volume: .5 });
    const [buyButton] = useSound(buttonBuySound, { volume: .1 });

    const [cardAnimationState, setCardAnimatonState] = useState(false);
    const [currentCards, setCurrentCards] = useState([]);

    function closeModal() {
        setIsOpen(false);
    }

    const [state, setState] = useState(close);

    const setStateFunction = (value) => {
        const newVal = value;
        setState(newVal);
    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentItem, setCurrentItem] = useState(user.packs[0])

    useEffect(() => {
        let newItem = user.packs[currentIndex];
        setCurrentItem(newItem);
    }, [currentIndex])

    // Buys a booster pack
    const buyBoosterPack = () => {
        let item = currentItem;
        let newDiamonds = user.diamonds - item.cost;

        if (user.diamonds >= item.cost) {
            let newCards = [];

            cards.forEach(element => {
                if (element.color === item.id && element.owned === false) {
                    newCards.push(element);
                }
            });

            let readyForShuffle = [];

            newCards.forEach(element => {
                if (element.legendary) {
                    const val1 = 50 - newCards.length;
                    const val2 = val1 / 100
                    const randomBool = Math.random() < val2 ? true : false;
                    if (randomBool) {
                        readyForShuffle.push(element);
                    } else if (newCards.length < 4) {
                        readyForShuffle.push(element);
                    }
                } else {
                    readyForShuffle.push(element)
                }
            })

            let shuffledCards = shuffle(readyForShuffle);

            let NewCardList = [
                shuffledCards[0],
                shuffledCards[1],
                shuffledCards[2]
            ]

            if (NewCardList[0]) {
                // start animation
                setCurrentCards(NewCardList);
                setCardAnimatonState(true);

                let newCardsArray = [...cards];

                try {
                    NewCardList.forEach((item) => {
                        let foundIndex = cards.findIndex(x => x.id == item.id);
                        let newItem = { ...item, owned: true };
                        newCardsArray[foundIndex] = newItem;
                    })
                } catch (err) {

                }
                setCards(newCardsArray);

                let testCards = [];

                newCardsArray.forEach(element => {
                    if (element.color === item.id && element.owned === false) {
                        testCards.push(element);
                    }
                });

                if (testCards.length < 1) {
                    let newUserObj = { ...user, [`Done${item.id}`]: true };
                    let readyObj = { ...newUserObj, diamonds: newDiamonds }
                    setUser(readyObj);
                } else if (!user[`Done${item.id}`]) {
                    let readyObj = { ...user, diamonds: newDiamonds }
                    setUser(readyObj);
                }
            }
        }
    }

    let tutorialArr = [
        {
            text: 'Welcome to the shop! Here you can buy cards to help you on your adventure!',
            top: '-50vh',
            left: '-30vw',
        },
        {
            text: 'A card pack will give you 3 cards of whichever booster pack you buy!',
            top: '-50vh',
            left: '-30vw',
        },
        {
            text: 'You will also be able to unlock new booster packs as you beat bosses!',
            top: '-50vh',
            left: '-30vw',
        },
        {
            text: 'On the right side you can also buy unique upgrades to assist you in combat!',
            top: '-55vh',
            left: '30vw',
        },
    ]

    const [currentStep, setCurrentStep] = useState(0);
    const [readyToShow, setReadyToShow] = useState(false);

    useEffect(() => {
        if (user && isOpen && user.firstTimeShop) {
            setCurrentStep(1);
            // Close modal forever now in user
            setUser((prevUser) => {
                let newUserObj = { ...prevUser, firstTimeShop: false };
                return newUserObj;
            });

            setTimeout(() => {
                setReadyToShow(true);
            }, 500)
        }
    }, [isOpen]);

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
            setCurrentStep(5);
        }
    }

    return (
        <div className={styles.panel} onClick={e => e.stopPropagation()}>
            {
                tutorialArr.map((item, index) => (
                    <div key={index} onClick={moveOnToNextStep} className={currentStep === index + 1 ? styles.overlayModalTut : styles.fadeInOutTut}>
                        {currentStep === index + 1 && readyToShow ? <TutorialModal setFinished={setFinished} showAll={showAll} index={index + 1} item={item} /> : <></>}
                    </div>
                ))
            }
            <div className={styles.container} onClick={e => e.stopPropagation()}>
                <div className={styles.closeButton}>
                    <img src={state}
                        className={styles.close3}
                        onMouseDown={() => setStateFunction(closeActive)}
                        onMouseUp={() => setStateFunction(closeActive)}
                        onMouseOut={() => setStateFunction(closeActive)}
                        onMouseOver={() => setStateFunction(closeActive)}
                        onMouseLeave={() => setStateFunction(close)}
                        onClick={() => {
                            closeButton();
                            closeModal();
                        }}>
                    </img>
                </div>
                <div className={styles.shopDiamonds}>
                    <div className={styles.textDiamond}>
                        <img className={styles.diamondsAmount} src={require('../../Assets/diamond.png')}></img>
                        {user.diamonds}
                    </div>
                    <img className={styles.btn1} src={require('../../Assets/MainMenu/starBG.png')}></img>
                </div>
                <div className={styles.Header}>
                    <h1 className={styles.shop}>Shop</h1>
                </div>
                <div className={styles.shopContainer}>
                    <img src={backgroundImage1} className={styles.backgroundImage} />

                    {/* Right side */}
                    <div className={styles.leftSide}>
                        <img src={backgroundImage2} className={styles.backgroundImage2} />
                        <div className={styles.specialGrid}>
                            {
                                user.special.map((item, index) => (
                                    <ShopBox key={index} item={item} index={index} />
                                ))
                            }
                        </div>
                    </div>

                    {/* Left side */}
                    <div className={styles.rightSide}>
                        <img src={backgroundImage2} className={styles.backgroundImage2} />
                        <div className={styles.swiper}>
                            <Carousel
                                className={styles.carousel}
                                dynamicHeight={true}
                                infiniteLoop={true}
                                showArrows={true}
                                showIndicators={false}
                                showStatus={false}
                                showThumbs={false}
                                onChange={(index) => setCurrentIndex(index)}
                                renderArrowNext={(onClickHandler, hasNext) =>
                                    hasNext && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                soundButton();
                                                onClickHandler();
                                            }}
                                            className={styles.arrowRight}
                                        >
                                            <img className={styles.arrow} src={require('../../Assets/arrowRight.png')}></img>
                                        </button>
                                    )
                                }
                                renderArrowPrev={(onClickHandler, hasPrev) =>
                                    hasPrev && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                soundButton();
                                                onClickHandler();
                                            }}
                                            className={styles.arrowsLeft}
                                        >
                                            <img className={styles.arrow} src={require('../../Assets/arrowLeft.png')}></img>
                                        </button>
                                    )
                                }
                            >
                                {
                                    user.packs.map((item, index) => (
                                        <div key={index}>
                                            {
                                                user[`Done${item.id}`]
                                                    ? <div className={styles.relative}>
                                                        <img src={item.unlockedBG} />
                                                        <div className={styles.backgroundGreen1}>
                                                            <img className={styles.check1} src={require('../../Assets/check.png')}></img>
                                                        </div>
                                                    </div>
                                                    : <img src={item.unlocked ? item.unlockedBG : item.lockedBG} className={item.unlocked ? styles.nothing : styles.cardDim} />
                                            }
                                        </div>
                                    ))
                                }
                            </Carousel>
                        </div>
                        <div className={`${styles.titleText} ${currentItem.unlocked ? styles.nothing : styles.titleTextDisabled}`}>
                            <div className={styles.backgroundText}>{currentItem.name}</div>
                        </div>
                        <div className={styles.spannedButtons}>
                            <div className={`${styles.overlayBtnText} ${currentItem.unlocked ? styles.nothing : styles.buttonDisabled}`} onMouseDownCapture={() => {
                                buyButton();
                                buyBoosterPack();
                            }}>
                                <div className={styles.text}>
                                    {
                                        user[`Done${currentItem.id}`]
                                            ? <div className={styles.sold}>SOLD OUT</div>
                                            : <>
                                                <img className={styles.diamond} src={require('../../Assets/diamond.png')}></img>
                                                <div>{currentItem.cost}</div>
                                            </>
                                    }
                                </div>
                                <img className={styles.btn2} src={require('../../Assets/MainMenu/button.png')}></img>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cardAnimationState ? styles.overlayModal : styles.fadeInOut}>
                    <CardAnimation setIsOpen={setCardAnimatonState} item={currentItem} cards={currentCards} />
                </div>
            </div>
        </div >
    );
}

export default ShopModal;