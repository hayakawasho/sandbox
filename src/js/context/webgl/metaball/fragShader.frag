precision highp float;

#pragma glslify: PI = require('./PI')
#pragma glslify: hsv2rgb = require('./hsv2rgb')

varying vec2 vUv;
uniform float time;

void main() {
  vec3 color = hsv2rgb(cos(time * PI / 180.0 * 6.0), vUv.x, 1.0);
	gl_FragColor = vec4(color, 1.0);
}
