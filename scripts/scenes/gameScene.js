export default class gameScene extends Phaser.Scene {
    constructor() {
        super("gameScene");
        this.scenePaused = false;
    }

    init() {
        this.player;
        this.cursors;
        this.shootKey;
        this.background;
        this.bullets;
        this.obstacles;
        this.enemyTimer;
        this.bulletTimer;
        this.score = 0;
        this.timeSurvived = 0;
        this.scoreText;
        this.timeText;
        this.gameOverText;
        this.winText;
        this.backgroundMusic;
        this.shootSound;
        this.hitSound;
    }

    preload() {
        // Background
        this.load.image('gameoverBackground', './assets/images/gameoverBackground.png');
        // Player
        this.load.image('player', './assets/images/ship.png');
        // Bullet
        this.load.image('bullet', './assets/images/bullet.png');
        // Obstacle
        this.load.image('obstacle', './assets/images/enemyOne.png');
        // Load audio
        this.load.audio('backgroundMusic', './assets/audio/backgroundMusic.mp3');
        this.load.audio('shootSound', './assets/audio/shootSound.wav');
        this.load.audio('hitSound', './assets/audio/hitSound.wav');
    }

    create() {
        // Scale Background size
        this.background = this.add.image(0, 0, 'gameoverBackground').setOrigin(0, 0);
        this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    
        // Player properties
        this.player = this.physics.add.sprite(400, -50, 'player'); // Start player off-screen above
        this.player.setCollideWorldBounds(true);
    
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    
        // Bullet properties
        this.bullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            defaultKey: 'bullet',
            maxSize: 10
        });
    
        // Obstacle properties
        this.obstacles = this.physics.add.group();
    
        this.physics.add.overlap(this.bullets, this.obstacles, this.hitObstacle, null, this);
        this.physics.add.overlap(this.player, this.obstacles, this.hitPlayer, null, this);
    
        this.scoreText = this.add.text(20, 20, 'Score: ' + this.score, { fontSize: '20px', fill: '#ffffff' });
        this.timeText = this.add.text(20, 50, 'Time: ' + this.timeSurvived, { fontSize: '20px', fill: '#ffffff' });
    
        // Animate player ship entry
        this.tweens.add({
            targets: this.player,
            y: 500, // Destination y-coordinate
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.startTimers();
            }
        });
    
        // Load and play background music
        if (!this.sound.get('backgroundMusic').isPlaying) {
            this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true, volume: 0.5 });
            this.backgroundMusic.play();
        }
    
        // Load sound effects
        this.shootSound = this.sound.add('shootSound');
        this.hitSound = this.sound.add('hitSound');
    
        // Resume the scene after everything is set up
        this.resumeScene();
    }

    startTimers() {
        this.enemyTimer = this.time.addEvent({
            delay: 1000,
            callback: this.createNewObstacle,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimeSurvived,
            callbackScope: this,
            loop: true
        });
    }

    pauseScene() {
        this.physics.pause();
        this.scenePaused = true;
    }

    resumeScene() {
        this.physics.resume();
        this.scenePaused = false;
    }

    fireBullet() {
        let bullet = this.bullets.get(this.player.x, this.player.y - 20);
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.enable = true; // Ensure the bullet is enabled
            bullet.setPosition(this.player.x, this.player.y - 20);
            bullet.body.velocity.y = -300;
            this.shootSound.play();
        }
    }

    createNewObstacle() {
        let x = Phaser.Math.Between(50, 750);
        let obstacle = this.obstacles.create(x, 50, 'obstacle');
        obstacle.setVelocity(0, 100);
        obstacle.setCollideWorldBounds(true);
        obstacle.setBounce(1, 1);
    }

    hitObstacle(bullet, obstacle) {
        if (bullet.visible) {
            bullet.destroy();
        }
        obstacle.destroy();
        this.hitSound.play();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }

    hitPlayer(player, obstacle) {
        this.physics.pause();
        this.gameOver = true;
        player.setTint(0xff0000);
        this.backgroundMusic.stop();
        this.hitSound.play();
        this.gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Game Over', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5);
        this.time.delayedCall(1, () => {
            this.scene.restart();
        });
    }

    updateTimeSurvived() {
        if (!this.gameOver) {
            this.timeSurvived++;
            this.timeText.setText('Time: ' + this.timeSurvived);

            // Winning condition: survive for 2 minutes (120 seconds)
            if (this.timeSurvived >= 120) {
                this.physics.pause();
                this.backgroundMusic.stop();
                this.winText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'You Win!', { fontSize: '64px', fill: '#00ff00' }).setOrigin(0.5);
                this.time.delayedCall(2000, () => {
                    this.scene.restart();
                });
            }
        }
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-250);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(250);
        } else {
            this.player.setVelocityX(0);
        }
    
        if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
            this.fireBullet();
        }
    
        // Add this code to destroy obstacles that have moved off the bottom of the screen
        this.obstacles.children.each(function(obstacle) {
            if (obstacle.y > this.cameras.main.height) {
                obstacle.destroy();
            }
        }, this);
    }
}