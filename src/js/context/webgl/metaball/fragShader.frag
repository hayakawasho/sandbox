precision highp float;

#pragma glslify: PI = require('../_lib/PI')
#pragma glslify: hsv2rgb = require('../_lib/hsv2rgb')
#pragma glslify: easeOutCubic = require('glsl-easings/cubic-out')
#pragma glslify: easeInCubic = require('glsl-easings/cubic-in')

varying vec2 vUv;
uniform float time;

void main() {
  vec3 color = hsv2rgb(
    cos(time * PI / 45.0) * easeOutCubic(vUv.x),
    easeInCubic(vUv.x) * 2.5,
    1.0
  );
	gl_FragColor = vec4(color, 1.0);
}
