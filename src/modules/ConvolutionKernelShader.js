import FragmentShader from './FragmentShader.js'
import convKernelCode from './../shaders/fragment-shaders/convKernelCode.js'

const computeKernelWeight = function(kernel) {
  let weight = kernel.reduce((prev, curr) => prev +curr)
  return weight <= 0 ? 1 : weight
}

const ConvolutionKernelShader = function(name, defaultUniforms) {
  defaultUniforms.u_kernelWeight = computeKernelWeight(defaultUniforms.u_kernel)
  FragmentShader.call(this, name, defaultUniforms)
}

ConvolutionKernelShader.prototype.text = convKernelCode

export default ConvolutionKernelShader