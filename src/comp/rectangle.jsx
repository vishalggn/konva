import React, { useRef, useEffect, useState } from 'react';
import { Image as KonvaImage, Text as KonvaText, Transformer, Group } from 'react-konva';

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image, setImage] = useState(null);
  const videoElement = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); 

  // Load image for 'image' type
  useEffect(() => {
    if (shapeProps.type === 'image') {
      const img = new window.Image();
      img.src = shapeProps.source;
      img.onload = () => setImage(img);
    }
  }, [shapeProps.type, shapeProps.source]);

  // Load and play video for 'video' type
  useEffect(() => {
    if (shapeProps.type === 'video') {
      const video = document.createElement('video');
      video.src = shapeProps.source;
      video.crossOrigin = 'anonymous'; 
      video.loop = true;
      if (isPlaying) {
        video.play();
      }
      videoElement.current = video;

      const layer = shapeRef.current?.getLayer();
      const anim = new Konva.Animation(() => {
        if (shapeRef.current) {
          layer.batchDraw(); 
        }
      }, layer);

      anim.start();

      return () => {
        anim.stop();
      };
    }
  }, [shapeProps.type, shapeProps.source, isPlaying]);

  // Transformer logic for selected shape
  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Toggle video play/pause
  const togglePlayPause = () => {
    if (videoElement.current) {
      if (isPlaying) {
        videoElement.current.pause();
      } else {
        videoElement.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleStop = () => {
    if (videoElement.current) {
      videoElement.current.pause(); 
      videoElement.current.currentTime = 0; 
      setIsPlaying(false); 
    }
  };
  
  // Render image rectangle
  if (shapeProps.type === 'image') {
    return (
      <>
        <KonvaImage
          image={image}
          {...shapeProps}
          ref={shapeRef}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
            });
          }}
        />
        {isSelected && <Transformer ref={trRef} />}
      </>
    );
  }

  // Render video rectangle with play/pause button
  if (shapeProps.type === 'video') {
    return (
      <>
        <Group
          draggable
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
            });
          }}
        >
          {/* Video Element */}
          <KonvaImage
            {...shapeProps}
            ref={shapeRef}
            image={videoElement.current} 
          />
          {/* Play/Pause Button */}
          <KonvaText
            text={isPlaying ? 'Pause' : 'Play'}
            fontSize={16}
            fill="white"
            x={shapeProps.x + 10}
            y={shapeProps.y + 10}
            padding={5}
            draggable={false}
            onClick={togglePlayPause}
          />
          <KonvaText
            text='Stop'
            fontSize={16}
            fill="white"
            x={shapeProps.x + 70}
            y={shapeProps.y + 10}
            padding={5}
            draggable={false}
            onClick={toggleStop}
          />
        </Group>
        {isSelected && <Transformer ref={trRef} />}
      </>
    );
  }

  // Render text rectangle with font resizing
  if (shapeProps.type === 'text') {
    return (
      <>
        <KonvaText
          {...shapeProps}
          ref={shapeRef}
          draggable
          fontSize={shapeProps.fontSize || 20}
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);

            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
              fontSize: Math.max(5, (shapeProps.fontSize || 20) * scaleX), 
            });
          }}
        />
        {isSelected && <Transformer ref={trRef} />}
      </>
    );
  }

  return null;
};

export default Rectangle;
