import { useEffect, useRef, VFC } from 'react';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { GUIController } from '../modules/gui';
import { UnrealBloomParams } from '../modules/store';
import { updateUnrealBloom } from '../modules/update';

extend({ EffectComposer, RenderPass, ShaderPass, UnrealBloomPass })

export const Effect: VFC = () => {
	const passRef = useRef<UnrealBloomPass>(null)

	const gui = GUIController.instance
	gui.initUnrealBloom()

	const composerRef = useRef<EffectComposer>(null)
	const { gl, scene, camera, size } = useThree()

	useEffect(() => {
		composerRef.current!.setSize(size.width, size.height)
	}, [size])

	useFrame(() => {
		updateUnrealBloom(passRef.current!)
		composerRef.current!.render()
	}, 1)

	return (
		<effectComposer ref={composerRef} args={[gl]}>
			<renderPass attachArray="passes" args={[scene, camera]} />
			<unrealBloomPass ref={passRef} attachArray="passes" {...UnrealBloomParams} />
		</effectComposer>
	)
}
