import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import ConstructionCanvas from './components/construction/ConstructionCanvas';
import { useConstructionStore } from './stores/constructionStore.js';

function App() {
  const { pins, deletePin, setBackgroundImage } = useConstructionStore();
  const fileInputRef = React.useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setBackgroundImage(event.target.result);
      toast.success('התוכנית הועלתה בהצלחה!');
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <>
      <Toaster position="bottom-center" />
      <div className="min-h-screen w-full bg-gray-100 p-4 sm:p-8 font-sans">
        <header className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">RANPRO Punchlist Pro v2</h1>
          <p className="text-gray-500 mt-1">תשתית מקצועית לניהול ליקויים</p>
        </header>

        <div className="text-center mb-4">
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden"/>
          <button onClick={() => fileInputRef.current.click()} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">
            העלה תוכנית
          </button>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-lg shadow-lg h-[60vh]">
            <ConstructionCanvas />
          </section>

          <aside className="lg:col-span-1 bg-white p-4 rounded-lg shadow-lg h-[60vh] flex flex-col">
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">רשימת ליקויים ({Object.keys(pins).length})</h2>
            <div className="flex-grow overflow-y-auto space-y-2 pr-2">
              {Object.values(
