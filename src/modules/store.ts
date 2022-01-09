export const ParticleColors = { baseColor: '#fff', color1: '#caff57', color2: '#00bfff' }

export const UnrealBloomParams = { enabled: true, threshold: 0, strength: 0.8, radius: 1 }

export const ParticlePositonParams: { [name: string]: { value: any; derive: () => any } } = {
	dt: { value: 0.1, derive: () => ParticlePositonParams.dt.value * 0.01 },
	frequency: { value: 0.6, derive: () => ParticlePositonParams.frequency.value },
	amplitude: { value: 0.4, derive: () => ParticlePositonParams.amplitude.value * 0.1 },
	divergence: { value: 0.8, derive: () => 1 + ParticlePositonParams.divergence.value * 0.01 }
}
