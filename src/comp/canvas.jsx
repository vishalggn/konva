import React from 'react';
import { Stage, Layer } from 'react-konva';
import Rectangle from './rectangle';

const Canvas = ({ rectangles, setRectangles, selectedId, selectShape }) => {
  const checkDeselect = (e) => {
    if (e.target === e.target.getStage()) {
      selectShape(null);
    }
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
    >
      <Layer>
        {rectangles.map((rect, i) => (
          <Rectangle
            key={rect.id}
            shapeProps={rect}
            isSelected={rect.id === selectedId}
            onSelect={() => selectShape(rect.id)}
            onChange={(newAttrs) => {
              const rects = rectangles.slice();
              rects[i] = newAttrs;
              setRectangles(rects);
            }}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
