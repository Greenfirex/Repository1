const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Load assets here (images, sounds, etc.)
}

function create() {
    // Initialize game objects and variables here
    this.add.text(100, 100, 'Welcome to Sci-Fi Idle Game', { font: '24px Arial', fill: '#ffffff' });
}

function update() {
    // Game loop logic goes here
}

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.spritesheet('spaceship', 'assets/images/spaceship.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        this.add.image(400, 300, 'background');
        
        this.resources = 0;
        this.resourceText = this.add.text(10, 10, 'Resources: 0', { font: '20px Arial', fill: '#00ff00' });

        this.time.addEvent({
            delay: 1000,
            callback: this.generateResources,
            callbackScope: this,
            loop: true
        });

        // Example button
        let upgradeButton = this.add.text(10, 50, 'Upgrade', { font: '20px Arial', fill: '#ffffff' })
            .setInteractive()
            .on('pointerdown', () => this.upgrade());
    }

    generateResources() {
        this.resources += 1;
        this.resourceText.setText('Resources: ' + this.resources);
    }

    upgrade() {
        // Implement upgrade logic
        if (this.resources >= 10) {
            this.resources -= 10;
            this.resourceText.setText('Resources: ' + this.resources);
            // Increase resource generation rate, etc.
        }
    }
}