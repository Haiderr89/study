import { Page, Document } from 'react-pdf';
import { useEffect, useState } from 'react';

export default function SlideViewer({ fileUrl, pageNumber, onTextExtracted }) {
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

  const handlePageLoadSuccess = async (page) => {
    try {
      const textContent = await page.getTextContent();
      const extractedText = textContent.items.map(item => item.str).join(' ');
      if (onTextExtracted) {
        onTextExtracted(extractedText);
      }
    } catch (error) {
      console.error("Error extracting text:", error);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
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
            onLoadSuccess={handlePageLoadSuccess}
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
