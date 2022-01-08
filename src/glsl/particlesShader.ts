export const particlesVertexShader = `
uniform sampler2D u_texture;
varying float v_life;

void main() {
  vec4 positionInfo = texture2D(u_texture, position.xy);
	vec4 mvPosition = modelViewMatrix * vec4(positionInfo.xyz, 1.0);

	v_life = positionInfo.w;

	gl_PointSize = positionInfo.w / length(mvPosition.xyz) * 10.0;
	gl_Position = projectionMatrix * mvPosition;
}
`

export const particlesFragmentShader = `
uniform vec3 u_color1;
uniform vec3 u_color2;
varying float v_life;

void main() {
	vec3 color = mix(u_color2, u_color1, v_life);
	
	gl_FragColor = vec4(color, v_life);
}
`
