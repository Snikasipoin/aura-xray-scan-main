
import { useState, useEffect } from "react";
import XrayHero from "@/components/XrayHero";
import XrayAnalysis from "@/components/XrayAnalysis";
import XrayResults from "@/components/XrayResults";
import XrayFooter from "@/components/XrayFooter";
import ApiConfigPanel from "@/components/ApiConfigPanel";
import { XrayAnalysisResult } from "@/types/api";
import ConsentModal from "@/components/ConsentModal";
import { useToast } from "@/hooks/use-toast";

type ScreenState = 'landing' | 'analyzing' | 'results';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('landing');
  const [xrayImage, setXrayImage] = useState<string | null>(null);
  const [xrayFile, setXrayFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<XrayAnalysisResult | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [hasUserConsented, setHasUserConsented] = useState<boolean | null>(null);
  const { toast } = useToast();
  
  // Проверка согласия при загрузке страницы
  useEffect(() => {
    const savedConsent = sessionStorage.getItem('dataProcessingConsent');
    if (savedConsent === 'accepted') {
      setHasUserConsented(true);
    } else if (savedConsent === 'rejected') {
      setHasUserConsented(false);
    } else {
      // Если согласия нет в сессии, показываем модальное окно
      setShowConsentModal(true);
    }
  }, []);
  
  const handleFileUpload = (file: File) => {
    if (hasUserConsented === false) {
      toast({
        title: "Доступ ограничен",
        description: "Для загрузки и анализа изображений необходимо принять согласие на обработку данных",
        variant: "destructive",
      });
      setShowConsentModal(true);
      return;
    }
    
    const imageUrl = URL.createObjectURL(file);
    setXrayImage(imageUrl);
    setXrayFile(file);
    setCurrentScreen('analyzing');
  };
  
  const handleAnalysisComplete = (result: XrayAnalysisResult) => {
    setAnalysisResult(result);
    setCurrentScreen('results');
  };
  
  const handleReset = () => {
    if (xrayImage) {
      URL.revokeObjectURL(xrayImage);
    }
    setXrayImage(null);
    setXrayFile(null);
    setAnalysisResult(null);
    setCurrentScreen('landing');
  };

  const handleConsentModalClose = (accepted: boolean) => {
    setShowConsentModal(false);
    setHasUserConsented(accepted);
  };

  const handleConsentRequired = () => {
    setShowConsentModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-medical-dark animated-gradient">
      {/* Эффект фона нейронной сети */}
      <div className="fixed inset-0 z-0 opacity-30 bg-neural-network"></div>
      
      {/* Шапка в стиле Tesla */}
      <header className="relative z-10 py-4 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-center text-white flex items-center">
            <span className="w-8 h-8 rounded-full bg-medical-primary/20 flex items-center justify-center mr-2 neon-border">
              <span className="text-medical-primary font-semibold text-sm">A</span>
            </span>
            <span className="text-medical-primary">Aura</span> X-Ray Scan
          </h1>
          
          {/* Панель настройки API */}
          {/* <ApiConfigPanel /> */}
        </div>
      </header>
      
      {/* Основное содержимое */}
      <main className="flex-1 relative z-10">
        <div className="container mx-auto py-8 px-4">
          {currentScreen === 'landing' && (
            <XrayHero 
              onUpload={handleFileUpload} 
              hasConsented={hasUserConsented} 
              onConsentRequired={handleConsentRequired}
            />
          )}
          
          {currentScreen === 'analyzing' && xrayImage && xrayFile && (
            <XrayAnalysis 
              imageUrl={xrayImage}
              imageFile={xrayFile}
              onComplete={handleAnalysisComplete}
            />
          )}
          
          {currentScreen === 'results' && xrayImage && analysisResult && (
            <XrayResults 
              imageUrl={xrayImage}
              analysisResult={analysisResult}
            />
          )}
        </div>
      </main>
      
      {/* Модальное окно согласия */}
      <ConsentModal 
        isOpen={showConsentModal} 
        onClose={handleConsentModalClose} 
      />
      
      {/* Футер */}
      <div className="relative z-10">
        <XrayFooter onReset={handleReset} />
      </div>
    </div>
  );
};

export default Index;
