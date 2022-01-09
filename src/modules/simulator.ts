// --------------------------------------------------------------
// reference
// https://nogson2.hatenablog.com/entry/2018/04/07/130727

// three.js sample
// https://threejs.org/examples/?q=gpg#webgl_gpgpu_birds
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_gpgpu_birds.html
// --------------------------------------------------------------

import * as THREE from 'three';
import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer';
import { positionFragmentShader } from '../glsl/positionShader';
import { GUIController } from './gui';
import { ParticlePositonParams } from './store';
import { updateParticlesPositionUniforms } from './update';

export class Simulator {
	private _gpuCompute
	private _variables: Variable[] = []
	private _positionMaterial = new THREE.ShaderMaterial()

	constructor(gl: THREE.WebGLRenderer, private _width: number, private _height: number) {
		this._gpuCompute = new GPUComputationRenderer(this._width, this._height, gl)
		this._setTexturePosition()
		this._setVariableDependencies()
		this._gpuCompute.init()
		const gui = GUIController.instance
		gui.initParticlePositionParams()
	}

	private _setTexturePosition = () => {
		// set the default position to texture
		const dtPosition = this._gpuCompute.createTexture()
		const theArray = dtPosition.image.data

		for (let i = 0; i < theArray.length; i += 4) {
			const r = Math.random() * 0.5
			const theta = Math.random() * Math.PI
			const phi = Math.random() * 2 * Math.PI
			const x = r * Math.sin(theta) * Math.sin(phi)
			const y = r * Math.cos(theta)
			const z = r * Math.sin(theta) * Math.cos(phi)
			const w = Math.random() * 0.5 + 0.5

			theArray[i + 0] = x
			theArray[i + 1] = y
			theArray[i + 2] = z
			theArray[i + 3] = w
		}

		// set fragment shader
		const positionVariable = this._gpuCompute.addVariable('texturePosition', positionFragmentShader, dtPosition)
		positionVariable.wrapS = THREE.RepeatWrapping
		positionVariable.wrapT = THREE.RepeatWrapping

		// set uniforms
		this._positionMaterial = positionVariable.material
		this._positionMaterial.uniforms['u_defaultTexture'] = { value: dtPosition.clone() }
		this._positionMaterial.uniforms['u_time'] = { value: 0 }
		this._positionMaterial.uniforms['u_frequency'] = { value: ParticlePositonParams.frequency.derive() }
		this._positionMaterial.uniforms['u_amplitude'] = { value: ParticlePositonParams.amplitude.derive() }
		this._positionMaterial.uniforms['u_divergence'] = { value: ParticlePositonParams.divergence.derive() }

		// add variable
		this._variables.push(positionVariable)
	}

	private _setVariableDependencies = () => {
		this._variables.forEach(variable => {
			this._gpuCompute.setVariableDependencies(variable, this._variables)
		})
		// it means.
		// this._gpuCompute.setVariableDependencies(positionVariable, [positionVariable, ...])
	}

	compute = () => {
		this._gpuCompute.compute()
		updateParticlesPositionUniforms(this._positionMaterial)
	}

	get texturePosition() {
		const variable = this._variables.find(v => v.name === 'texturePosition')!
		const target = this._gpuCompute.getCurrentRenderTarget(variable) as THREE.WebGLRenderTarget
		return target.texture
	}
}
