import { Page, Document } from 'react-pdf';
import { useEffect, useState } from 'react';

export default function SlideViewer({ fileUrl, pageNumber }) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById('pdf-container');
      if (container) {
        // Calculate width based on height to fit the screen vertically if needed
        const aspect = 1.414; // Approximate A4 aspect ratio (can be dynamic but good default)
        const contentHeight = window.innerHeight;
        const contentWidth = container.offsetWidth;

        // Ensure we render at high resolution
        // We set the width to the MAXIMUM of container width or computed width from height
        setContainerWidth(contentWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (!fileUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-white/60">No PDF file specified</p>
      </div>
    );
  }

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Zoom Controls */}
      {/* <div className="absolute top-4 right-4 z-50 flex gap-2 bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/10">
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
          title="Zoom Out"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <div className="flex items-center px-2 text-sm font-mono text-white/80">
          {Math.round(scale * 100)}%
        </div>
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
          title="Zoom In"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div> */}

      <div id="pdf-container" className="w-full h-full flex items-center justify-center overflow-auto">
        <Document
          file={fileUrl}
          loading={
            <div className="flex items-center justify-center p-12">
              <div className="text-white/60">Loading PDF...</div>
            </div>
          }
          error={
            <div className="flex items-center justify-center p-12">
              <div className="text-rose-400">Failed to load PDF</div>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            // Render scaling: use height to determine resolution if we want full height, or width. 
            // To fix blur, we normally don't use CSS scaling. We render AT the size we want.
            // Let's render at 1.5x resolution for sharpness or just match height.
            height={window.innerHeight * 0.7}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-2xl transition-transform duration-200"
          />
        </Document>
      </div>
    </div>
  );
}
