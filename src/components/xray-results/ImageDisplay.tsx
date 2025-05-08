
import { useState } from "react";
import { Image, Layers } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { XrayAnalysisResult } from "@/types/api";

// Function to get the API base URL
const getApiBaseUrl = () => {
  const storedApiUrl = localStorage.getItem('xrayApiUrl');
  return storedApiUrl || 'https://snikasipoin-api-xray-scan-ed4e.twc1.net';
};

type ImageDisplayProps = {
  imageUrl: string;
  analysisResult: XrayAnalysisResult;
};

const ImageDisplay = ({ imageUrl, analysisResult }: ImageDisplayProps) => {
  const [showHeatmap, setShowHeatmap] = useState(true); // Default: show heatmap

  // Get URL for image display (original or heatmap)
  const getDisplayImageUrl = () => {
    if (showHeatmap && analysisResult.heatmapUrl) {
      // If heatmap is enabled and available in API response - use it
      return `${getApiBaseUrl()}${analysisResult.heatmapUrl}`;
    }
    
    if (!showHeatmap && analysisResult.originalUrl) {
      // If heatmap disabled and original image URL exists - use it
      return `${getApiBaseUrl()}${analysisResult.originalUrl}`;
    }
    
    // Default: use image from file upload
    return imageUrl;
  };

  return (
    <div className="relative rounded-xl tesla-card overflow-hidden">
      {/* Toggle switch for heatmap/normal image */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-2 glass-panel p-2 rounded-lg">
        <Image 
          size={18} 
          className={`${!showHeatmap ? "text-medical-accent" : "text-gray-400"}`} 
        />
        <Switch 
          checked={showHeatmap} 
          onCheckedChange={setShowHeatmap}
          className="data-[state=checked]:bg-medical-accent"
        />
        <Layers 
          size={18} 
          className={`${showHeatmap ? "text-medical-accent" : "text-gray-400"}`}
        />
      </div>
      
      <img 
        src={getDisplayImageUrl()} 
        alt="X-ray scan" 
        className="w-full h-full object-contain"
      />
      
      {/* Overlay heatmap effect when enabled and no server heatmap available */}
      {showHeatmap && !analysisResult.heatmapUrl && (
        <div className="absolute inset-0 animate-fade-in">
          {/* Complex heatmap effect */}
          <div className="absolute inset-0">
            <div className="absolute w-full h-full opacity-60">
              {analysisResult.hasAbnormality ? (
                // Red areas for abnormalities
                <>
                  <div className="absolute top-[35%] left-[40%] w-[30%] h-[30%] rounded-full bg-gradient-radial from-red-500/50 to-transparent"></div>
                  <div className="absolute top-[30%] right-[40%] w-[25%] h-[25%] rounded-full bg-gradient-radial from-yellow-500/40 to-transparent"></div>
                </>
              ) : (
                // Green areas for normal results
                <>
                  <div className="absolute top-[35%] left-[40%] w-[30%] h-[30%] rounded-full bg-gradient-radial from-green-500/30 to-transparent"></div>
                  <div className="absolute top-[30%] right-[40%] w-[25%] h-[25%] rounded-full bg-gradient-radial from-green-500/30 to-transparent"></div>
                  <div className="absolute top-[55%] left-[35%] w-[15%] h-[15%] rounded-full bg-gradient-radial from-blue-400/20 to-transparent"></div>
                </>
              )}
            </div>
            
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
              {/* Tesla-style grid */}
              <div className="h-full w-full grid grid-cols-8 grid-rows-8">
                {Array.from({length: 64}).map((_, i) => (
                  <div key={i} className="border border-medical-accent/10"></div>
                ))}
              </div>
            </div>
            
            {/* Neural scanning dots */}
            <div className="absolute inset-0">
              {Array.from({length: 10}).map((_, i) => {
                const size = Math.random() * 6 + 4;
                const x = 30 + Math.random() * 40;
                const y = 25 + Math.random() * 50;
                return (
                  <div 
                    key={i}
                    className="absolute rounded-full animate-pulse-glow"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      left: `${x}%`,
                      top: `${y}%`,
                      background: analysisResult.hasAbnormality
                        ? (i % 3 === 0 
                          ? 'radial-gradient(circle, rgba(239, 68, 68, 0.6) 0%, rgba(239, 68, 68, 0) 70%)' 
                          : 'radial-gradient(circle, rgba(234, 179, 8, 0.5) 0%, rgba(234, 179, 8, 0) 70%)')
                        : (i % 3 === 0 
                          ? 'radial-gradient(circle, rgba(74, 222, 128, 0.6) 0%, rgba(74, 222, 128, 0) 70%)' 
                          : 'radial-gradient(circle, rgba(51, 195, 240, 0.5) 0%, rgba(51, 195, 240, 0) 70%)'),
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Active scanning indicator */}
      <div className="absolute top-3 left-3 flex items-center space-x-2">
        <div className="w-2 h-2 bg-medical-accent rounded-full animate-pulse"></div>
        <span className="text-xs text-medical-accent">Сканирование активно</span>
      </div>
    </div>
  );
};

export default ImageDisplay;
