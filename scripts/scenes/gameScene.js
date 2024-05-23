export default class gameScene extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }

    init() {
        this.score = 0;
        this.timeSurvived = 0;
    }

    preload() {
        // Load images
        this.load.image('gSBackground', 'assets/images/gSBackground.png');
        this.load.image('player', 'assets/images/ship.png');
        this.load.image('projectile', 'assets/images/bullet.png');
        this.load.image('obstacle', 'assets/images/enemyOne.png');
        this.load.image('obstacleTwo', 'assets/images/enemyTwo.png');  // New enemy type
        this.load.image('obstacleThree', 'assets/images/enemyThree.png');  // New enemy type

        // Load audio
        this.load.audio('backgroundMusic', 'assets/audio/backgroundMusic.mp3');
        this.load.audio('shotSound', 'assets/audio/shoot.mp3');
        this.load.audio('hitSound', 'assets/audio/hit.mp3');
    }

    create() {
        // Stop title scene's background audio if it's playing
        this.sound.stopAll();

        // Background music
        this.backgroundMusic = this.sound.add('backgroundMusic', { volume: 0.3, loop: true });
        this.backgroundMusic.play();

        // Background image
        this.gSBackground = this.add.image(0, 0, 'gSBackground').setOrigin(0, 0);
        this.gSBackground.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

         // Shot sound
         this.shot = this.sound.add('shotSound', { volume: 0.2 }); // Adjust volume as needed        
        
        // Player setup
        this.player = this.physics.add.sprite(400, 1100, 'player').setCollideWorldBounds(true);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Projectiles
        this.projectiles = this.physics.add.group({
            classType: Phaser.GameObjects.Sprite,
            maxSize: -1,
            runChildUpdate: true
        });

        // Obstacles
        this.obstacles = this.physics.add.group();

        // Collisions
        this.physics.add.collider(this.projectiles, this.obstacles, this.destroyObstacle, null, this);
        this.physics.add.collider(this.player, this.obstacles, this.gameOver, null, this);

        // Score and time UI
        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#fff' });
        this.timeText = this.add.text(10, 40, 'Time: 0s', { fontSize: '20px', fill: '#fff' });

        // Timed events
        this.spawnObstacleTimer = this.time.addEvent({
            delay: 500, // Increased frequency of spawning enemies
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });

        this.updateTimeTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeSurvived += 1;
                this.timeText.setText(`Time: ${this.timeSurvived}s`);
                if (this.timeSurvived === 30) { // Win condition: survive 2 minutes
                    this.winGame();
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    shootProjectile() {
        const projectile = this.projectiles.get(this.player.x, this.player.y - 100, 'projectile');
        if (projectile) {
            if (!projectile.active) {
                projectile.enableBody(true, this.player.x, this.player.y - 50, true, true);
                projectile.setVelocityY(-800); // Set velocity upwards
                projectile.setGravityY(0); // Disable gravity for the projectile
                this.shot.play(); 
            }
        }
    }

    spawnObstacle() {
        const obstacleTypes = ['obstacle', 'obstacleTwo', 'obstacleThree'];
        for (let i = 0; i < 2; i++) { // Spawn 3 enemies at once
            const x = Phaser.Math.Between(50, 750);
            const obstacleType = Phaser.Math.RND.pick(obstacleTypes);
            const obstacle = this.obstacles.create(x, 0, obstacleType);
            obstacle.setVelocityY(200);

            // Destroy the obstacle when it reaches the bottom of the screen
            obstacle.checkWorldBounds = true;
            obstacle.outOfBoundsKill = true;
        }
    }

    destroyObstacle(projectile, obstacle) {
        if (projectile && projectile.active) {
            // Disable and clear the projectile
            projectile.destroy(); // Corrected typo here
 
            // Destroy the obstacle
            obstacle.destroy();
    
            // Play hit sound and update score
            
            this.score += 50;
            this.scoreText.setText('Score: ' + this.score);
    
            // Check for score-based winning condition
            if (this.score >= 1000) {
                this.winGame();
            }
        }
    }

    gameOver(player, obstacle) {
        this.backgroundMusic.stop();
        this.scene.start('gameoverScene', { score: this.score, timeSurvived: this.timeSurvived });
    }

    winGame() {
        this.backgroundMusic.stop();
        this.scene.start('winningScene', { score: this.score, timeSurvived: this.timeSurvived, win: true });
    }

    update() {
        // Player movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-500);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(500);
        } else {
            this.player.setVelocityX(0);
        }

        // Shooting
        if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
            this.shootProjectile();
        }
    }
}