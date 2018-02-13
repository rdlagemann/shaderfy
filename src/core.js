(function (root, factory) {
  if (!root.shaderfy) {
    root.shaderfy = factory.call(root)
  }
}(window, function () {

  const verifyUniforms = uniforms => {
    for (let uniform in uniforms) {
      if (typeof +uniforms[uniform] !== 'number') {
        throw new TypeError(`${uniform} must be a Number`)
      }
    }
  }
  // TODO: this function must be improved
  const validateConfig = config => {
    if (!config) throw new Error('You should specify a config object')
    if (config.canvas.nodeName !== 'CANVAS') throw new Error('config.canvas must be a Canvas element')
    if (config.uniforms) verifyUniforms(config.uniforms)
  }

  // default vertex shader from WebGL Fundamentals
  const vertexShader = {
    type: 'x-shader/x-vector',
    text: `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    
    uniform vec2 u_resolution;
    
    varying vec2 v_texCoord;
    
    void main() {
       // convert the rectangle from pixels to 0.0 to 1.0
       vec2 zeroToOne = a_position / u_resolution;
    
       // convert from 0->1 to 0->2
       vec2 zeroToTwo = zeroToOne * 2.0;
    
       // convert from 0->2 to -1->+1 (clipspace)
       vec2 clipSpace = zeroToTwo - 1.0;
    
       gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    
       // pass the texCoord to the fragment shader
       // The GPU will interpolate this value between points.
       v_texCoord = a_texCoord;
    }
    `
  }

  // here are the image processing fragment shaders
  const fragmentShaders = {
    pixelation: {
      name: 'pixelation',
      type: 'x-shader/x-fragment',
      defaultUniforms: {
        pixel_h: 5,
        pixel_w: 5
      },
      text: `
      precision mediump float;
    
      uniform sampler2D u_image;  
      uniform vec2 u_textureSize;
      
      varying vec2 v_texCoord;
      uniform float pixel_h;
      uniform float pixel_w;
      
      void main() {
        float dx = pixel_w*(1./u_textureSize.x);
        float dy = pixel_h*(1./u_textureSize.y);
        vec2 coord = vec2(dx*floor(v_texCoord.x/dx), dy*floor(v_texCoord.y/dy));
        
        gl_FragColor = texture2D(u_image, coord);
      }`
    },
    anotherShader: {
      name: 'anotherShader',
      type: 'x-shader/x-fragment',
      defaultUniforms: {
        uniformX: 999
      },
      text: ` 
        precision mediump float;

        uniform sampler2D u_image;
        uniform float uniformX;

        varying vec2 v_texCoord;        
        
        void main() {
          vec2 coord = vec2(v_texCoord.x, v_texCoord.y);
          gl_FragColor = texture2D(u_image, coord);
        }
      `
    }

  }

  // modified from WebGl Fundamentals boilerplate to fit our needs
  // https://webglfundamentals.org/webgl/lessons/webgl-image-processing.html
  const render = (shaderName, config) => {
    // some validation
    validateConfig(config)
    if (!fragmentShaders[shaderName]) throw new Error(shaderName + " is not defined in shaderfy's file 'core.js'")
    if (!config.uniforms) config.uniforms = fragmentShaders[shaderName].defaultUniforms

    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = config.canvas
    var image = config.image
    var fragShader = fragmentShaders[shaderName]

    var gl = canvas.getContext('webgl')

    if (config.fitCanvas) {
      canvas.width = image.width
      canvas.height = image.height
    }

    // important to be able to call toDataUrl() and save the image
    gl.getContextAttributes().preserveDrawingBuffer = true

    if (!gl) {
      return void window.alert('WebGL is not available on your machine')
    }

    // setup GLSL program
    var program = webglUtils.createProgramFromObjects(gl, [vertexShader, fragShader])

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, 'a_position')
    var texcoordLocation = gl.getAttribLocation(program, 'a_texCoord')

    // Create a buffer to put three 2d clip space points in
    var positionBuffer = gl.createBuffer()

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    // Set a rectangle the same size as the image.
    setRectangle(gl, 0, 0, image.width, image.height)

    // provide texture coordinates for the rectangle.
    var texcoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0
    ]), gl.STATIC_DRAW)

    // Create a texture.
    var texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    // lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
    var textureSizeLocation = gl.getUniformLocation(program, 'u_textureSize')

    webglUtils.resizeCanvasToDisplaySize(gl.canvas)

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program)

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation)

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2          // 2 components per iteration
    var type = gl.FLOAT   // the data is 32bit floats
    var normalize = false // don't normalize the data
    var stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset)

    // Turn on the teccord attribute
    gl.enableVertexAttribArray(texcoordLocation)

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2          // 2 components per iteration
    var type = gl.FLOAT   // the data is 32bit floats
    var normalize = false // don't normalize the data
    var stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        texcoordLocation, size, type, normalize, stride, offset)

    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)
    // set the size of the image
    gl.uniform2f(textureSizeLocation, image.width, image.height)

    // always using float type for uniforms, maybe expand to test integer etc
    for (let uniform in config.uniforms) {
      gl.uniform1f(gl.getUniformLocation(program, uniform), config.uniforms[uniform])
    }

    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES
    var offset = 0
    var count = 6
    gl.drawArrays(primitiveType, offset, count)
  }

  function setRectangle (gl, x, y, width, height) {
    var x1 = x
    var x2 = x + width
    var y1 = y
    var y2 = y + height

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2
    ]), gl.STATIC_DRAW)
  }

  return {
    render
  }
}))
