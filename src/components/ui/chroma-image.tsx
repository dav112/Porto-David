"use client";
import { useEffect, useRef } from "react";

export default function ChromaImage({ src, className }: { src: string; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const doDraw = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i+1], b = d[i+2];
        // green screen #00FF00 detection
        if (g > 90 && g > r + 30 && g > b + 30) {
          d[i+3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    };

    if (img.complete) doDraw();
    else img.onload = doDraw;
  }, [src]);

  return (
    <>
      <img ref={imgRef} src={src} alt="" style={{ display: "none" }} crossOrigin="anonymous" />
      <canvas ref={canvasRef} className={className} />
    </>
  );
}
