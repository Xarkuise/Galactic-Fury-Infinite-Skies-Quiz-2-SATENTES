export default class creditScene extends Phaser.Scene {
    constructor() {
        super("creditScene");
    }

    preload() {
        // Load assets like background images, buttons, etc.
        this.load.image('creditBackground', './assets/images/creditBackground.png');
        this.load.image('backButton', './assets/images/back.png');
    }

    create() {
        // Add background image
        this.background = this.add.image(0, 0, 'creditBackground').setOrigin(0, 0);
        this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        const backButton = this.add.image(this.cameras.main.width / 2, this.cameras.main.height + 100, 'backButton');
        backButton.setOrigin(0.5);
        backButton.setInteractive();
        backButton.on('pointerdown', () => this.Back());

        backButton.on('pointerover', () => {
            backButton.setTint(0xb2ffb2);
        });
        backButton.on('pointerout', () => {
            backButton.clearTint();
        });

        this.tweens.add({
            targets: backButton,
            y: 900,
            duration: 3000,
            ease: 'Power2',
            delay: 400 // Delay the start of this animation slightly more
        });
    }

    Back() {
        // Stop credit scene's background music when transitioning back to the title scene
        const backgroundMusic = this.sound.get('backgroundMusic');
        if (backgroundMusic && backgroundMusic.isPlaying) {
            backgroundMusic.stop();
        }
        this.scene.start('titleScene');
    }
}