import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, RotateCcw, X, Check } from 'lucide-react';

interface WebcamCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  lang: 'en' | 'bm';
}

const t = (lang: 'en' | 'bm', en: string, bm: string) => lang === 'bm' ? bm : en;

export function WebcamCapture({ onCapture, onClose, lang }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setCapturedImage(null);
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setError(t(lang, 'Camera access denied. Please allow camera permissions.', 'Akses kamera ditolak. Sila benarkan kebenaran kamera.'));
    }
  }, [lang]);

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
  }, [stream]);

  const takePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
  }, [stopCamera]);

  const confirmPhoto = useCallback(() => {
    if (!capturedImage) return;
    fetch(capturedImage)
      .then(r => r.blob())
      .then(blob => {
        const file = new File([blob], `webcam-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
      });
  }, [capturedImage, onCapture]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-card rounded-2xl border border-border/40 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <h3 className="text-sm font-sans font-bold text-foreground">
            {t(lang, 'Take Photo', 'Ambil Gambar')}
          </h3>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {error ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <Camera size={32} className="text-muted-foreground" />
              <p className="text-xs text-destructive font-sans text-center">{error}</p>
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-sans font-semibold"
              >
                {t(lang, 'Close', 'Tutup')}
              </button>
            </div>
          ) : capturedImage ? (
            <div className="space-y-3">
              <img src={capturedImage} alt="Captured" className="w-full rounded-xl object-contain max-h-64" />
              <div className="flex gap-2.5">
                <button
                  onClick={retake}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-background text-xs font-sans font-semibold hover:bg-muted/50 transition-colors"
                >
                  <RotateCcw size={14} />
                  {t(lang, 'Retake', 'Ambil Semula')}
                </button>
                <button
                  onClick={confirmPhoto}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-sans font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Check size={14} />
                  {t(lang, 'Use Photo', 'Guna Foto')}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              </div>
              <button
                onClick={takePhoto}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-sans font-semibold hover:bg-primary/90 transition-colors"
              >
                <Camera size={16} />
                {t(lang, 'Capture', 'Tangkap')}
              </button>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
