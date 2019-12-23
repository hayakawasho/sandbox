
#pragma glslify: snoise = require(glsl-noise/simplex/3d)

varying vec2 vUv;
varying float noise;
uniform float time;
uniform vec2 resolution;

const float amplitude1 = 0.5;

const float speed = 0.4;

void main() {
  vUv = uv;
  noise = snoise(vec3(normal * amplitude1 + time * speed));

  vec3 p = position + normal * noise * 3.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
