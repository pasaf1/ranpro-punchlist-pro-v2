import React, { useEffect, useRef, useState } from 'react';
import fabric from 'fabric';
import { useConstructionStore } from '../../stores/constructionStore.js'; // <--- התיקון נמצא כאן
import toast from 'react-hot-toast';

const ConstructionCanvas = () => {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);

  const { addPin, pins, backgroundImage } = useConstructionStore(state => ({
    addPin: state.addPin,
    pins: state.pins,
    backgroundImage: state.backgroundImage,
  }));

  useEffect(() => {
    if (canvasRef.current) {
        const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasRef.current.parentElement.offsetWidth,
        height: canvasRef.current.parentElement.offsetHeight,
        backgroundColor: '#f0f0f0',
        });
        setFabricCanvas(canvas);

        return () => {
        canvas.dispose();
        };
    }
  }, []);

  useEffect(() => {
    if (backgroundImage && fabricCanvas) {
      fabric.Image.fromURL(backgroundImage, (img) => {
        fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas), {
          scaleX: fabricCanvas.width / img.width,
          scaleY: fabricCanvas.height / img.height,
        });
      });
    }
  }, [backgroundImage, fabricCanvas]);

  useEffect(() => {
    if (fabricCanvas) {
      const handleMouseDown = (options) => {
        if (options.target) return;
        const pointer = fabricCanvas.getPointer(options.e);
        addPin({
          x: pointer.x, y: pointer.y, status: 'open',
        });
        toast.success(`ליקוי #${Object.keys(pins).length + 1} נוסף!`);
      };

      fabricCanvas.on('mouse:down', handleMouseDown);
      
      return () => fabricCanvas.off('mouse:down', handleMouseDown);
    }
  }, [fabricCanvas, addPin, pins]);

  useEffect(() => {
    if (fabricCanvas) {
        fabricCanvas.getObjects().forEach(obj => fabricCanvas.remove(obj));

        Object.values(pins).forEach(pin => {
            const circle = new fabric.Circle({
            left: pin.x, top: pin.y, radius: 10,
            fill: pin.status === 'closed' ? 'green' : 'red',
            stroke: 'white', strokeWidth: 2,
            originX: 'center', originY: 'center',
            });
            fabricCanvas.add(circle);
        });
        fabricCanvas.renderAll();
    }
  }, [pins, fabricCanvas]);

  return (
    <canvas ref={canvasRef} />
  );
};

export default ConstructionCanvas;