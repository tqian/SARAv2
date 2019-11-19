export class ReinforestLevel1 extends Phaser.State {
    //componentObject;
    constructor(){
        super();
        this.componentObject;
        this.thirstyplant;
    }

    //preload the images
    preload(){
        console.log("Preload called");
        this.input.addPointer();
        this.game.load.image('reinforest1','assets/pics/bg-2.png');
        this.game.load.atlasJSONArray('attackplant', 'assets/game/sprite/attack_plant.png', 'assets/game/sprite/attack_plant.json');
        this.game.load.atlasJSONArray('thirstyplant', 'assets/game/sprite/thirsty_plant.png', 'assets/game/sprite/thirsty_plant.json');
    }

    //gets executed after preload
    create(){
        console.log("create called");
        var s = this.game.add.sprite(0,0,'reinforest1');
        s.rotation = 0.0;
        //s.inputEnabled = true;
        //s.events.onInputDown.add(this.changeToAttack, this);

        //
        //var attackplant = this.game.add.sprite(-10, this.game.height-230, 'attackplant');
        //attackplant.animations.add('swim');
        //attackplant.animations.play('swim', 15, true);
        //attackplant.scale.setTo(1, 1);
        //this.game.inputEnabled = false;

        //
        console.log("adding thristy plant");
        var thirstyplant = this.game.add.sprite(-10, this.game.height-230, 'thirstyplant');
        thirstyplant.animations.add('swim');
        thirstyplant.animations.play('swim', 15, true);
        thirstyplant.scale.setTo(1, 1);
        thirstyplant.inputEnabled = true;
        this.thirstyplant = thirstyplant;
        thirstyplant.events.onInputDown.add(this.changeToAttack, this);
        //this.game.input.onDown.addOnce(this.changeToAttack, this);
        

        this.inputEnabled = false;
        Phaser.Canvas.setTouchAction(this.game.canvas, "auto");
        this.game.input.touch.preventDefault = false;
    }



    changeToAttack(){
        console.log("changed to attack");
        this.thirstyplant.loadTexture('attackplant', 0);
        this.thirstyplant.animations.add('swim');
        this.thirstyplant.animations.play('swim', 15, true);
        this.thirstyplant.events.onInputDown.add(this.changeToThirsty, this);
    }

    changeToThirsty(){
        console.log("changed to thirsty");
        this.thirstyplant.loadTexture('thirstyplant', 0);
        this.thirstyplant.animations.add('swim');
        this.thirstyplant.animations.play('swim', 15, true);
        this.thirstyplant.events.onInputDown.add(this.changeToAttack, this);
    }

    buildWorld() {

    }

}