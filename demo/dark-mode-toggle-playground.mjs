((doc) => {
  const themeColor = doc.querySelector('meta[name="theme-color"]');
  const body = doc.body;

  doc.addEventListener('colorschemechange', (e) => {
    // The event fires right before the color scheme goes into effect,
    // so we need the `color` value.
    themeColor.content = getComputedStyle(body).color;
    console.log(`${e.target.id} changed the color scheme to ${
      e.detail.colorScheme}`);
  });
})(document);
