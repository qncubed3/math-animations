import PlaneVisualization from './components/PlaneVisualisation';
import UnitCircleVisualization from './components/UnitCircleVisualisation';
import Card from './components/Card';
import { TransformFunction } from './components/TransformFunction';
import GraphTest from './components/GraphTest';
import ThreeDScene from './components/ThreeDScene';
import ThreeDAxisTest from './components/ThreeDAxisTest';

export default function App() {
  return (
    <div className="w-full bg-[#f5f5f5] min-h-screen px-5 py-10 font-sans flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-gray-900 mb-10 text-4xl font-bold">
          Math 
        </h1>
        
        
        <TransformFunction/>
        <GraphTest/>
        <ThreeDAxisTest/>

        <Card title="Test Card" description="This is a test">
          <div className="p-4">
            hi
          </div>
        </Card>
        <Card title="Test Card" description="This is a test">
          <div className="p-4">
            hi
          </div>
        </Card>
        
        <UnitCircleVisualization />
        <PlaneVisualization />
        <ThreeDScene/>
      </div>
    </div>
  );
}