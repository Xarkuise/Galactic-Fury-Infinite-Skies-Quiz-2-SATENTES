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
    }

    create() {
        // Display the background image
        this.add.image(0, 0, 'gSBackground').setOrigin(0);

        // Display the winning message and score
        this.add.text(400, 200, 'You Win!', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 300, `Score: ${this.score}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 350, `Time Survived: ${this.timeSurvived}s`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Add a restart button
        const restartButton = this.add.text(400, 500, 'Restart', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5).setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.start('gameScene');
        });
    }
}