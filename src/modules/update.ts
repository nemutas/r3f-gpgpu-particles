import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Simulator } from './simulator';
import { ParticleColors, ParticlePositonParams, UnrealBloomParams } from './store';

export const updateUnrealBloom = (pass: UnrealBloomPass) => {
	pass.enabled = UnrealBloomParams.enabled
	pass.threshold = UnrealBloomParams.threshold
	pass.strength = UnrealBloomParams.strength
	pass.radius = UnrealBloomParams.radius
}

export const updateParticlesUniforms = (material: THREE.ShaderMaterial, simulator: Simulator) => {
	material.uniforms.u_texture.value = simulator.texturePosition
	material.uniforms.u_color1.value.set(ParticleColors.baseColor)

	switch (material.name) {
		case 'pm1':
			material.uniforms.u_color2.value.set(ParticleColors.color1)
			break
		case 'pm2':
			material.uniforms.u_color2.value.set(ParticleColors.color2)
			break
	}
}

export const updateParticlesPositionUniforms = (material: THREE.ShaderMaterial) => {
	material.uniforms.u_time.value += ParticlePositonParams.dt * 0.01
	material.uniforms.u_frequency.value = ParticlePositonParams.frequency
	material.uniforms.u_amplitude.value = ParticlePositonParams.amplitude * 0.1
	material.uniforms.u_divergence.value = 1 + ParticlePositonParams.divergence * 0.01
}
