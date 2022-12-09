import React, { useEffect, useState } from 'react';
import styles from './Upgrades.module.css';
import backgroundImage from '../../Assets/MainMenu/Menu.png'
import CloseModalButton from '../../Components/closeButton/CloseButton';
import { ContextFunction } from '../../Contexts/contextProvider';
import UpgradesHook from '../../Hooks/upgradesHook';
import UpgradeItem from '../UpgradeItem/UpgradeItem';
import greenUpgrade from '../../Assets/Upgrades/greenUpgrade.png';
import blueUpgrade from '../../Assets/Upgrades/blueUpgrade.png';
import yellowUpgrade from '../../Assets/Upgrades/yellowUpgrade.png';
import redUpgrade from '../../Assets/Upgrades/redUpgrade.png';
import buttonSound from '../../Assets/sounds/starting/button.mp3';
import buttonCloseSound from '../../Assets/sounds/starting/close.mp3';
import useSound from 'use-sound';
import TutorialModal from '../tutorial/tutorial';

function UpgradesModal({ setIsOpen, isOpen }) {
    const obj = ContextFunction();
    const { user, setUser } = obj;

    const [soundButton] = useSound(buttonSound, { volume: .5 });
    const [closeButton] = useSound(buttonCloseSound, { volume: .5 });

    const {
        ResetUpgrades,
    } = UpgradesHook();


    // Closes open modal
    function closeModal() {
        setIsOpen(false);
    }

    // On load, get upgrade data
    const [upgradesData, setUpgradesData] = useState(user.upgrades);

    useEffect(() => {
        setUpgradesData(user.upgrades)
    }, [user.upgrades])

    let tutorialArr = [
        {
            text: 'This is the forge room, here you can buy upgrades to help you in your fights!',
            top: '-50vh',
            left: '-30vw',
        },
        {
            text: 'Each column is related to the color of the card it benefits, the first column will buff green cards, the second will buff blue cards, and so on.',
            top: '-50vh',
            left: '-30vw',
        },
    ]

    const [currentStep, setCurrentStep] = useState(0);
    const [readyToShow, setReadyToShow] = useState(false);

    useEffect(() => {
        if (user && isOpen && user.firstTimeUpgrades) {
            setCurrentStep(1);
            // Close modal forever now in user
            setUser((prevUser) => {
                let newUserObj = { ...prevUser, firstTimeUpgrades: false };
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
            setCurrentStep(0);
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
            <div className={styles.container} onClick={e => e.stopPropagation()} style={{ backgroundImage: "url(" + backgroundImage + ")" }} >
                <div className={styles.closeButton}>
                    <CloseModalButton closeModal={closeModal} small={true} />
                </div>
                <div className={styles.Header}>
                    <h1>Upgrades</h1>
                </div>
                <div className={styles.FooterButtons}>
                    <div className={styles.seperator1}>
                        <div className={styles.overlayBtnText2}>
                            <div className={styles.textStar}>
                                <img className={styles.star} src={require('../../Assets/MainMenu/star.png')}></img>
                                {user.stars}
                            </div>
                            <img className={styles.btn1} src={require('../../Assets/MainMenu/starBG.png')}></img>
                        </div>
                        <div className={styles.overlayBtnText} onMouseDownCapture={() => {
                            soundButton();
                            ResetUpgrades();
                        }}>
                            <div className={styles.text}>Reset</div>
                            <img className={styles.btn2} src={require('../../Assets/MainMenu/button.png')}></img>
                        </div>
                    </div>
                    <div className={styles.seperator2}>
                        <div className={styles.overlayBtnText} onMouseDownCapture={() => {
                            closeButton();
                            closeModal();
                        }}>
                            <div className={`${styles.text} ${styles.text2}`}>Done</div>
                            <img className={styles.btn4} src={require('../../Assets/MainMenu/button.png')}></img>
                        </div>
                    </div>
                </div>
                <div className={styles.upgradesBox}>
                    <div className={styles.backgroundColumn}>
                        <UpgradeItem columnData={upgradesData.green} givenImage={greenUpgrade} />
                    </div>
                    <div className={styles.backgroundColumn}>
                        <UpgradeItem columnData={upgradesData.blue} givenImage={blueUpgrade} />
                    </div>
                    <div className={styles.backgroundColumn}>
                        <UpgradeItem columnData={upgradesData.yellow} givenImage={yellowUpgrade} />
                    </div>
                    <div className={styles.backgroundColumn}>
                        <UpgradeItem columnData={upgradesData.red} givenImage={redUpgrade} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpgradesModal;