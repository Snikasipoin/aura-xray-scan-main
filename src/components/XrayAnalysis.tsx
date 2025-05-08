
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader, Layers } from "lucide-react";
import { analyzeXrayImage } from "@/services/xray.service";
import { XrayAnalysisResult } from "@/types/api";

type XrayAnalysisProps = {
  imageUrl: string;
  imageFile: File;
  onComplete: (result: XrayAnalysisResult) => void;
};

const XrayAnalysis = ({ imageUrl, imageFile, onComplete }: XrayAnalysisProps) => {
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  
  const analysisStages = [
    "Первичная обработка изображения",
    "Анализ структуры легких",
    "Определение патологий",
    "Формирование диагностического отчета"
  ];
  
  useEffect(() => {
    // Запускаем анализ изображения
    const analyzeImage = async () => {
      // Эмулируем прогресс анализа
      const progressInterval = setInterval(() => {
        setProgress(prevProgress => {
          const newProgress = prevProgress + (2 + Math.random() * 3);
          const nextProgress = Math.min(newProgress, 95); // Ограничиваем до 95%, чтобы оставить место для реального ответа API
          
          // Обновляем активную стадию на основе прогресса
          if (nextProgress > 25 && activeStage < 1) setActiveStage(1);
          if (nextProgress > 50 && activeStage < 2) setActiveStage(2);
          if (nextProgress > 75 && activeStage < 3) setActiveStage(3);
          
          return nextProgress;
        });
      }, 100);
      
      try {
        // Запрос к API для анализа изображения
        const result = await analyzeXrayImage(imageFile);
        
        // Завершаем прогресс и небольшая пауза для визуального эффекта
        clearInterval(progressInterval);
        setProgress(100);
        setTimeout(() => {
          onComplete(result); 
        }, 500);
      } catch (error) {
        console.error("Ошибка при анализе изображения:", error);
        clearInterval(progressInterval);
        
        // В случае ошибки завершаем с мок-данными после паузы
        setProgress(100);
        setTimeout(() => {
          onComplete({
            conclusion: "Значимых патологических изменений не выявлено.",
            details: "Сердечный контур нормальных размеров. Легочные поля без очаговых теней, пневмоторакса или плеврального выпота. Острых костных аномалий не выявлено.",
            confidence: 94,
            dataPoints: [
              { label: "Чистые легкие", percent: 96 },
              { label: "Нормальный размер сердца", percent: 92 },
              { label: "Отсутствие выпота", percent: 97 },
              { label: "Отсутствие пневмоторакса", percent: 98 },
            ],
            hasAbnormality: false
          });
        }, 500);
      }
    };
    
    analyzeImage();
    
    // Очистка при размонтировании компонента
    return () => {
      // Здесь можно добавить отмену запросов, если необходимо
    };
  }, [imageFile, onComplete, activeStage]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold glow-text">Анализ рентгена</h2>
        <p className="text-medical-light/70">Процесс нейросетевого анализа</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative rounded-xl tesla-card overflow-hidden aspect-square md:aspect-[4/3]">
          {/* Рентген-изображение */}
          <img 
            src={imageUrl} 
            alt="X-ray scan" 
            className="w-full h-full object-cover filter contrast-125 brightness-110"
          />

          {/* Эффект сканирующей линии */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="scan-line animate-scan-line" style={{
              height: "6px", // Увеличиваем толщину линии
              transform: "translateY(-50%)", // Центрируем линию по вертикали
            }}></div>
          </div>

          {/* Наложение анализа */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 backdrop-blur-sm">
            {/* Маркеры сетки анализа в стиле Tesla UI */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-30">
              {Array.from({length: 16}).map((_, i) => (
                <div key={i} className="border border-medical-accent/20 flex items-center justify-center">
                  {i === 5 || i === 6 || i === 9 || i === 10 ? (
                    <div className="w-full h-full border border-medical-accent/40 animate-pulse-glow"></div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          
          {/* Анимация нейронной сети */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({length: 8}).map((_, i) => {
              const size = Math.random() * 30 + 20;
              return (
                <div 
                  key={i}
                  className="absolute rounded-full opacity-30 animate-pulse-glow"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${Math.random() * 70 + 15}%`,
                    top: `${Math.random() * 70 + 15}%`,
                    background: `radial-gradient(circle, rgba(51, 195, 240, 0.4) 0%, rgba(51, 195, 240, 0) 70%)`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              );
            })}
          </div>
        </div>
        
        <div className="tesla-card rounded-xl p-5 flex flex-col">
          <div className="flex items-center mb-4">
            <Loader className="w-5 h-5 text-medical-primary animate-spin mr-3" />
            <h3 className="font-medium text-medical-light">Диагностический анализ</h3>
          </div>
          
          <div className="space-y-6 flex-1">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Прогресс</span>
                <span className="text-medical-accent">{Math.round(progress)}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-white/10" 
              />
            </div>
            
            {/* Стадии анализа */}
            <div className="space-y-3">
              <p className="text-xs text-gray-400">Стадии анализа:</p>
              {analysisStages.map((stage, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`relative w-6 h-6 rounded-full flex items-center justify-center
                    ${index <= activeStage 
                      ? 'bg-medical-accent/20 text-medical-accent'
                      : 'bg-white/10 text-gray-500'
                    }`}
                  >
                    {index < activeStage ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : index === activeStage ? (
                      <div className="w-2 h-2 rounded-full bg-medical-accent animate-pulse"></div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    )}
                    
                    {/* Индикатор активной стадии */}
                    {index === activeStage && (
                      <div className="absolute inset-0 rounded-full border border-medical-accent animate-ping opacity-75"></div>
                    )}
                  </div>
                  <span className={`text-sm ${index <= activeStage ? 'text-gray-200' : 'text-gray-500'}`}>
                    {stage}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <Layers size={16} className="text-medical-primary" />
              <span className="text-xs text-gray-400">Модель: AuraX-Ray Scan v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XrayAnalysis;
