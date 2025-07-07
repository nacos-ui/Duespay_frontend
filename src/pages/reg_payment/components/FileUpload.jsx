import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

const FileUpload = ({ file, onFileUpload, themeColor }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer transition-colors bg-gray-50 dark:bg-slate-700/30"
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.target.style.borderColor = themeColor;
      }}
      onMouseLeave={(e) => {
        e.target.style.borderColor = '';
      }}
    >
      <Upload size={48} className="mx-auto text-gray-400 dark:text-slate-400 mb-4" />
      {file ? (
        <div>
          <p className="text-green-600 dark:text-green-400 font-medium">File Selected: {file.name}</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Click to change file</p>
        </div>
      ) : (
        <div>
          <p className="text-gray-700 dark:text-slate-300 font-medium">Click to upload your receipt</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">PNG, JPG, PDF up to 10MB</p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;