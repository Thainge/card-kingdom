import { ContextFunction } from '../Contexts/contextProvider';

function UpgradesHook() {
    const obj = ContextFunction();
    const { user, setUser, cards, setCards, setDeck } = obj;

    // Resets all stars
    const ResetUpgrades = () => {
        let Green = user.upgrades.green;
        let Blue = user.upgrades.blue;
        let Yellow = user.upgrades.yellow;
        let Red = user.upgrades.red;

        let defaultGreen = ResetType(Green);
        let defaultBlue = ResetType(Blue);
        let defaultYellow = ResetType(Yellow);
        let defaultRed = ResetType(Red);

        let upgradesObj = {
            green: defaultGreen,
            blue: defaultBlue,
            yellow: defaultYellow,
            red: defaultRed,
        }

        resetEveryUpgrade();

        let resetStars = user.usedStars + user.stars;

        setUser((prevVal) => {
            let newObj = { ...prevVal, usedStars: 0, stars: resetStars, upgrades: upgradesObj }
            return newObj;
        });
    }

    const ResetType = (array) => {
        const returnedArr = [];
        array.forEach((item, index) => {
            if (index === array.length - 1) {
                let newVal = { ...item, bought: false, active: true }
                returnedArr.push(newVal);
            } else {
                let newVal = { ...item, bought: false, active: false }
                returnedArr.push(newVal);
            }
        });
        return returnedArr;
    }

    // loops through everything and resets everything to default values
    const resetEveryUpgrade = () => {
        setCards((prevVal) => {
            let newCards = [...prevVal];
            newCards.forEach((item, index) => {
                if (!item.legendary) {
                    let newHealth = item.vitalityUpgrade ? item.health - 1 : item.health;
                    let newAttack = item.strengthUpgrade ? item.attack - 1 : item.attack;
                    let newItem = {
                        ...item,
                        health: newHealth,
                        attack: newAttack,
                        orbUpgrade: false,
                        vitalityUpgrade: false,
                        strengthUpgrade: false,
                        blockUpgrade: false,
                        firstUpgrade: false,
                    };
                    newCards[index] = newItem;
                }
            });
            setDeck((prevVal) => {
                let currentDeck = [...prevVal];

                currentDeck.map((item, index) => {
                    let foundIndex = newCards.findIndex(x => x.id == item.id);
                    currentDeck[index] = newCards[foundIndex];
                });
                return currentDeck;
            });
            return newCards;
        })
    }

    // loops through each {COLOR} card and sets the orbUpgrade to true
    const OrbUpgrade = (color, boolVal) => {
        setCards((prevVal) => {
            let newCards = [...prevVal];
            newCards.forEach((item, index) => {
                if (item.color === color) {
                    let newItem = { ...item, orbUpgrade: boolVal };
                    newCards[index] = newItem;
                }
            });
            setDeck((prevVal) => {
                let currentDeck = [...prevVal];

                currentDeck.map((item, index) => {
                    let foundIndex = newCards.findIndex(x => x.id == item.id);
                    currentDeck[index] = newCards[foundIndex];
                });
                return currentDeck;
            });
            return newCards;
        });
    }

    // loops through each {COLOR} card, and sets the health to +1
    const VitalityUpgrade = (color, boolVal) => {
        setCards((prevVal) => {
            let newCards = [...prevVal];
            newCards.forEach((item, index) => {
                if (item.color === color) {
                    let newItem = { ...item, vitalityUpgrade: boolVal, health: item.health + 1 };
                    newCards[index] = newItem;
                }
            });
            setDeck((prevVal) => {
                let currentDeck = [...prevVal];

                currentDeck.map((item, index) => {
                    let foundIndex = newCards.findIndex(x => x.id == item.id);
                    currentDeck[index] = newCards[foundIndex];
                });
                return currentDeck;
            });
            return newCards;
        });
    }

    // loops through each {COLOR} card, and sets the attack to +1
    const StrengthUpgrade = (color, boolVal) => {
        setCards((prevVal) => {
            let newCards = [...prevVal];
            newCards.forEach((item, index) => {
                if (item.color === color) {
                    let newItem = { ...item, strengthUpgrade: boolVal, attack: item.attack + 1 };
                    newCards[index] = newItem;
                }
            });
            setDeck((prevVal) => {
                let currentDeck = [...prevVal];

                currentDeck.map((item, index) => {
                    let foundIndex = newCards.findIndex(x => x.id == item.id);
                    currentDeck[index] = newCards[foundIndex];
                });
                return currentDeck;
            });
            return newCards;
        });
    }

    // loops through each {COLOR} card and sets the firstUpgrade to true
    const FirstUpgrade = (color, boolVal) => {
        setCards((prevVal) => {
            let newCards = [...prevVal];
            newCards.forEach((item, index) => {
                if (item.color === color) {
                    let newItem = { ...item, firstUpgrade: boolVal, };
                    newCards[index] = newItem;
                }
            });
            setDeck((prevVal) => {
                let currentDeck = [...prevVal];

                currentDeck.map((item, index) => {
                    let foundIndex = newCards.findIndex(x => x.id == item.id);
                    currentDeck[index] = newCards[foundIndex];
                });
                return currentDeck;
            });
            return newCards;
        });
    }

    // loops through each {COLOR} card and sets the blockUpgrade to true
    const BlockUpgrade = (color, boolVal) => {
        setCards((prevVal) => {
            let newCards = [...prevVal];
            newCards.forEach((item, index) => {
                if (item.color === color) {
                    let newItem = { ...item, blockUpgrade: boolVal };
                    newCards[index] = newItem;
                }
            });
            setDeck((prevVal) => {
                let currentDeck = [...prevVal];

                currentDeck.map((item, index) => {
                    let foundIndex = newCards.findIndex(x => x.id == item.id);
                    currentDeck[index] = newCards[foundIndex];
                });
                return currentDeck;
            });
            return newCards;
        });
    }



    // Buys an upgrade and opens the next slot
    const BuyUpgrade = (value) => {
        let newValue = { ...value, bought: true, active: true, }
        let list = user.upgrades;

        if (value.type === 'green') {
            updateById(list.green, newValue, 'green');
        }

        if (value.type === 'blue') {
            updateById(list.blue, newValue, 'blue');
        }

        if (value.type === 'yellow') {
            updateById(list.yellow, newValue, 'yellow');
        }

        if (value.type === 'red') {
            updateById(list.red, newValue, 'red');
        }

        let newStars = user.stars - value.cost;
        let usedStars = user.usedStars + value.cost;
        setUser((prevVal) => {
            let newUser = { ...prevVal, stars: newStars, usedStars: usedStars };
            return newUser
        });

        let color = value.type;
        let functionType = value.functionType;
        if (functionType === 'block') {
            BlockUpgrade(color, true);
        }
        if (functionType === 'first') {
            FirstUpgrade(color, true);
        }
        if (functionType === 'strength') {
            StrengthUpgrade(color, true);
        }
        if (functionType === 'vitality') {
            VitalityUpgrade(color, true);
        }
        if (functionType === 'orb') {
            OrbUpgrade(color, true);
        }
    }

    const updateById = (upgradesList, newValue, string) => {
        let foundDeckIndex = upgradesList.findIndex(x => x.upgrade == newValue.upgrade);
        let nextIndex = foundDeckIndex - 1;

        upgradesList[foundDeckIndex] = newValue;

        if (nextIndex > -1) {
            upgradesList[nextIndex] = { ...upgradesList[nextIndex], active: true, }
        }

        let readyData = [...upgradesList];
        updateByType(string, readyData)
    }

    const updateByType = (type, data) => {
        if (type === 'green') {
            setUser((prevVal) => {
                let newList = {
                    ...prevVal, upgrades: { ...user.upgrades, green: data }
                }
                return newList
            });
        }
        if (type === 'blue') {
            setUser((prevVal) => {
                let newList = {
                    ...prevVal, upgrades: { ...user.upgrades, blue: data }
                }
                return newList
            });
        }
        if (type === 'yellow') {
            setUser((prevVal) => {
                let newList = {
                    ...prevVal, upgrades: { ...user.upgrades, yellow: data }
                }
                return newList
            });
        }
        if (type === 'red') {
            setUser((prevVal) => {
                let newList = {
                    ...prevVal, upgrades: { ...user.upgrades, red: data }
                }
                return newList
            });
        }
    }

    return {
        BuyUpgrade,
        ResetUpgrades,
    };
}

export default UpgradesHook;