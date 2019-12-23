#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
uniform float time;

void main(){
	gl_FragColor = vec4(vUv, sin(time), 1.0);
}
