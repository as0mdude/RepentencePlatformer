class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 700;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -700;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("level1game", 16, 16, 150, 30);

        
        this.forcefield1Sound = this.sound.add("forcefield1");
        this.forcefield2Sound = this.sound.add("forcefield2");

        

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("monochrome_tilemap_packed", "tilemap_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // TODO: Add createFromObjects here
        // Find coins in the "Objects" layer in Phaser
        // Look for them by finding objects with the name "coin"
        // Assign the coin texture from the tilemap_sheet sprite sheet
        // Phaser docs:
        // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-createFromObjects

        this.coins = this.map.createFromObjects("Objects", {
            name: "soul",
            key: "tile_0042"
            
        });


        // TODO: Add turn into Arcade Physics here
         // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(100, 100, "platformer_characters", "tile_0000.png");
        // Set the origin point of the sprite to its center
        
        my.sprite.player.width = 18;
        my.sprite.player.height = 18;
        my.sprite.player.setDisplaySize(my.sprite.player.width * 2, my.sprite.player.height * 2);

        // Adjust the hitbox size to match the original size of the sprite
        my.sprite.player.setSize(my.sprite.player.width, my.sprite.player.height);
        
        

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);




        this.scoreCount = 0
        // TODO: Add coin collision handler
          // Handle collision detection with coins
          this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            this.forcefield2Sound.play();
            this.scoreCount+=1;
            
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // TODO: Add movement vfx here
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['window_01.png', 'window_04.png'],
            // TODO: Try: add random: true
            scale: {start: 0.03, end: 0.0008},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 300,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();


        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['spark_01.png', 'spark_04.png'],
            // TODO: Try: add random: true
            scale: {start: 0.03, end: 0.0008},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 300,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.jumping.stop();
        

        // TODO: add camera code here
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);



        

        this.scoreText = this.add.text(16, 40, 'Souls: ' + this.scoreCount, {
            fontSize: '32px',
            fill: '#ffffff'
        })


        this.deathText = this.add.text(16, 80, 'Deaths: ' + this.scoreCount, {
            fontSize: '32px',
            fill: '#ffffff'
        })

        this.deathCount = 0;

        

        

    }

    update() {

        if(my.sprite.player.x > 500){
            this.scoreText.setPosition(my.sprite.player.x-350, 40);
            this.deathText.setPosition(my.sprite.player.x-350, 80);
        }


        this.scoreText.setText('Souls: ' + this.scoreCount);

        
        
        
        
        

        if(my.sprite.player.y > 500){
            my.sprite.player.setPosition(100, 200)
            this.forcefield1Sound.play();
            this.scoreText.setPosition(16, 40);

            this.deathCount+=1;
            this.deathText.setText('Deaths: ' + this.deathCount);

        }



        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();
                my.vfx.jumping.stop();

            }

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();
                my.vfx.jumping.stop();

            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
            
            // TODO: have the vfx stop playing
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');

            

        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            
            
            my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.jumping.start(); 

            
        }



        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }

    newGame(){
    
    }
}

