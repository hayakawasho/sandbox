precision highp float;

#pragma glslify: PI = require('../_lib/PI')
#pragma glslify: hsv2rgb = require('../_lib/hsv2rgb')
#pragma glslify: easeOutCubic = require('glsl-easings/cubic-out')

varying vec2 vUv;
uniform float time;

void main() {
  vec3 color = hsv2rgb(
    sin(time * PI / 60.0) * easeOutCubic(vUv.x),
    easeOutCubic(vUv.x),
    1.0
  );
	gl_FragColor = vec4(color, 1.0);
}
