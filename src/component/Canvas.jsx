import React, { useRef, useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text,
  Transformer,
} from "react-konva";
import Toolbar from "./toolbar";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;

function Canvas() {
  const layerRef = useRef(null);
  const isPlayingRef = useRef(true);

  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const transformerRef = useRef(null);
  const elementRefs = useRef({});
  const [showVideoControl, setShowVideoControl] = useState(false);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const saveHistory = (newState) => {
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
    setElements(newState);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack((prev) => [elements, ...prev]);
    setHistory((prev) => prev.slice(0, -1));
    setElements(previous);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory((prev) => [...prev, elements]);
    setRedoStack((prev) => prev.slice(1));
    setElements(next);
  };

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      const image = new window.Image();
      image.src = url;

      image.onload = () => {
        const defaultHeight = 200;
        const aspectRatio = image.width / image.height;
        const scaledWidth = defaultHeight * aspectRatio;

        const newEl = {
          id: Date.now(),
          type: "image",
          content: image,
          x: 100,
          y: 100,
          width: scaledWidth,
          height: defaultHeight,
        };

        saveHistory([...elements, newEl]);
      };
    };
    input.click();
  };

  const addVideo = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const url = URL.createObjectURL(file);

      const video = document.createElement("video");
      video.src = url;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      videoRef.current = video;

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 420;
      canvas.height = 280;

      // ✅ Link canvas to video for use in updateFrame
      videoRef.current.canvasRef = canvas;

      const updateFrame = () => {
        if (videoRef.current && isPlayingRef.current && layerRef.current) {
          const ctx = canvas.getContext("2d");
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          layerRef.current.batchDraw();
        }
        requestAnimationFrame(updateFrame);
      };

      video.addEventListener("canplay", () => {
        video
          .play()
          .then(() => {
            isPlayingRef.current = true; // ✅ update ref
            setIsPlaying(true); // ✅ update state
            requestAnimationFrame(updateFrame);
          })
          .catch((err) => {
            console.warn("Autoplay blocked:", err);
          });
      });

      const newEl = {
        id: Date.now(),
        type: "video",
        content: canvas,
        x: 100,
        y: 100,
        width: canvas.width,
        height: canvas.height,
      };

      saveHistory([...elements, newEl]);
    };

    input.click();
  };

  const addText = () => {
    const text = prompt("Enter text:");
    if (!text) return;
    const newEl = {
      id: Date.now(),
      type: "text",
      content: text,
      x: 100,
      y: 100,
    };
    saveHistory([...elements, newEl]);
  };

  const bringTop = () => {
    if (!selectedId) return;
    const el = elements.find((e) => e.id === selectedId);
    const others = elements.filter((e) => e.id !== selectedId);
    saveHistory([...others, el]);
  };

  const sendBack = () => {
    if (!selectedId) return;
    const el = elements.find((e) => e.id === selectedId);
    const others = elements.filter((e) => e.id !== selectedId);
    saveHistory([el, ...others]);
  };

  const topPosition = () => {
    if (!selectedId) return;
    const updated = elements.map((el) =>
      el.id === selectedId ? { ...el, y: 0 } : el
    );
    saveHistory(updated);
  };

  const bottomPosition = () => {
    if (!selectedId) return;
    const el = elements.find((e) => e.id === selectedId);
    const height = el.height || 30; // default height if missing
    const updated = elements.map((e) =>
      e.id === selectedId ? { ...e, y: CANVAS_HEIGHT - height } : e
    );
    saveHistory(updated);
  };

  const leftPosition = () => {
    if (!selectedId) return;
    const updated = elements.map((el) =>
      el.id === selectedId ? { ...el, x: 0 } : el
    );
    saveHistory(updated);
  };

  const rightPosition = () => {
    if (!selectedId) return;
    const el = elements.find((e) => e.id === selectedId);
    const width = el.width || 30; // default width if missing
    const updated = elements.map((e) =>
      e.id === selectedId ? { ...e, x: CANVAS_WIDTH - width } : e
    );
    saveHistory(updated);
  };

  const playPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      isPlayingRef.current = true;
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  };

  const pause = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    isPlayingRef.current = false;
    setIsPlaying(false);
  };

  useEffect(() => {
    const node = elementRefs.current[selectedId];
    if (node && transformerRef.current) {
      transformerRef.current.nodes([node]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId, elements]);

  return (
    <div className="bg-white w-[1200px] mx-auto">
      <Toolbar
        addText={addText}
        addImage={addImage}
        addVideo={addVideo}
        bringTop={bringTop}
        sendBack={sendBack}
        undo={undo}
        redo={redo}
        topPosition={topPosition}
        bottomPosition={bottomPosition}
        leftPosition={leftPosition}
        rightPosition={rightPosition}
        showVideoControl={showVideoControl}
        playPause={playPause}
        isPlaying={isPlaying}
        pause={pause}
      />
      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer ref={layerRef}>
          {elements.map((el) => {
            if (el.type === "image" || el.type === "video") {
              return (
                <KonvaImage
                  key={el.id}
                  image={el.content}
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                  draggable
                  ref={(node) => (elementRefs.current[el.id] = node)}
                  onClick={() => {
                    setSelectedId(el.id);
                    setShowVideoControl(el.type === "video");
                  }}
                  onDragEnd={(e) => {
                    setElements((prev) =>
                      prev.map((item) =>
                        item.id === el.id
                          ? { ...item, x: e.target.x(), y: e.target.y() }
                          : item
                      )
                    );
                  }}
                />
              );
            } else if (el.type === "text") {
              return (
                <Text
                  key={el.id}
                  text={el.content}
                  x={el.x}
                  y={el.y}
                  draggable
                  fontSize={20}
                  ref={(node) => (elementRefs.current[el.id] = node)}
                  onClick={() => setSelectedId(el.id)}
                  onDragEnd={(e) => {
                    const updated = elements.map((item) =>
                      item.id === el.id
                        ? { ...item, x: e.target.x(), y: e.target.y() }
                        : item
                    );
                    saveHistory(updated);
                  }}
                />
              );
            } else return null;
          })}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </div>
  );
}

export default Canvas;
