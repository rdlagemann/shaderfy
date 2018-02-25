const FragmentShader = function(name, text, defaultUniforms) {
    return {
      name,
      text,
      defaultUniforms
    }
}

FragmentShader.prototype.type = 'x-shader/x-fragment'

export default FragmentShader