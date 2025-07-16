import { Eye, EyeOff, Upload, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react'

const FileUpload = ({
  label,
  onChange,
  accept = "image/*",
  name,
  file
}) => {
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      
      onChange(e);
    }
  };

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const inputId = `${name}-upload`;

  return (
    <div className="mb-6">
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label}
      </label>
      
      {/* Preview */}
      {preview && (
        <div className="mb-3 flex justify-center">
          <img
            src={preview}
            alt="Logo preview"
            className="w-20 h-20 object-cover rounded-lg border border-gray-600"
          />
        </div>
      )}
      
      <div className="relative">
        <input
          type="file"
          name={name}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id={inputId}
        />
        <label
          htmlFor={inputId}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 flex items-center justify-between"
        >
          <span>{fileName || 'Choose logo file'}</span>
          <Upload size={20} />
        </label>
      </div>
    </div>
  );
};

export default FileUpload;