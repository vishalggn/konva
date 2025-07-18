import React from 'react';
import Canvas from './comp/canvas';
import './canvas.css';

const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 300,
    height: 300,
    type: 'image',
    source: 'https://i.ibb.co/VYzJYvyV/tree-736885-1280-2.jpg',
    id: 'rect1',
  },
  {
    x: 150,
    y: 150,
    width: 300,
    height: 200,
    type: 'video',
    source: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 
    id: 'rect2',
  },
  {
    x: 300,
    y: 300,
    width: 150,
    height: 50,
    type: 'text',
    text: 'Hi! I am a text rectangle',
    id: 'rect3',
    visible: true, 
  },
];

const App = () => {
  const [rectangles, setRectangles] = React.useState(initialRectangles);
  const [selectedId, selectShape] = React.useState(null);

  const toggleTextVisibility = () => {
    setRectangles((prev) =>
      prev.map((rect) =>
        rect.id === 'rect3' ? { ...rect, visible: !rect.visible } : rect
      )
    );
  };

  const handlePositionChange = (e) => {
    const position = e.target.value;
    setRectangles((prev) =>
      prev.map((rect) =>
        rect.id === 'rect3'
          ? {
              ...rect,
              x: position === 'Left' ? 0 : rect.x,
              y: position === 'Top' ? 0 : rect.y,
              ...(position === 'Bottom' && { y: window.innerHeight - rect.height }),
              ...(position === 'Right' && { x: window.innerWidth - rect.width }),
            }
          : rect
      )
    );
  };

  const isTextVisible = rectangles.find((rect) => rect.id === 'rect3')?.visible;

  return (
    <div>
      <div className="canvas">
        <Canvas
          rectangles={rectangles}
          setRectangles={setRectangles}
          selectedId={selectedId}
          selectShape={selectShape}
        />
      </div>
      <div className="forText">
        <button onClick={toggleTextVisibility}>
          {isTextVisible ? 'Remove Text' : 'Add Text'}
        </button>
        <select name="position" id="position" onChange={handlePositionChange}>
          <option value="Top">Top</option>
          <option value="Bottom">Bottom</option>
          <option value="Left">Left</option>
          <option value="Right">Right</option>
        </select>
      </div>
    </div>
  );
};

export default App;
