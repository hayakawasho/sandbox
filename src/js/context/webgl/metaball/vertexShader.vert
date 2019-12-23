
#pragma glslify: cnoise = require(glsl-noise/classic/3d)

varying vec2 vUv;
varying float noise;
uniform float time;
uniform vec2 resolution;

//グネグネの振り幅
const float amplitude1 = 0.5;
//グネグネのスピード
const float speed = 0.25;

void main() {
  vUv = uv;
  noise = cnoise( vec3(normal * amplitude1 + time * speed));

  vec3 p = position + normal * noise * 5.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}
