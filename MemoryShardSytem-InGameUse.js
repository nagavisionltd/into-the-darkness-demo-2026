// In your BaseScene.js create():
this.memoryShards = new MemoryShardSystem(this);

// Create shards for Level 1: Noktara
this.memoryShards.createShard(300, 400, 'truth', { realityShift: true });
this.memoryShards.createShard(550, 320, 'false', { spawnEnemy: 'ShadowStalker' });

// In update():
this.memoryShards.update(this.player);

// In render() or post-render:
this.memoryShards.render(this.scene.ctx, this.cameras.main);