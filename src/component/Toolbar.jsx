import React, { useState } from "react";

function Toolbar({
  addImage,
  addVideo,
  addText,
  bringTop,
  sendBack,
  undo,
  redo,
  topPosition,
  bottomPosition,
  leftPosition,
  rightPosition,
  showVideoControl,
  isPlaying,
  playPause,
  pause,
}) {
  const [showArrows, setShowArrows] = useState(false);

  const handleChangePosition = () => {
    setShowArrows((prev) => {
      if (!prev) {
        return true;
      } else {
        return false;
      }
    });
  };

  return (
    <div>
      {/* Top Toolbar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-xl p-2 flex flex-wrap gap-2 z-50">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          onClick={addText}
        >
          Add Text
        </button>
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm"
          onClick={addImage}
        >
          Add Image
        </button>
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded text-sm"
          onClick={addVideo}
        >
          Add Video
        </button>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
          onClick={handleChangePosition}
        >
          Change Position
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
          onClick={undo}
        >
          Undo
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          onClick={redo}
        >
          Redo
        </button>
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
          onClick={bringTop}
        >
          Bring Top
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          onClick={sendBack}
        >
          Send Back
        </button>
      </div>

      {/* Directional Arrows */}
      {showArrows && (
        <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="relative w-40 h-40">
            <button
              className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl pointer-events-auto p-3 bg-gray-600 rounded-2xl"
              onClick={topPosition}
            >
              ⬆️
            </button>
            <button
              className="absolute bottom-0 left-1/2 -translate-x-1/2 text-2xl pointer-events-auto p-3 bg-gray-600 rounded-2xl"
              onClick={bottomPosition}
            >
              ⬇️
            </button>
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl pointer-events-auto p-3 bg-gray-600 rounded-2xl"
              onClick={leftPosition}
            >
              ⬅️
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl pointer-events-auto p-3  bg-gray-600 rounded-2xl"
              onClick={rightPosition}
            >
              ➡️
            </button>
          </div>
        </div>
      )}
      {showVideoControl && (
        <div className="fixed top-4 right-4 z-40 pointer-events-auto">
          <div className="flex flex-col gap-2 bg-white shadow-lg p-2 rounded-xl">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
              onClick={playPause}
            >
              {isPlaying ? "⏸ Pause" : "▶️ Play"}
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
              onClick={pause}
            >
              ❌ Force Pause
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Toolbar;
