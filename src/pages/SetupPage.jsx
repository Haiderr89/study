import { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import ConfigForm from '../components/ConfigForm';
import { pdfjs } from 'react-pdf';
import { FileText, Edit3, Clock, User, Youtube, Twitter, Facebook, Instagram } from 'lucide-react';

export default function SetupPage() {
  const { dispatch } = useSession();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleFileSelect = async (selectedFile) => {
    // Check if it's a PowerPoint file
    if (selectedFile.type.includes('powerpoint') || selectedFile.type.includes('presentation') || selectedFile.name.endsWith('.ppt') || selectedFile.name.endsWith('.pptx')) {
      alert("We currently support PDF files for the best experience. Please save your PowerPoint as a PDF and upload it.");
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjs.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const slides = Array.from({ length: numPages }, (_, i) => ({
        id: `slide-${i + 1}`,
        pageNumber: i + 1,
        fileUrl: URL.createObjectURL(selectedFile),
        status: 'pending',
        timeAllocated: 300,
        difficulty: 'medium'
      }));

      dispatch({
        type: 'START_SESSION',
        payload: { slides, totalTime: 3600, startTime: Date.now() }
      });

      setFile(selectedFile);
    } catch (error) {
      console.error("Error loading PDF:", error);
      alert(`Failed to load PDF: ${error.message || 'Unknown error'}`);
    }
  };

  const handleStartSession = (config) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: config });
    navigate('/session');
  };

  return (
    <div className="examix-container">
      {/* Background medical doodle is now applied via CSS */}

      {/* Header */}
      <div className="examix-header">
        <div className="examix-logo">
          <div className="logo-circle"></div>
          <span>EXAMIX</span>
        </div>
        <div className="header-actions">
          <button className="avatar-btn">
            <User size={16} strokeWidth={2} />
          </button>
          <button className="create-account-btn">Create Account</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="examix-main">
        {!file ? (
          <>
            {/* <div className="beta-badge">
              <div className="beta-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L9.5 6.5H14L10.5 9.5L12 14L8 11L4 14L5.5 9.5L2 6.5H6.5L8 2Z" fill="white" opacity="0.6"/>
                </svg>
              </div>
              <span>Welcome to the beta version!</span>
            </div> */}

            <h1 className="main-title">Your AI-Powered Study Tool</h1>

            <div className="feature-pills">
              <div className="feature-pill">
                <FileText size={14} />
                <span>Upload notes materials</span>
              </div>
              <div className="feature-pill">
                <Edit3 size={14} />
                <span>Upload handwritten materials</span>
              </div>
              <div className="feature-pill">
                <Clock size={14} />
                <span>No time limit for everyone</span>
              </div>
            </div>

            <div className="upload-wrapper">
              <FileUpload onFileSelect={handleFileSelect} />
            </div>
          </>
        ) : (
          <div style={{
            width: '100%',
            maxWidth: '500px',
            background: 'rgba(255,255,255,0.05)',
            padding: '2rem',
            borderRadius: '2rem',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <ConfigForm onStart={handleStartSession} fileName={file.name} />
          </div>
        )}
      </div>

      {/* Cookie Banner */}
      {/* {!file && (
        <div className="cookie-banner">
          <div className="cookie-content">
            <div className="cookie-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white" opacity="0.6">
                <circle cx="8" cy="8" r="6" fill="currentColor"/>
                <circle cx="6" cy="7" r="1" fill="#7d6f81"/>
                <circle cx="10" cy="9" r="1" fill="#7d6f81"/>
                <circle cx="8" cy="11" r="0.8" fill="#7d6f81"/>
              </svg>
            </div>
            <p className="cookie-text">
              We use cookies and other technology to provide you with our services and for functional, analytical and advertising purposes. Please read our Privacy Policy for more information.
            </p>
          </div>
          <div className="cookie-actions">
            <button className="cookie-btn decline">Decline</button>
            <button className="cookie-btn accept">Accept</button>
          </div>
        </div>
      )} */}

      {/* Footer */}
      <div className="examix-footer">
        <span className="footer-text">Follow Us</span>
        <div className="social-icons">
          <div className="social-icon">
            <Youtube size={14} strokeWidth={2} />
          </div>
          <div className="social-icon">
            <Twitter size={14} strokeWidth={2} />
          </div>
          <div className="social-icon">
            <Facebook size={14} strokeWidth={2} />
          </div>
          <div className="social-icon">
            <Instagram size={14} strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  );
}
