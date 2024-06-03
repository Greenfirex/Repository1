import { createButton, createLeftButton } from './ui.js';
import { resources, addResource, getResource } from './resources.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth, // Nastavuje šířku scény podle šířky okna prohlížeče
    height: window.innerHeight, // Nastavuje výšku scény podle výšky okna prohlížeče
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let hydrogenText, oxygenText, heliumText, lithiumText;
let button2;

function preload() {
// Načtěte zde zdroje (obrázky, zvuky, atd.)
	this.load.image('background', 'assets/images/background.jpg');
	this.load.image('button1', 'assets/images/PNG/Button01.png');
};

function create() {
// Nastavíte obrázek pozadí tak, aby vyplňoval celou scénu    
	this.add.image(config.width / 2, config.height / 2, 'background').setDisplaySize(config.width, config.height); 

// Čáry
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x00FF00, 1);

// Vodorovná čára
    graphics.beginPath();
    graphics.moveTo(0, config.height * 0.1); // Začátek na 10% od vrchu
    graphics.lineTo(config.width * 0.8, config.height * 0.1); // Končí na svislé čáře
    graphics.strokePath();

// Svislá čára vpravo
    graphics.beginPath();
    graphics.moveTo(config.width * 0.8, 0);
    graphics.lineTo(config.width * 0.8, config.height);
    graphics.strokePath();

// Svislá čára vlevo
    graphics.beginPath();
    graphics.moveTo(config.width * 0.2, 0);
    graphics.lineTo(config.width * 0.2, config.height);
    graphics.strokePath();

// Vytvoření červeného sloupce vpravo
    const rightColumn = this.add.graphics();
    rightColumn.fillStyle(0x000000, 1);
    rightColumn.fillRect(config.width * 0.8, 0, config.width * 0.2, config.height);

// Vytvoření černého sloupce vlevo (Menu)
    const leftColumn = this.add.graphics();
    leftColumn.fillStyle(0x000000, 1);
    leftColumn.fillRect(0, 0, config.width * 0.2, config.height);

// Vytvoření tlačítka v levém sloupci (Menu)
const MenuButtonHeight = window.innerHeight * 0.05; // Definice výšky tlačítek
const MenuButtonY = window.innerHeight * 0.1 - MenuButtonHeight / 2; // Pozice Y tlačítka
const leftButton = createLeftButton(
    this,
    config.width * 0.1,
    MenuButtonY,
    'Levé Tlačítko', // Text tlačítka (Menu)
    () => {
        console.log('Levé tlačítko bylo stisknuto!');
    },
    'Tohle je levé tlačítko' // Popis tlačítka (Menu)
);

// Vytvoření tlačítek uprostřed
const MidButtonWidth = config.width * 0.1;
const MidButtonHeight = window.innerHeight * 0.05; // Definice výšky tlačítek
const button1 = createButton(
    this,
    config.width * 0.25,
    config.height * 0.15,
    MidButtonWidth,
    MidButtonHeight,
    'button1',
    'Klikni zde',
    () => {
        addResource('hydrogen', 1);
        hydrogenText.setText('Hydrogen: ' + getResource('hydrogen'));
        if (getResource('hydrogen') >= 10 && !button2) {
            button2 = createButton(
                this,
                config.width * 0.45,
                config.height * 0.15,
                MidButtonWidth,
                MidButtonHeight,
                'button1',
                'Tlačítko 2',
                () => {
                    console.log('Tlačítko 2 bylo stisknuto!');
                },
                'Toto je tlačítko 2'
            );
        }
    },
    'Přidej 1 vodík'
);

// Vytvoření seznamu zdrojů v sloupci vpravo
hydrogenText = this.add.text(config.width * 0.81, config.height * 0.1, 'Hydrogen: 0', { fontSize: '32px', fill: '#ffffff' });
oxygenText = this.add.text(config.width * 0.81, config.height * 0.2, 'Oxygen: 0', { fontSize: '32px', fill: '#ffffff' });
heliumText = this.add.text(config.width * 0.81, config.height * 0.3, 'Helium: 0', { fontSize: '32px', fill: '#ffffff' });
lithiumText = this.add.text(config.width * 0.81, config.height * 0.4, 'Lithium: 0', { fontSize: '32px', fill: '#ffffff' });



}

function update() {
    // Logika herní smyčky jde sem
}

