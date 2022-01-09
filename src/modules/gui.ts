import GUI from 'lil-gui';
import { ParticleColors, ParticlePositonParams, UnrealBloomParams } from './store';

export class GUIController {
	private static _instance: GUIController | null
	private _gui

	private constructor() {
		this._gui = new GUI()
	}

	static get instance() {
		if (!this._instance) {
			this._instance = new GUIController()
		}
		return this._instance
	}

	private _folder = (title: string) => {
		let folder = this._gui.folders.find(f => f._title === title)
		if (!folder) folder = this._gui.addFolder(title)
		return folder
	}

	private _uncontainedName = (folder: GUI, name: string) => {
		return !folder.controllers.find(c => c._name === name)
	}

	initParticleColors = () => {
		const folder = this._folder('Particles')
		this._uncontainedName(folder, 'baseColor') && folder.addColor(ParticleColors, 'baseColor')
		this._uncontainedName(folder, 'color1') && folder.addColor(ParticleColors, 'color1')
		this._uncontainedName(folder, 'color2') && folder.addColor(ParticleColors, 'color2')
	}

	initParticlePositionParams = () => {
		const folder = this._folder('Particles')

		const add = (name: string, param: [number, number, number]) => {
			this._uncontainedName(folder, name) && folder.add(ParticlePositonParams[name], 'value', ...param).name(name)
		}

		add('dt', [0, 1, 0.01])
		add('frequency', [0, 1, 0.01])
		add('amplitude', [0, 1, 0.01])
		add('divergence', [0, 2, 0.01])
	}

	initUnrealBloom = () => {
		const folder = this._folder('UnrealBloom')

		const add = (name: string, param?: [number, number, number]) => {
			if (param) {
				this._uncontainedName(folder, name) && folder.add(UnrealBloomParams, name, ...param)
			} else {
				this._uncontainedName(folder, name) && folder.add(UnrealBloomParams, name)
			}
		}

		add('enabled')
		add('threshold', [0, 1, 0.01])
		add('strength', [0, 3, 0.01])
		add('radius', [0, 1, 0.01])
	}
}
