import { useRef, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

export default function FileUpload({ onFileSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
    ];

    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or PowerPoint file.');
      return false;
    }

    // Check if it's a PowerPoint file
    if (file.type.includes('powerpoint') || file.type.includes('presentation')) {
      setError('PowerPoint files need to be converted to PDF first. Please save your presentation as PDF and upload again.');
      return false;
    }

    setError('');
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div
      className={`upload-dropzone ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.ppt,.pptx"
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      <div className="upload-icon">
        <Upload size={36} strokeWidth={1.5} />
      </div>

      <p className="upload-text">
        Choose a file or drag &<br />drop it here
      </p>

      <p className="upload-subtext">
        PDF or PowerPoint formats, up to 200MB
      </p>

      {error && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          background: 'rgba(239, 68, 68, 0.2)',
          color: '#fca5a5',
          padding: '0.5rem 1rem',
          borderRadius: '2rem',
          fontSize: '0.75rem',
          fontWeight: 600
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
