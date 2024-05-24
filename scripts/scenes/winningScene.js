export default class winningScene extends Phaser.Scene {
    constructor() {
        super("winningScene");
    }

    init(data) {
        this.score = data.score;
        this.timeSurvived = data.timeSurvived;
    }

    preload() {
        // Load the background image
        this.load.image('gSBackground', 'assets/images/gSBackground.png');
        // Load the winning sound
        this.load.audio('winningSound', 'assets/audio/music/winningSound.mp3'); // Adjust the path and file type as needed
    }

    create() {
        // Display the background image
        this.add.image(0, 0, 'gSBackground').setOrigin(0);

         // Play winning sound
         let winningSound = this.sound.add('winningSound', { volume: 0.3});
         winningSound.play();

        // Display the winning message and score
        this.add.text(400, 200, 'You Win!', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 300, `Score: ${this.score}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 350, `Time Survived: ${this.timeSurvived}s`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Add a restart button
        const restartButton = this.add.text(400, 500, 'Restart', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5).setInteractive();
        restartButton.on('pointerdown', () => {
            this.sound.stopAll(); // Stop all sounds before restarting
            this.scene.start('gameScene');
        });  
    }
}