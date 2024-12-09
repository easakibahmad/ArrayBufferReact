import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface ImagePreview {
  id: string;
  src: string;
  file: File;
}

const DragAndDrop: React.FC = () => {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const processFiles = (files: File[]) => {
    const validImageFiles = files.filter(file => file.type.startsWith('image/'));
    
    const newImages: ImagePreview[] = validImageFiles.map(file => ({
      id: crypto.randomUUID(),
      src: URL.createObjectURL(file),
      file
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    processFiles(files);
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`drag-drop-container ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        width: '400px',
        height: '300px',
        border: `2px dashed ${isDragging ? '#4CAF50' : '#ccc'}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'border-color 0.3s ease',
        backgroundColor: isDragging ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
        cursor: 'pointer'
      }}
      onClick={handleClickUpload}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple 
        accept="image/*"
        style={{ display: 'none' }}
      />
      <p>{isDragging ? 'Drop files here' : 'Drag and drop images or click to upload'}</p>
      
      {images.length > 0 && (
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          marginTop: '20px', 
          justifyContent: 'center' 
        }}>
          {images.map((image) => (
            <div 
              key={image.id} 
              style={{ 
                position: 'relative', 
                margin: '10px', 
                width: '100px', 
                height: '100px' 
              }}
            >
              <img
                src={image.src}
                alt="Preview"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(image.id);
                  // Revoke the object URL to free up memory
                  URL.revokeObjectURL(image.src);
                }}
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  backgroundColor: 'red',
                  color: 'white',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DragAndDrop;