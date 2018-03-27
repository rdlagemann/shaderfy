import {render as renderHelp} from './render.js'

import VertexShader from './modules/VertexShader.js'

import FragmentShader from './modules/FragmentShader.js'
import ConvolutionKernelShader from './modules/ConvolutionKernelShader';

import normalCode from './shaders/fragment-shaders/normalCode.js'
import pixelationCode from './shaders/fragment-shaders/pixelationCode.js'

const filters = {
  normal: new FragmentShader('normal', {}, normalCode),

  pixelation: new FragmentShader('pixelation', {
    pixel_h: 5,
    pixel_w: 5
  }, pixelationCode),
  
  edgeDetect: new ConvolutionKernelShader('edgeDetect', {
    u_kernel: [
      -0.125, -0.125, -0.125,
      -0.125,  1,     -0.125,
      -0.125, -0.125, -0.125
    ]
  }),
  
  edgeDetect2: new ConvolutionKernelShader('edgeDetect2', {
    u_kernel: [
      -1, -1, -1,
      -1,  8, -1,
      -1, -1, -1
    ]
  }),

  edgeDetect3: new ConvolutionKernelShader('edgeDetect2', {
    u_kernel: [
      -5, 0, 0,
      0, 0, 0,
      0, 0, 5
    ]
  }),

  edgeDetect4: new ConvolutionKernelShader('edgeDetect2', {
    u_kernel: [
      -1, -1, -1,
      0,  0,  0,
      1,  1,  1
    ]
  }),

  edgeDetect5: new ConvolutionKernelShader('edgeDetect2', {
    u_kernel: [
      -1, -1, -1,
      2,  2,  2,
      -1, -1, -1
    ]
  }),

  edgeDetect6: new ConvolutionKernelShader('edgeDetect2', {
    u_kernel: [
      -5, -5, -5,
      -5, 39, -5,
      -5, -5, -5
    ]
  }),

  gaussianBlur: new ConvolutionKernelShader('gaussianBlur', {
    u_kernel: [
      1, 20, 10,
      20, 4, 2,
      1, 2, 10
    ]
  }),

  gaussianBlur2: new ConvolutionKernelShader('gaussianBlur2', {
    u_kernel: [
      1, 2, 1,
      2, 4, 2,
      1, 2, 1
    ]
  }),

  gaussianBlur3: new ConvolutionKernelShader('gaussianBlur3', {
    u_kernel: [
      0, 1, 0,
      1, 1, 1,
      0, 1, 0
    ]
  }),
  
  unsharpen: new ConvolutionKernelShader('unsharpen', {
    u_kernel: [
      -1, -1, -1,
      -1,  9, -1,
      -1, -1, -1
    ]
  }),

  sharpness: new ConvolutionKernelShader('sharpness', {
    u_kernel: [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ]
  }),

  sharpen: new ConvolutionKernelShader('sharpen', {
    u_kernel: [
      -1, -1, -1,
      -1, 16, -1,
      -1, -1, -1
    ]
  }),

 
  //   sobelHorizontal: [
      //   1,  2,  1,
      //   0,  0,  0,
      //  -1, -2, -1
  //   ],
  //   sobelVertical: [
  //       1,  0, -1,
  //       2,  0, -2,
  //       1,  0, -1
  //   ],
  //   previtHorizontal: [
  //       1,  1,  1,
  //       0,  0,  0,
  //      -1, -1, -1
  //   ],
  //   previtVertical: [
  //       1,  0, -1,
  //       1,  0, -1,
  //       1,  0, -1
  //   ],
  //   boxBlur: [
  //       0.111, 0.111, 0.111,
  //       0.111, 0.111, 0.111,
  //       0.111, 0.111, 0.111
  //   ],
  //   triangleBlur: [
  //       0.0625, 0.125, 0.0625,
  //       0.125,  0.25,  0.125,
  //       0.0625, 0.125, 0.0625
  //   ],
  //   emboss: [
  //      -2, -1,  0,
  //      -1,  1,  1,
  //       0,  1,  2
  //   ]
}

const render = function(shaderName, config) {
  const fragShader = filters[shaderName]
  renderHelp(fragShader, config, undefined)
}

const createVertexShader = function(text){
  return new VertexShader()
}

const createFragmentShader = function(name, defaultUniforms, text) {
  const frag = new FragmentShader(name, defaultUniforms)
  frag.text = text
  filters[name] = frag
  return frag
}

const createConvolutionShader = function(name, u_kernel) {
  const frag = new ConvolutionKernelShader(name, {u_kernel})
  filters[name] = frag
  return frag
}

export default {
  render,
  filters,
  createVertexShader,
  createFragmentShader,
  createConvolutionShader
}

