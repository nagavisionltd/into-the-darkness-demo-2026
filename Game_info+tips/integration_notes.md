# Integration Notes - Into the Darkness Level 1

## KB Standards to Implement
### Input Buffering (per NAGA KB)
```javascript
// Add to player update():
this.comboBuffer = null;
this.comboWindow = 280; // Lord Soul standard

// On attack input:
if (attackPressed && this.canAttack) {
    this.comboBuffer = { input: 'punch', time: Date.now() };
}
// Check in animation complete:
if (this.comboBuffer && Date.now() - this.comboBuffer.time < this.comboWindow) {
    this.executeCombo(this.comboBuffer.input);
    this.comboBuffer = null;
}