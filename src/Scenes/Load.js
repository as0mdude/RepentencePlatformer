class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        

        this.load.image("tile_0240", "tile_0240.png");
        this.load.image("tile_0241", "tile_0241.png");
        this.load.image("tile_0242", "tile_0242.png");
        this.load.image("tile_0243", "tile_0243.png");
        this.load.image("tile_0244", "tile_0244.png");
        this.load.image("tile_0245", "tile_0245.png");

        this.load.image("tile_0042", "tile_0042.png");

        // Load tilemap information
        this.load.image("tilemap_tiles", "monochrome_tilemap_packed.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("level1game", "level1game.tmj");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "monochrome_tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        this.load.audio("forcefield1", "forceField_003.ogg");
        this.load.audio("forcefield2", "forceField_004.ogg");

        this.load.audio("voidloop", "voidloop.ogg");

    }

    create() {

        document.getElementById('description').innerHTML = '<h2>Repentence by Vincent Fu</h2><br>Arrow keys to move // R: restart the level after death'


        this.anims.create({
            key: 'walk',
            frames: [
                { key: 'tile_0240' },
                { key: 'tile_0241' },
                { key: 'tile_0242' },
                { key: 'tile_0243' }, 
                { key: 'tile_0244' }
            ],
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [
                { key: "tile_0240" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',

            frames: [
                { key: "tile_0245" }
            ],
        });

         // ...and pass to the next Scene
         this.scene.start("platformerScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}