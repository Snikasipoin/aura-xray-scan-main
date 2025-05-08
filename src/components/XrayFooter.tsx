
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Eye, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ConsentModal from "@/components/ConsentModal";

const XrayFooter = ({ onReset }: { onReset: () => void }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  
  const handleConsentModalClose = (accepted: boolean) => {
    setShowConsent(false);
  };
  
  return (
    <footer className="w-full py-6 relative z-20">
      <div className="container mx-auto px-4">
        <div className="tesla-card rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-medical-primary/20 flex items-center justify-center mr-3 neon-border pulse-effect">
                <span className="text-medical-primary font-semibold text-sm"><img src="/favicon-32x32.png" alt="logo" /></span>
              </div>
              <span className="text-sm text-gray-400">AuraX-Ray Scan v1.0</span>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                variant="outline"
                className="text-xs border-medical-primary/30 text-medical-primary hover:bg-medical-primary/10"
                onClick={() => setShowInfo(!showInfo)}
              >
                {showInfo ? "Скрыть информацию" : "Обязательная информация"}
              </Button>
              
              <Button 
                variant="outline" 
                className="text-xs border-medical-accent/50 text-medical-accent hover:bg-medical-accent/10"
                onClick={onReset}
              >
                Новый анализ
              </Button>
            </div>
          </div>
          
          {showInfo && (
            <div className="mt-4 glass-panel rounded-lg p-4 text-sm text-gray-400 animate-fade-in">
              <p>
              Система анализа изображений рентгенографии грудной клетки создана в учебных и исследовательских целях.
Результаты, предоставляемые искусственным интеллектом, не могут использоваться для постановки диагноза, назначения лечения или замены консультации с квалифицированным врачом.

Всегда консультируйтесь с лицензированным медицинским специалистом для получения точной диагностики и рекомендаций по лечению.

Используя это приложение, вы соглашаетесь с тем, что предоставленная информация носит исключительно ознакомительный характер.
              </p>
            </div>
          )}
          
          {/* Privacy and consent section */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-panel rounded-lg p-4 flex items-start space-x-3">
                <Shield size={18} className="text-medical-accent mt-0.5" />
                <div>
                  <p className="text-xs text-gray-300">Конфиденциальность</p>
                  <p className="text-xs text-gray-400 mt-1">Ваши данные защищены, данные анализа не хранятся на сервере</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowConsent(true)}
                className="glass-panel rounded-lg p-4 flex items-start space-x-3 hover:bg-white/10 transition-colors"
              >
                <Eye size={18} className="text-medical-primary mt-0.5" />
                <div className="flex-1 text-left">
                  <p className="text-xs text-gray-300">Согласие на обработку</p>
                  <div className="flex items-center mt-1">
                    <p className="text-xs text-gray-400">Ознакомиться с условиями</p>
                    <ChevronRight size={14} className="text-gray-400 ml-1" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">© 2025 AuraX-Ray Medical. Все права защищены.</p>
        </div>
      </div>
      
      {/* Consent Modal */}
      <ConsentModal isOpen={showConsent} onClose={handleConsentModalClose} />
    </footer>
  );
};

export default XrayFooter;
