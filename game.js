/**
 * INTO THE DARKNESS - PROTOTYPE ENGINE V4
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- ASSET LOADER ---
const assets = {
    background: new Image(),
    cover: new Image(),
    player: {
        idle: [], run: [], jump: [], punch: [], uppercut: [], kick: [], crouch: [], energyBlast: []
    }
};

let assetsLoaded = 0;
const totalAssets = 25; // Corrected count

function assetLoaded() {
    assetsLoaded++;
    if (assetsLoaded === totalAssets) {
        assets.player.idle.push(assets.player.punch[0]); // Use punch_idle for idle
        loop();
    }
}

function loadImages(path, filenames, targetArray) {
    filenames.forEach(filename => {
        const img = new Image();
        img.src = `${path}/${filename}.png`;
        img.onload = assetLoaded;
        targetArray.push(img);
    });
}

assets.background.src = 'background.png';
assets.background.onload = assetLoaded;
assets.cover.src = 'into_darkness_cover.png';
assets.cover.onload = assetLoaded;

loadImages('jax', ['run', 'run_2', 'run_3'], assets.player.run);
loadImages('jax', ['jump_1', 'jump', 'jump_2', 'jump_3', 'jump_4'], assets.player.jump);
loadImages('jax', ['punch_idle', 'punch_left', 'punch_right', 'punch_upper_cut', 'punch_finish'], assets.player.punch);
loadImages('jax', ['uppercut'], assets.player.uppercut);
loadImages('jax', ['kick', 'kick_2'], assets.player.kick);
loadImages('jax', ['crouch'], assets.player.crouch);
loadImages('jax', ['blast_1', 'blast_2', 'blast_3', 'blast_4', 'blast_5'], assets.player.energyBlast); // Removed 'blast'

// --- ANIMATION DATA ---
const animations = {
    idle: { frames: assets.player.idle, frameRate: 10, loop: false },
    run: { frames: assets.player.run, frameRate: 5, loop: true },
    jump: { frames: assets.player.jump, frameRate: 5, loop: false },
    punch: { frames: assets.player.punch, frameRate: 4, loop: false },
    kick: { frames: assets.player.kick, frameRate: 5, loop: false },
    crouch: { frames: assets.player.crouch, frameRate: 10, loop: false },
    energyBlast: { frames: assets.player.energyBlast, frameRate: 5, loop: true }
};


// --- GAME CONSTANTS ---
const GRAVITY = 0.8;
const FRICTION = 0.85;
const GROUND_Y = 380;

// --- INPUT HANDLER ---
const keys = {
    right: false, left: false, jump: false, down: false,
    punch: false, kick: false, energyBlast: false
};

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
    if (e.code === 'Space') keys.jump = true;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = true;
    if (e.code === 'KeyX') keys.punch = true;
    if (e.code === 'KeyC') keys.kick = true;
    if (e.code === 'KeyE') keys.energyBlast = true;
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'Space') keys.jump = false;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = false;
    if (e.code === 'KeyX') keys.punch = false;
    if (e.code === 'KeyC') keys.kick = false;
    if (e.code === 'KeyE') keys.energyBlast = false;
});


// --- CAMERA ---
let camera = { x: 0, y: 0 };

// --- UTILS ---
function checkRectCollision(r1, r2) {
    return (r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y);
}

// --- CLASSES ---
class Entity {
    constructor(x, y, w, h) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.vx = 0; this.vy = 0;
        this.isGrounded = false; this.facingRight = true;
        this.health = 100; this.maxHealth = 100;
        this.isDead = false; this.hitStun = 0;
    }

    applyPhysics() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += GRAVITY;
        this.vx *= FRICTION;
        if (this.y + this.h > GROUND_Y) {
            this.y = GROUND_Y - this.h;
            this.vy = 0;
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
        }
    }

    draw(ctx, camX) { // Base draw for health bar
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - camX, this.y - 15, this.w, 8);
        ctx.fillStyle = '#0f0';
        ctx.fillRect(this.x - camX, this.y - 15, this.w * (this.health / this.maxHealth), 8);
    }
}

class Player extends Entity {
    constructor(x, y) {
        super(x, y, 140, 190);
        this.attackCooldown = 0;
        this.isAttacking = false;
        this.attackHitbox = null;
        this.state = 'idle';
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.animation = animations.idle;
    }

    setAnimation(animName) {
        if (this.state !== animName) {
            this.state = animName;
            this.animation = animations[animName];
            this.currentFrame = 0;
        }
    }

    update() {
        // State Machine
        if (this.isAttacking) {
           // wait for animation to finish
        } else if (!this.isGrounded) {
            this.setAnimation('jump');
        } else if (keys.down) {
            this.setAnimation('crouch');
        } else if (keys.right || keys.left) {
            this.setAnimation('run');
        } else {
            this.setAnimation('idle');
        }
        
        if (this.attackCooldown > 0) this.attackCooldown--;

        if (keys.punch && !this.isAttacking) {
            this.setAnimation('punch');
            this.isAttacking = true;
            this.attackCooldown = this.animation.frames.length * this.animation.frameRate;
        }

        if (keys.kick && !this.isAttacking) {
            this.setAnimation('kick');
             this.isAttacking = true;
            this.attackCooldown = this.animation.frames.length * this.animation.frameRate;
        }

        if (keys.energyBlast && !this.isAttacking) {
            this.shoot();
        }
        
        if (this.hitStun <= 0 && !this.isAttacking) {
            if (keys.right) { this.vx += 1.5; this.facingRight = true; }
            if (keys.left) { this.vx -= 1.5; this.facingRight = false; }
            if (keys.jump && this.isGrounded) { this.vy = -22; }
        }

        this.applyPhysics();

        this.frameTimer++;
        if (this.frameTimer >= this.animation.frameRate) {
            this.frameTimer = 0;
            this.currentFrame++;
            if (this.currentFrame >= this.animation.frames.length) {
                if (this.animation.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = this.animation.frames.length - 1;
                    this.isAttacking = false;
                }
            }
        }
    }

    draw(ctx, camX) {
        if (this.isDead) return;
        if (this.hitStun > 0) this.hitStun--;

        const frame = this.animation.frames[this.currentFrame];
        if (!frame) return;

        ctx.save();
        if (!this.facingRight) ctx.scale(-1, 1);
        const drawX = this.facingRight ? this.x - camX : -(this.x - camX) - this.w;

        if (!(this.hitStun > 0 && this.hitStun % 4 < 2)) {
            ctx.drawImage(frame, drawX, this.y, this.w, this.h);
        }
        ctx.restore();

        super.draw(ctx, camX);
    }
    
    shoot() {
        if (this.attackCooldown > 0) return;
        this.attackCooldown = 30;
        const projectileVx = this.facingRight ? 15 : -15;
        projectiles.push(new Projectile(this.x + (this.facingRight ? this.w : 0), this.y + 40, projectileVx));
    }
}

class Enemy extends Entity {
    constructor(x, y) {
        super(x, y, 140, 190);
        this.health = 30; this.maxHealth = 30;
        this.sprite = { img: assets.cover, sx: 20, sy: 350, sWidth: 300, sHeight: 400 };
    }
    update(player) {
         if (this.isDead || this.hitStun > 0) { this.applyPhysics(); return; }
        let dist = player.x - this.x;
        if (Math.abs(dist) < 400) {
            if (Math.abs(dist) > 60) {
                this.vx += dist > 0 ? 0.3 : -0.3;
                this.facingRight = dist > 0;
            } else {
                 if (this.attackTimer <= 0) {
                    this.attackTimer = 120;
                    player.health -= 5;
                    player.hitStun = 15;
                    player.vx = this.facingRight ? 12 : -12;
                }
            }
        }
        if (this.attackTimer > 0) this.attackTimer--;
        this.applyPhysics();
    }
    draw(ctx, camX) {
        if (this.isDead) return;
        ctx.save();
        if (!this.facingRight) ctx.scale(-1, 1);
        const drawX = this.facingRight ? this.x - camX : -(this.x - camX) - this.w;
        if (!(this.hitStun > 0 && this.hitStun % 4 < 2)) {
            ctx.drawImage(this.sprite.img, this.sprite.sx, this.sprite.sy, this.sprite.sWidth, this.sprite.sHeight, drawX, this.y, this.w, this.h);
        }
        ctx.restore();
        super.draw(ctx, camX);
    }
}

class Projectile {
    constructor(x, y, vx) {
        super(x, y, 140, 140); // Larger projectile
        this.damage = 50;
        this.currentFrame = 0; this.frameTimer = 0;
        this.animation = animations.energyBlast;
    }
    update() {
        this.x += this.vx;
        if (this.animation.frames.length > 0) {
            this.frameTimer++;
            if (this.frameTimer >= this.animation.frameRate) {
                this.frameTimer = 0;
                this.currentFrame = (this.currentFrame + 1) % this.animation.frames.length;
            }
        }
    }
    draw(ctx, camX) {
        const frame = this.animation.frames[this.currentFrame];
        if (frame) ctx.drawImage(frame, this.x - camX, this.y, this.w, this.h);
    }
}


// --- GAME STATE ---
const player = new Player(100, 150);
const enemies = [];
const projectiles = [];
let waveCount = 0;

function spawnEnemy(x) {
    enemies.push(new Enemy(x, 150));
}
spawnEnemy(600);

// --- MAIN LOOP ---
function update() {
    player.update();
    
    let targetCamX = player.x - canvas.width * 0.3;
    if (targetCamX < 0) targetCamX = 0;
    camera.x += (targetCamX - camera.x) * 0.1;

    projectiles.forEach((p, i) => {
        p.update();
        if (p.x - camera.x > canvas.width || p.x < camera.x) {
            projectiles.splice(i, 1);
        }
    });
    
    enemies.forEach((enemy) => {
        if (enemy.health <= 0) {
            enemy.isDead = true;
            return;
        }
        enemy.update(player);
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const p = projectiles[i];
            if (checkRectCollision(p, enemy)) {
                enemy.health -= p.damage;
                enemy.hitStun = 15;
                projectiles.splice(i, 1);
            }
        }
        if (player.isAttacking && player.attackHitbox && checkRectCollision(player.attackHitbox, enemy)) {
            enemy.health -= player.attackHitbox.damage;
            enemy.hitStun = 15;
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(assets.background, -camera.x * 0.1, -250, canvas.width * 2, canvas.height * 2);
    player.draw(ctx, camera.x);
    enemies.forEach(e => e.draw(ctx, camera.x));
    projectiles.forEach(p => p.draw(ctx, camera.x));
    
    ctx.fillStyle = 'white';
    ctx.font = '20px Courier New';
    ctx.fillText("HP: " + player.health, 20, 30);
    if (player.health <= 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.font = '40px Courier New';
        ctx.fillText("YOU DIED", canvas.width / 2 - 100, canvas.height / 2);
    }
}

function loop() {
    if (assetsLoaded === totalAssets) {
        update();
        draw();
    }
    requestAnimationFrame(loop);
}

// Don't start loop until assets are loaded
// loop(); is called from assetLoaded()

</script>