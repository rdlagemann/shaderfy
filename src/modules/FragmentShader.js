const FragmentShader = function(name, defaultUniforms, text) {
    if(text) {
        this.text = text
    }
    this.name = name
    this.defaultUniforms = defaultUniforms
}

FragmentShader.prototype.type = 'x-shader/x-fragment'

export default FragmentShader