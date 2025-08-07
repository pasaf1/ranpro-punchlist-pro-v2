import React, { useEffect } from 'react';
import { FabricJSCanvas, useFabricJSEditor } from 'react-fabricjs';
import { useConstructionStore } from '../../stores/constructionStore.js';
import toast from 'react-hot-toast';

const ConstructionCanvas = () => {
  const { editor, onReady } = useFabricJSEditor();
  const { addPin, pins, backgroundImage } = useConstructionStore(state => ({
    addPin: state.addPin,
    pins: state.pins,
    backgroundImage: state.backgroundImage,
  }));

  // הטמעת תמונת רקע
  useEffect(() => {
    if (backgroundImage && editor) {
      editor.fabric.Image.fromURL(backgroundImage, (img) => {
        editor.canvas.setBackgroundImage(img, editor.canvas.renderAll.bind(editor.canvas), {
          scaleX: editor.canvas.width / img.width,
          scaleY: editor.canvas.height / img.height,
        });
      });
    }
  }, [backgroundImage, editor]);

  // הוספת פין בלחיצה
  useEffect(() => {
    if (editor) {
      editor.canvas.on('mouse:down', (options) => {
        if (options.target) return;
        const pointer = editor.canvas.getPointer(options.e);
        addPin({
          x: pointer.x, y: pointer.y, status: 'open',
        });
        toast.success(`ליקוי #${Object.keys(pins).length + 1} נוסף!`);
      });
      // Cleanup
      return () => editor.canvas.off('mouse:down');
    }
  }, [editor, addPin, pins]);

  // סנכרון וציור הפינים על הקנבס
  useEffect(() => {
    if (editor) {
      editor.canvas.clear();
      Object.values(pins).forEach(pin => {
        const circle = new editor.fabric.Circle({
          left: pin.x, top: pin.y, radius: 10,
          fill: pin.status === 'closed' ? 'green' : 'red',
          stroke: 'white', strokeWidth: 2,
          originX: 'center', originY: 'center',
        });
        editor.canvas.add(circle);
      });
      // שמירה על תמונת הרקע בעת ציור מחדש
      const bgImage = editor.canvas.backgroundImage;
      editor.canvas.renderAll();
      if(bgImage) editor.canvas.setBackgroundImage(bgImage, editor.canvas.renderAll.bind(editor.canvas));
    }
  }, [pins, editor]);

  return (
      <FabricJSCanvas className="w-full h-full" onReady={onReady} />
  );
};
export default ConstructionCanvas;
