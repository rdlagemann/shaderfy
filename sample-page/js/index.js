;(function () {
  for(let filter in shaderfy.filters) {
    demo(filter)
  }

  function demo (name, canvas) {
    // load default
    let stormtroopers = new Image()
    stormtroopers.crossOrigin = 'Access-Control-Allow-Origin'
    stormtroopers.src = 'stormtroopers.jpg'

    let body = document.querySelector('body')
    
    let c = document.createElement('canvas')
    c.setAttribute('id', `canvas_${name}`)
    // let p = document.createElement('p')
    // p.innerHTML = `${name}`
    body.appendChild(c)
    // c.parentNode.insertBefore(p, c.nextSibling)
    
    let config = {stretchToCanvas: true}
    config.canvas = c

    stormtroopers.onload = function () {
      config.image = stormtroopers
      shaderfy.render(name, config)
    }
  }
})()
