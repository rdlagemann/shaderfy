;(function () {
  demo('normal')
  demo('pixelation')
  demo('edgeDetect1')

  function demo (name, canvas) {
    let body = document.querySelector('body')
    let legend = document.createElement('p')
    let text = document.createTextNode('▼ ' + name)
    legend.appendChild(text)
    body.appendChild(legend)
    let c = document.createElement('canvas')
    body.appendChild(c)

    let config = {fitCanvas: true}
    config.canvas = c

    // load default
    let stormtroopers = new Image()
    stormtroopers.crossOrigin = 'Access-Control-Allow-Origin'
    stormtroopers.src = 'stormtroopers.jpg'

    stormtroopers.onload = function () {
      config.image = stormtroopers
      shaderfy.render(name, config)
    }
  }
})()
