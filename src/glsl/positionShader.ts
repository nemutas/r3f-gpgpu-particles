import { curl } from './curl';

export const positionFragmentShader = `
uniform sampler2D u_defaultTexture;
uniform float u_time;
uniform float u_frequency; // 一体性
uniform	float u_amplitude; // 流動速度
uniform float u_divergence; // 発散性

const float dieSpeed = 0.99;

${curl}

void main()	{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 tmpPos = texture2D(texturePosition, uv);
	vec3 position = tmpPos.xyz;
	float life = tmpPos.w;

	if (life < 0.1) {
		vec4 defPos = texture2D(u_defaultTexture, uv);
		position = defPos.xyz;
		life = defPos.w;
	}

	float seed = u_time * 10.0; // 変化
	vec3 pos = position * u_frequency;

	vec3 target = position + u_amplitude * curl(seed, pos.x, pos.y, pos.z);
	target *= u_divergence;
	
	gl_FragColor = vec4(target, life * dieSpeed);
}
`
