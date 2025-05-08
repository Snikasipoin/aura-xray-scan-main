
import { useState, useEffect } from "react";
import { CircleDot, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { XrayAnalysisResult } from "@/types/api";
import { generatePdfReport } from "@/services/report.service";
import { toast } from "@/components/ui/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

type DiagnosisTabProps = {
  imageUrl: string;
  analysisResult: XrayAnalysisResult;
  diagnosisShown: boolean;
  setDiagnosisShown: (shown: boolean) => void;
  patientName: string;
};

const DiagnosisTab = ({ imageUrl, analysisResult, diagnosisShown, setDiagnosisShown, patientName }: DiagnosisTabProps) => {
  const [textToShow, setTextToShow] = useState("");
  const [confidenceVisible, setConfidenceVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Typewriter effect for diagnosis text - only runs if not already shown
  useEffect(() => {
    // Skip animation if already shown
    if (diagnosisShown) {
      setTextToShow(analysisResult.conclusion || "Заключение: Данные не доступны");
      setConfidenceVisible(true);
      return;
    }
    
    // Use conclusion from analysisResult
    const diagnosisText = analysisResult.conclusion || "Заключение: Данные не доступны";
    
    let currentIndex = 0;
    
    const timer = setInterval(() => {
      if (currentIndex < diagnosisText.length) {
        setTextToShow(prev => prev + diagnosisText[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(timer);
        // Show confidence metrics after text completion
        setTimeout(() => {
          setConfidenceVisible(true);
          setDiagnosisShown(true); // Mark as shown to prevent re-animation
        }, 500);
      }
    }, 40);
    
    return () => clearInterval(timer);
  }, [analysisResult, diagnosisShown, setDiagnosisShown]);

  // Function to download report
  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      toast.info("Подготовка отчета...");
      
      await generatePdfReport({
        imageUrl,
        analysisResult,
        showHeatmap: true,
        patientName,
        timestamp: new Date()
      });
      
      toast.success("Отчет успешно скачан");
    } catch (error) {
      console.error("Ошибка при скачивании отчета:", error);
      toast.error("Не удалось создать отчет. Пожалуйста, попробуйте снова.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* AI doctor avatar */}
      <div className="flex items-center mb-4 pb-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-medical-primary to-medical-accent neon-border flex items-center justify-center">
          <span className="text-white font-bold">AI</span>
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-white">Aura Diagnostics</h3>
          <p className="text-xs text-medical-light/70">Нейросетевой анализ</p>
        </div>
      </div>
      
      {/* Diagnosis text with typewriter effect */}
      <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin">
        <ScrollArea className="h-[300px] pr-4">
          <div className="font-mono text-sm text-medical-light mb-4 border-l-2 border-medical-primary pl-3 animate-slide-up" style={{animationDelay: "0.3s"}}>
            {textToShow}
            {!diagnosisShown && <span className="inline-block w-2 h-4 bg-medical-primary animate-pulse ml-1"></span>}
          </div>
          
          {confidenceVisible && (
            <>
              {/* <div className="opacity-0 animate-slide-up" style={{animationDelay: "0.7s", animationFillMode: "forwards"}}>
                <p className="text-sm text-gray-300 mb-3">{analysisResult.details}</p>
              </div> */}
              
              {/* Confidence indicators in Tesla style */}
              <div className="mt-4 opacity-0 animate-slide-up" style={{animationDelay: "1s", animationFillMode: "forwards"}}>
                <h4 className="text-sm font-medium text-medical-light/90 mb-2">Уверенность анализа</h4>
                <div className="flex justify-between items-center">
                  <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-medical-accent to-medical-primary transition-all duration-1000 ease-out"
                      style={{ width: `${analysisResult.confidence}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 font-mono text-medical-accent">{analysisResult.confidence}%</span>
                </div>
              </div>
              
              {/* Data points metrics in Tesla style */}
              <div className="mt-6 grid grid-cols-2 gap-3 opacity-0 animate-slide-up" style={{animationDelay: "1.3s", animationFillMode: "forwards"}}>
                {analysisResult.dataPoints.map((point, index) => (
                  <div key={index} className="glass-panel rounded-lg p-2 flex items-center">
                    <CircleDot 
                      className="text-medical-primary mr-2" 
                      size={24} 
                      fill={`rgba(155, 135, 245, ${point.percent / 150})`}
                    />
                    <div className="flex-1">
                      <p className="text-xs text-gray-300">{point.label}</p>
                      <p className="text-sm font-medium text-medical-light">{point.percent}%</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Button to download report */}
              <div className="mt-6 opacity-0 animate-slide-up" style={{animationDelay: "1.6s", animationFillMode: "forwards"}}>
                <Button 
                  variant="outline" 
                  className="w-full bg-medical-primary/10 border-medical-primary/20 text-medical-light hover:bg-medical-primary/20"
                  onClick={handleDownloadReport}
                  disabled={isDownloading}
                >
                  <FileDown className="mr-2" /> 
                  {isDownloading ? "Создание отчета..." : "Скачать отчет"}
                </Button>
              </div>
            </>
          )}
        </ScrollArea>
      </div>
    </>
  );
};

export default DiagnosisTab;
