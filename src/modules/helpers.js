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

export {verifyUniforms, validateConfig}