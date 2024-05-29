const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
	// Load assets here (images, sounds, etc.)
	this.load.image('background', 'assets/images/background.jpg');
}

function create() {
	// Initialize game objects and variables here
	this.add.image(960, 540, 'background').setOrigin(0.5, 0.5);
const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.beginPath();
    graphics.moveTo(1344, 0); // 1920 * 0.7 = 1344
    graphics.lineTo(1344, 1080);
    graphics.strokePath();
}

function update() {
    // Game loop logic goes here
}

