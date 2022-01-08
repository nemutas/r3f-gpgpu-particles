import React, { useMemo, VFC } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { particlesFragmentShader, particlesVertexShader } from '../glsl/particlesShader';
import { GUIController } from '../modules/gui';
import { Simulator } from '../modules/simulator';
import { ParticleColors } from '../modules/store';
import { updateParticlesUniforms } from '../modules/update';

const [width, height] = [512, 512] as const

export const Particles: VFC = () => {
	// create simulator
	const { gl } = useThree()
	const simulator = useMemo(() => new Simulator(gl, width, height), [gl])

	// create attribute
	const vertices = useMemo(() => {
		const vertices: number[] = []
		for (let ix = 0; ix < width; ix++) {
			for (let iy = 0; iy < height; iy++) {
				// uv to access texture
				vertices.push(ix / width, iy / height, 0)
			}
		}
		return Float32Array.from(vertices)
	}, [])

	// make shader
	const matShader = useMemo(() => {
		const mat = new THREE.ShaderMaterial({
			uniforms: {
				u_texture: { value: null },
				u_color1: { value: new THREE.Color(ParticleColors.baseColor) },
				u_color2: { value: new THREE.Color(ParticleColors.color1) }
			},
			vertexShader: particlesVertexShader,
			fragmentShader: particlesFragmentShader
		})
		mat.transparent = true
		// mat.blending = THREE.NoBlending
		mat.blending = THREE.AdditiveBlending
		mat.name = 'pm1'
		return mat
	}, [])

	const matShader2 = useMemo(() => {
		const mat = matShader.clone()
		mat.uniforms.u_color2.value.set(ParticleColors.color2)
		mat.name = 'pm2'
		return mat
	}, [matShader])

	// controller
	const gui = GUIController.instance
	gui.initParticleColors()

	// frame loop
	useFrame(() => {
		simulator.compute()
		updateParticlesUniforms(matShader, simulator)
		updateParticlesUniforms(matShader2, simulator)
	})

	return (
		<>
			<points material={matShader}>
				<bufferGeometry>
					<bufferAttribute attachObject={['attributes', 'position']} args={[vertices, 3]} />
				</bufferGeometry>
			</points>
			<points material={matShader2} rotation={[Math.PI, 0, 0]}>
				<bufferGeometry>
					<bufferAttribute attachObject={['attributes', 'position']} args={[vertices, 3]} />
				</bufferGeometry>
			</points>
		</>
	)
}
