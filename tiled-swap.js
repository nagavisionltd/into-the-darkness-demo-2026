fetch('level1.json')
  .then(r => r.json())
  .then(data => {
      const platforms = data.layers
        .find(l => l.name === 'Platforms')
        .data.map(tile => ({
            x: tile.x, y: tile.y, 
            w: tile.width, h: tile.height,
            type: tile.properties?.type || 'floor'
        }));
      // Pass to existing resolveCollisions() - no changes needed!
  });