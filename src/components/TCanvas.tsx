import React, { VFC } from 'react';
import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Effect } from './Effect';
import { Particles } from './Particles';

export const TCanvas: VFC = () => {
	return (
		<Canvas
			camera={{
				position: [4, 4, 4],
				fov: 50,
				aspect: window.innerWidth / window.innerHeight,
				near: 0.1,
				far: 2000
			}}
			dpr={window.devicePixelRatio}
			shadows>
			{/* canvas color */}
			<color attach="background" args={['#000']} />
			{/* camera controller */}
			<OrbitControls attach="orbitControls" />
			{/* objects */}
			<Particles />
			<Effect />
			{/* helper */}
			<Stats />
		</Canvas>
	)
}
