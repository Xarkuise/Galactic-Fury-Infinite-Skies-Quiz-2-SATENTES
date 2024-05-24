export default class titleScene extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    preload() {
        // Load assets like background images, buttons, etc.
        this.load.image('background', './assets/images/background.png');
        // Load Sprite image
        this.load.image('ship', './assets/images/ship.png');
        // Load button images
        this.load.image('startButton', './assets/images/start.png');
        this.load.image('creditButton', './assets/images/credit.png');
        this.load.image('quitButton', './assets/images/quit.png');
        // Load audio
        this.load.audio('backgroundMusic', './assets/audio/music/backgroundMusic.mp3');
    }

    create() {
        // Add background image
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    
        // Add Ship Sprite
        this.ship = this.add.sprite(400, 400, 'ship');
        this.ship.setOrigin(0.5);
    
        // Load and play background music
        this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true, volume: 0.3 });
        if (!this.backgroundMusic.isPlaying && !this.sound.mute) {
            this.backgroundMusic.play();
        }
    
        // Add sound status text
        this.soundStatusText = this.add.text(20, 20, 'Sound: On', { font: '24px Arial', fill: '#ffffff' });
        
        // Add mute/unmute button
        this.muteButton = this.add.text(this.cameras.main.width - 150, 20, 'Mute', { font: '24px Arial', fill: '#ffffff' });
        this.muteButton.setInteractive();
        this.muteButton.on('pointerdown', () => {
            this.toggleSound();
        });
    
        // Add Start button
        const startButton = this.add.image(-100, 650, 'startButton'); // Start off-screen to the left
        startButton.setOrigin(0.5);
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('gameScene');
        });
        // Add hover effect for Start button
        startButton.on('pointerover', () => {
            startButton.setTint(0xb2ffb2);
        });
        startButton.on('pointerout', () => {
            startButton.clearTint();
        });
    
        // Animate the Start button to the center
        this.tweens.add({
            targets: startButton,
            x: this.cameras.main.width / 2,
            duration: 1000,
            ease: 'Power2'
        });
    
        // Add Credit button
        const creditButton = this.add.image(this.cameras.main.width + 100, 750, 'creditButton'); // Start off-screen to the right
        creditButton.setOrigin(0.5);
        creditButton.setInteractive();
        creditButton.on('pointerdown', () => {
            if (!this.scene.isActive('creditScene')) {
                this.scene.stop('titleScene');
                this.scene.start('creditScene');
            }
        });
    
        // Add hover effect for Credit button
        creditButton.on('pointerover', () => {
            creditButton.setTint(0xb2ffb2);
        });
        creditButton.on('pointerout', () => {
            creditButton.clearTint();
        });
    
        // Animate the Credit button to the center
        this.tweens.add({
            targets: creditButton,
            x: this.cameras.main.width / 2,
            duration: 1000,
            ease: 'Power2',
            delay: 200 // Delay the start of this animation slightly
        });
    
        // Add Quit button
        const quitButton = this.add.image(this.cameras.main.width / 2, this.cameras.main.height + 100, 'quitButton'); // Start off-screen at the bottom
        quitButton.setOrigin(0.5);
        quitButton.setInteractive();
        quitButton.on('pointerdown', () => {
            if (window.confirm("Are you sure you want to quit?")) {
                alert("You exited the game");
            }
        });
    
        // Add hover effect for Quit button
        quitButton.on('pointerover', () => {
            quitButton.setTint(0xb2ffb2);
        });
        quitButton.on('pointerout', () => {
            quitButton.clearTint();
        });
    
        // Animate the Quit button to the center
        this.tweens.add({
            targets: quitButton,
            y: 850,
            duration: 1000,
            ease: 'Power2',
            delay: 400 // Delay the start of this animation slightly more
        });
    
        // Get reference to the game scene instance
        this.gameScene = this.scene.get('gameScene');
    }

    toggleSound() {
        if (this.sound.mute) {
            this.sound.setMute(false);
            this.soundStatusText.setText('Sound: On');
        } else {
            this.sound.setMute(true);
            this.soundStatusText.setText('Sound: Off');
        }
    }
}