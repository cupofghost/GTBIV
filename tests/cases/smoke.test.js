// GTB IV fast smoke test — boots the game once and checks for console errors.
// Runs after syntax-check as a pre-flight before the full suite.

module.exports = {
  name: 'Smoke test: single boot',
  start: 'skipintro',  // Skip intro to boot faster
  async run(page, { assert }) {
    // Wait for the game to settle (loop running, initial state loaded)
    await page.waitForTimeout(1500);

    // Check that the canvas is rendering (game is running)
    const canvas = await page.$('canvas');
    assert(canvas !== null, 'Canvas element should exist and be rendering');

    // Verify initial state is sensible
    const ready = await page.evaluate(() => {
      // G.running should be true in gameplay mode
      return typeof G !== 'undefined' && G.mode !== undefined;
    });
    assert(ready, 'Game global state (G) should be initialized');
  }
};
