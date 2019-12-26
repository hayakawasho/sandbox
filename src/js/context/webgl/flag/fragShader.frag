precision highp float;

#pragma glslify: snoise = require(glsl-noise/simplex/2d)

uniform float time;
uniform float offset;
uniform sampler2D texture1;
varying vec2 vUv;

void main() {
  vec2 uv = vUv.xy;
  vec3 pos = vec3(uv.x, 1.0, uv.y) + time;

  float st_offset = -0.4 * snoise(pos.xz);
  st_offset = st_offset * offset;

  gl_FragColor = 1.0 * texture2D(texture1, uv + st_offset * 0.001);
}
