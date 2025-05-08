
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Check, AlertCircle } from "lucide-react";
import { setApiUrl, getApiConfig, checkApiAvailability } from "@/config/api.config";

const ApiConfigPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiUrl, setApiUrlState] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  
  // Инициализация с текущим URL
  useEffect(() => {
    const config = getApiConfig();
    setApiUrlState(config.baseUrl);
  }, []);
  
  // Проверка доступности API
  const handleCheckAvailability = async () => {
    setIsChecking(true);
    setIsAvailable(null);
    
    try {
      const available = await checkApiAvailability();
      setIsAvailable(available);
    } catch (error) {
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };
  
  // Сохранение нового URL
  const handleSaveUrl = () => {
    setApiUrl(apiUrl);
    setIsOpen(false);
    // После сохранения проверяем доступность
    handleCheckAvailability();
  };

  return (
    <div className="relative">
      {/* Кнопка для открытия панели настройки */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs"
      >
        <Settings size={14} />
        Настройка API
      </Button>
      
      {/* Панель настройки */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 p-4 rounded-lg bg-black border border-white/10 backdrop-blur-xl shadow-lg z-50 w-80">
          <h3 className="mb-3 text-sm font-medium">Настройка подключения к API</h3>
          
          <div className="mb-3">
            <label className="block text-xs mb-1">URL сервера анализа</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrlState(e.target.value)}
              className="w-full p-2 rounded bg-white/10 border border-white/20 text-sm"
              placeholder="https://api.example.com/xray"
            />
          </div>
          
          {isAvailable !== null && (
            <div className={`text-xs p-2 mb-3 rounded flex items-center gap-2 ${isAvailable ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
              {isAvailable ? (
                <>
                  <Check size={14} />
                  <span>API доступен</span>
                </>
              ) : (
                <>
                  <AlertCircle size={14} />
                  <span>API недоступен. Будут использованы локальные данные.</span>
                </>
              )}
            </div>
          )}
          
          <div className="flex justify-between gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={isChecking}
              onClick={handleCheckAvailability}
            >
              {isChecking ? 'Проверка...' : 'Проверить доступность'}
            </Button>
            
            <Button 
              size="sm" 
              onClick={handleSaveUrl}
            >
              Сохранить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiConfigPanel;
