(function () {
  const config = {
    canvas: document.getElementById('c'),
    image: 'assets/stormtrooper.jpg',
    fitCanvas: true,
    uniforms: {
      pixel_h: 12,
      pixel_w: 12
    }
  }

  // load default
  let stormtroopers = new Image()
  stormtroopers.crossOrigin = 'Access-Control-Allow-Origin'
  stormtroopers.src = 'stormtroopers.jpg'

  stormtroopers.onload = function () {
    config.image = stormtroopers
    shaderfy.render('pixelation', config)
  }
})()
