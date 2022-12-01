const UpgradesData = {
    green: [
        {
            functionType: 'orb',
            type: 'green',
            upgrade: 'green1',
            bought: false,
            active: false,
            title: 'Forest Orb',
            text: 'All green cards gain Heal 1',
            cost: 7
        },
        {
            functionType: 'vitality',
            type: 'green',
            upgrade: 'green2',
            bought: false,
            active: false,
            title: 'Forest Shield',
            text: 'All green cards gains 0/+1',
            backgroundImage: require('../Assets/Upgrades/greenShield.png'),
            cost: 5
        },
        {
            functionType: 'strength',
            type: 'green',
            upgrade: 'green3',
            bought: false,
            active: false,
            title: 'Forest Swords',
            text: 'All green cards gain +1/0',
            backgroundImage: require('../Assets/Upgrades/greenSword.png'),
            cost: 5
        },
        {
            functionType: 'first',
            type: 'green',
            upgrade: 'green4',
            bought: false,
            active: false,
            title: 'Forest Potion',
            text: 'The first green card played each game gains +1/+1.',
            backgroundImage: require('../Assets/Upgrades/greenPotion.png'),
            cost: 3
        },
        {
            functionType: 'block',
            type: 'green',
            upgrade: 'green5',
            bought: false,
            active: true,
            title: 'Forest Armor',
            text: 'The first green card played each game gains Block 1.',
            backgroundImage: require('../Assets/Upgrades/greenBoth.png'),
            cost: 3
        },
    ],
    blue: [
        {
            functionType: 'orb',
            type: 'blue',
            upgrade: 'blue1',
            bought: false,
            active: false,
            title: 'Frozen Orb',
            text: 'All blue cards gain Frostbite 1',
            backgroundImage: require('../Assets/Upgrades/blueOrb.png'),
            cost: 7
        },
        {
            functionType: 'vitality',
            type: 'blue',
            upgrade: 'blue2',
            bought: false,
            active: false,
            title: 'Frozen Shield',
            text: 'All blue cards gains 0/+1',
            backgroundImage: require('../Assets/Upgrades/blueShield.png'),
            cost: 5
        },
        {
            functionType: 'strength',
            type: 'blue',
            upgrade: 'blue3',
            bought: false,
            active: false,
            title: 'Frozen Swords',
            text: 'All blue cards gain +1/0',
            backgroundImage: require('../Assets/Upgrades/blueSword.png'),
            cost: 5
        },
        {
            functionType: 'first',
            type: 'blue',
            upgrade: 'blue4',
            bought: false,
            active: false,
            title: 'Frozen Potion',
            text: 'The first blue card played each game gains +1/+1.',
            backgroundImage: require('../Assets/Upgrades/bluePotion.png'),
            cost: 3
        },
        {
            functionType: 'block',
            type: 'blue',
            upgrade: 'blue5',
            bought: false,
            active: true,
            title: 'Frozen Armor',
            text: 'The first blue card played each game gains Block 1.',
            backgroundImage: require('../Assets/Upgrades/blueBoth.png'),
            cost: 3
        },
    ],
    yellow: [
        {
            functionType: 'orb',
            type: 'yellow',
            upgrade: 'yellow1',
            bought: false,
            active: false,
            title: 'Desert Orb',
            text: 'All yellow cards gain Haste 1',
            backgroundImage: require('../Assets/Upgrades/yellowOrb.png'),
            cost: 7
        },
        {
            functionType: 'vitality',
            type: 'yellow',
            upgrade: 'yellow2',
            bought: false,
            active: false,
            title: 'Desert Shield',
            text: 'All yellow cards gains 0/+1',
            backgroundImage: require('../Assets/Upgrades/yellowShield.png'),
            cost: 5
        },
        {
            functionType: 'strength',
            type: 'yellow',
            upgrade: 'yellow3',
            bought: false,
            active: false,
            title: 'Desert Swords',
            text: 'All yellow cards gain +1/0',
            backgroundImage: require('../Assets/Upgrades/yellowSword.png'),
            cost: 5
        },
        {
            functionType: 'first',
            type: 'yellow',
            upgrade: 'yellow4',
            bought: false,
            active: false,
            title: 'Desert Potion',
            text: 'The first yellow card played each game gains +1/+1.',
            backgroundImage: require('../Assets/Upgrades/yellowPotion.png'),
            cost: 3
        },
        {
            functionType: 'block',
            type: 'yellow',
            upgrade: 'yellow5',
            bought: false,
            active: true,
            title: 'Desert Armor',
            text: 'The first yellow card played each game gains Block 1.',
            backgroundImage: require('../Assets/Upgrades/yellowBoth.png'),
            cost: 3
        },
    ],
    red: [
        {
            functionType: 'orb',
            type: 'red',
            upgrade: 'red1',
            bought: false,
            active: false,
            title: 'Fire Orb',
            text: 'All red cards gain Burn 1',
            backgroundImage: require('../Assets/Upgrades/redOrb.png'),
            cost: 7
        },
        {
            functionType: 'vitality',
            type: 'red',
            upgrade: 'red2',
            bought: false,
            active: false,
            title: 'Fire Shield',
            text: 'All red cards gains 0/+1',
            backgroundImage: require('../Assets/Upgrades/redShield.png'),
            cost: 5
        },
        {
            functionType: 'strength',
            type: 'red',
            upgrade: 'red3',
            bought: false,
            active: false,
            title: 'Fire Swords',
            text: 'All red cards gain +1/0',
            backgroundImage: require('../Assets/Upgrades/redSword.png'),
            cost: 5
        },
        {
            functionType: 'first',
            type: 'red',
            upgrade: 'red4',
            bought: false,
            active: false,
            title: 'Fire Potion',
            text: 'The first red card played each game gains +1/+1.',
            backgroundImage: require('../Assets/Upgrades/redPotion.png'),
            cost: 3
        },
        {
            functionType: 'block',
            type: 'red',
            upgrade: 'red5',
            bought: false,
            active: true,
            title: 'Fire Armor',
            text: 'The first red card played each game gains Block 1.',
            backgroundImage: require('../Assets/Upgrades/redBoth.png'),
            cost: 3
        },
    ],
}

export default UpgradesData;