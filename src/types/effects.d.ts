import { UnrealBloomPass } from 'three-stdlib';
import { ReactThreeFiber } from '@react-three/fiber';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			unrealBloomPass: ReactThreeFiber.Node<UnrealBloomPass, typeof UnrealBloomPass>
		}
	}
}
