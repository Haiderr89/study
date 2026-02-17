import { useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Watch, ArrowRight } from 'lucide-react';

const MySwal = withReactContent(Swal);

export default function Overlay({ onNext, onExtend, onMarkAndMove, extensionsUsed }) {
  const extensionsRemaining = Math.max(0, 3 - extensionsUsed);

  useEffect(() => {
    // Define the content for the modal
    MySwal.fire({
      title: <span className="text-3xl font-bold text-gray-800">Time to Move On</span>,
      html: (
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
            <Watch size={40} />
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            Keeping a steady pace prevents burnout. You're doing great!
          </p>

          <div className="overlay-button-group">
            <button
              onClick={() => {
                MySwal.clickConfirm();
                MySwal.close();
                onNext();
              }}
              className="overlay-btn overlay-btn-primary"
            >
              Next Slide <ArrowRight size={24} />
            </button>

            <button
              onClick={() => {
                MySwal.close();
                onMarkAndMove();
              }}
              className="overlay-btn overlay-btn-secondary"
            >
              Mark for Review & Move On
            </button>

            {extensionsRemaining > 0 ? (
              <button
                onClick={() => {
                  MySwal.close();
                  onExtend();
                }}
                className="overlay-btn overlay-btn-outline"
              >
                Extend (1 min) — {extensionsRemaining} left
              </button>
            ) : (
              <p className="text-sm font-bold text-rose-500 mt-2 bg-rose-50 p-2 rounded-lg border border-rose-200">
                No extensions left. Panic prevention active.
              </p>
            )}
          </div>
        </div>
      ),
      showConfirmButton: false, // We use custom buttons
      allowOutsideClick: false,
      allowEscapeKey: false,
      background: '#ffffff',
      width: '450px',
      padding: '2rem',
      borderRadius: '1.5rem',
      backdrop: `
        rgba(15, 23, 42, 0.9)
        left top
        no-repeat
      `
    });

    // Cleanup function to close modal if component unmounts (e.g. navigation)
    return () => {
      MySwal.close();
    }
  }, [extensionsRemaining, onNext, onExtend, onMarkAndMove]);

  return null; // This component doesn't render anything itself, it just triggers Swal
}
