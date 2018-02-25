// based on Agnius Vasiliauskas's original work
// http://coding-experiments.blogspot.com.br/2010/06/pixelation.html
export default `precision mediump float;

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