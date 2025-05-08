
import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface XrayHeroProps {
  onUpload: (file: File) => void;
  hasConsented: boolean | null;
  onConsentRequired: () => void;
}

const XrayHero = ({ onUpload, hasConsented, onConsentRequired }: XrayHeroProps) => {
  const [hovered, setHovered] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (hasConsented === false) {
        e.target.value = '';
        onConsentRequired();
        return;
      }
      onUpload(e.target.files[0]);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (hasConsented === false) {
      onConsentRequired();
      return;
    }
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  // Обработчик для обязательного согласия
  const handleConsentCheck = () => {
    if (hasConsented === false) {
      onConsentRequired();
      return;
    }
  };

  // Generate neural network dots
  const neuralDots = Array.from({ length: 24 }).map((_, i) => ({
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 5
  }));
  
  return (
    <div className="relative min-h-[70vh] w-full flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Neural network background */}
      <div className="absolute inset-0 neural-network-bg"></div>
      
      {/* Neural network animated nodes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {neuralDots.map((dot, i) => (
          <div 
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              background: i % 3 === 0 ? 'rgba(155, 135, 245, 0.5)' : 'rgba(51, 195, 240, 0.5)',
              boxShadow: i % 3 === 0 ? '0 0 10px rgba(155, 135, 245, 0.5)' : '0 0 10px rgba(51, 195, 240, 0.5)',
              animationDelay: `${dot.delay}s`,
              animationDuration: `${dot.duration}s`
            }}
          />
        ))}
        
        {/* Neural connections */}
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(155, 135, 245, 0.1)" />
                <stop offset="100%" stopColor="rgba(51, 195, 240, 0.1)" />
              </linearGradient>
            </defs>
            {Array.from({ length: 10 }).map((_, i) => (
              <line 
                key={i}
                x1={`${Math.random() * 100}%`} 
                y1={`${Math.random() * 100}%`}
                x2={`${Math.random() * 100}%`}
                y2={`${Math.random() * 100}%`}
                stroke="url(#lineGradient)"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Glowing circle behind upload button */}
      <div className={`absolute w-48 h-48 rounded-full bg-medical-primary/10 filter blur-xl transition-all duration-500 ${hovered ? 'scale-110 opacity-80' : 'scale-100 opacity-50'}`}></div>

      {/* Scanner lines animation */}
      <div className="scan-line animate-scan-line"></div>
      
      {/* Content */}
      <div className="text-center z-10 space-y-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold glow-text bg-clip-text text-transparent bg-gradient-to-r from-medical-light via-white to-medical-accent">
          Aura X-Ray Analysis
        </h1>
        <p className="text-lg text-medical-light/90 md:text-xl mb-8 max-w-xl mx-auto">
          Продвинутая ИИ-диагностика для интерпретации рентгена грудной клетки с высокой точностью
        </p>
        
        {/* Upload zone - Tesla-inspired */}
        <div 
          className={`relative mt-8 w-full max-w-lg mx-auto h-56 md:h-72 rounded-xl
            ${dragOver 
              ? 'neon-border-accent animate-pulse border-medical-accent' 
              : 'neon-border'
            }
            ${hasConsented === false ? 'opacity-60 cursor-not-allowed' : ''}
            transition-all duration-300 tesla-card overflow-hidden`}
          onDragOver={(e) => { 
            e.preventDefault();
            if (hasConsented !== false) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={hasConsented === false ? handleConsentCheck : undefined}
        >
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
            <label 
              htmlFor="xray-upload"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className={`flex flex-col items-center ${hasConsented === false ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={hasConsented === false ? (e) => {
                e.preventDefault();
                handleConsentCheck();
              } : undefined}
            >
              <div className={`rounded-full p-4 ${hovered && hasConsented !== false ? 'animate-breathing' : 'pulse-effect'} bg-medical-primary/20 border border-medical-primary/50`}>
                <Upload size={32} className="text-medical-primary" />
              </div>
              <span className="mt-4 text-lg font-medium text-medical-light">
                {hasConsented === false 
                  ? "Требуется согласие на обработку данных" 
                  : dragOver 
                    ? "Отпустите для загрузки" 
                    : "Загрузить рентген"}
              </span>
              {hasConsented !== false && (
                <p className="text-sm text-gray-400 mt-2">Перетащите файл или нажмите для выбора</p>
              )}
              {hasConsented === false && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-medical-primary/20 hover:bg-medical-primary/40 border-medical-primary/30"
                  onClick={(e) => {
                    e.preventDefault();
                    onConsentRequired();
                  }}
                >
                  Дать согласие
                </Button>
              )}
              <input 
                type="file" 
                id="xray-upload" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload}
                disabled={hasConsented === false} 
              />
            </label>
          </div>
          
          {/* Tesla-like animated bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-medical-primary via-medical-accent to-medical-primary bg-[length:200%_100%] animate-gradient"></div>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Поддерживаемые форматы: JPEG, PNG • Макс. размер: 10MB
        </p>
      </div>
    </div>
  );
};

export default XrayHero;
