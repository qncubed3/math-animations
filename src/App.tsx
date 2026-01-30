// import PlaneVisualization from './examples/PlaneVisualisation';
// import UnitCircleVisualization from './examples/UnitCircleVisualisation';
// import Card from './components/Card';
import { TransformFunction } from './examples/TransformFunction';
import GraphTest from './examples/GraphTest';
// import ThreeDScene from './examples/ThreeDScene';
import ThreeDAxisTest from './examples/ThreeDAxisTest';
import VolumeOfRevolution from './examples/VolumeOfRevolution';
import UnitCircle from './examples/UnitCircle';
import CompoundVisualiser from './examples/CompoundVisualiser';
import Esterification from './examples/Esterification';
import Test from './examples/Esterification';

export default function App() {
    return (
		<div className="w-full bg-[#f5f5f5] min-h-screen px-5 py-10 font-sans flex flex-col items-center">
			<div className="w-full max-w-4xl">
				<h1 className="text-gray-900 mb-10 text-4xl font-bold">
					Math and Science Interactive Lessons Prototype
				</h1>
					
				<Esterification/>
				<TransformFunction/>
				{/* <GraphTest/> */}
				<ThreeDAxisTest/>
				<CompoundVisualiser/>
				<VolumeOfRevolution/>
				<UnitCircle/>
				
				
				
				{/* <UnitCircleVisualization /> */}
				{/* <PlaneVisualization /> */}
				{/* <ThreeDScene/> */}
			</div>
		</div>
    );
}