import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric'; // ייבוא ישיר של ספריית fabric
import { useConstructionStore } from '../../stores/constructionStore.js';
import toast from 'react-hot-toast';

const ConstructionCanvas = () => {
  // נשתמש ב-useRef כדי לקבל גישה ישירה לאלמנט ה-canvas ב-HTML
  const canvasRef = useRef(null);
  // נשמור את אובייקט הקנבס של fabric ב-state
  const [fabricCanvas, setFabricCanvas] = useState(null);

  const { addPin, pins, backgroundImage } = useConstructionStore(state => ({
    addPin: state.addPin,
    pins: state.pins,
    backgroundImage: state.backgroundImage,
  }));

  // useEffect זה ירוץ פעם אחת כשהרכיב עולה, ויאתחל את הקנבס של fabric
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasRef.current.parentElement.offsetWidth,
      height: canvasRef.current.parentElement.offsetHeight,
      backgroundColor: '#f0f0f0',
    });
    setFabricCanvas(canvas);

    // פונקציית ניקוי חשובה - מונעת דליפות זיכרון
    return () => {
      canvas.dispose();
    };
  }, []);

  // הטמעת תמונת רקע
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

  // הוספת פין בלחיצה
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

  // סנכרון וציור הפינים על הקנבס
  useEffect(() => {
    if (fabricCanvas) {
        // מנקים רק את האובייקטים, לא את הרקע
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

  // מחזירים אלמנט <canvas> רגיל, ו-fabric ישתלט עליו
  return (
    <canvas ref={canvasRef} />
  );
};

export default ConstructionCanvas;