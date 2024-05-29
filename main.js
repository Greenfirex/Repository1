const config = {
    type: Phaser.CANVAS,
    width: window.innerWidth, // Nastavuje šířku scény podle šířky okna prohlížeče
    height: window.innerHeight, // Nastavuje výšku scény podle výšky okna prohlížeče
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Načtěte zde zdroje (obrázky, zvuky, atd.)
    this.load.image('background', 'assets/images/background.jpg');
}

function create() {
    // Inicializace herních objektů a proměnných zde
    this.add.image(config.width / 2, config.height / 2, 'background').setDisplaySize(config.width, config.height); // Nastavíte obrázek pozadí tak, aby vyplňoval celou scénu

    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x00ff00, 1);

// Vodorovná čára
    graphics.beginPath();
    graphics.moveTo(0, config.height * 0.1); // Začátek na 10% od vrchu
    graphics.lineTo(config.width * 0.8, config.height * 0.1); // Končí na svislé čáře
    graphics.strokePath();

// Svislá čára
    graphics.beginPath();
    graphics.moveTo(config.width * 0.8, 0);
    graphics.lineTo(config.width * 0.8, config.height);
    graphics.strokePath();


   
}

function update() {
    // Logika herní smyčky jde sem
}

