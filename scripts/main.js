import titleScene from './scenes/titleScene.js';
import gameScene from './scenes/gameScene.js';
import creditScene from './scenes/creditScene.js';
import gameoverScene from './scenes/gameoverScene.js';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 1130,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [titleScene, gameScene, creditScene, gameoverScene]
     
};

new Phaser.Game(config);