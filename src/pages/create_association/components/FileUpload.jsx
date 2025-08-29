import React, { useRef, useEffect, useState } from 'react';
import { Upload, X, Image, CheckCircle } from 'lucide-react';

const FileUpload = ({ label, name, onChange, file, description }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      onChange(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    onChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-white">
        {label}
      </label>
      {description && (
        <p className="text-sm text-gray-400">{description}</p>
      )}
      
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
          dragActive 
            ? 'border-[#8200db] bg-[#8200db]/10' 
            : file 
            ? 'border-green-400 bg-green-400/10'
            : 'border-gray-600 bg-[#101828] hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          onChange={handleChange}
          accept="image/*"
          className="hidden"
        />

        {file ? (
          <div className="space-y-4">
            {preview && (
              <div className="flex justify-center">
                <div className="relative">
                  <img 
                    src={preview} 
                    alt="Logo preview" 
                    className="w-24 h-24 rounded-xl object-cover border border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">File uploaded</span>
              </div>
              <p className="text-white text-sm">{file.name}</p>
              <p className="text-gray-400 text-xs mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              
              <button
                type="button"
                onClick={openFileDialog}
                className="mt-3 text-[#8200db] hover:text-purple-400 text-sm transition-colors"
              >
                Choose different file
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-[#23263a] rounded-full flex items-center justify-center">
              {dragActive ? (
                <Upload className="w-8 h-8 text-[#8200db]" />
              ) : (
                <Image className="w-8 h-8 text-gray-400" />
              )}
            </div>
            
            <div>
              <p className="text-white font-medium mb-2">
                {dragActive ? 'Drop your logo here' : 'Upload your association logo'}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Drag and drop or click to browse
              </p>
              <button
                type="button"
                onClick={openFileDialog}
                className="bg-[#8200db] hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Choose File
              </button>
            </div>
            
            <p className="text-xs text-gray-500">
              Supports: JPG, PNG, GIF (Max 5MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;