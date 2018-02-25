;(function () {
  demo('normal')
  demo('pixelation')
  demo('edgeDetect1')

  function demo (name, canvas) {
    let body = document.querySelector('body')
    let legend = document.createElement('p')
    legend.classList.add('shader-title')
    let text = document.createTextNode(name)
    legend.appendChild(text)
    body.appendChild(legend)
    let c = document.createElement('canvas')
    c.setAttribute('id', `canvas_${name}`)
    body.appendChild(c)

    let config = {fitCanvas: true}
    config.canvas = c

    let codeArea = document.createElement('pre')
    let codeSnippet = document.createElement('code')
    codeSnippet.setAttribute('class','js')
    
    codeSnippet.innerHTML = `shaderfy.render('${name}', config)`
    codeArea.appendChild(codeSnippet)
    c.parentNode.insertBefore(codeArea, c.nextSibling)

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
