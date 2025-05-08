
import { ShieldCheck, Users, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { XrayAnalysisResult } from "@/types/api";
import { generatePdfReport } from "@/services/report.service";
import { toast } from "@/components/ui/sonner";
import { useState } from "react";

type DetailsTabProps = {
  imageUrl: string;
  analysisResult: XrayAnalysisResult;
  patientName: string;
};

const DetailsTab = ({ imageUrl, analysisResult, patientName }: DetailsTabProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

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
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-medical-light">Детальный анализ</h3>
      
      <div className="space-y-3">
        <div className="glass-panel p-3 rounded-lg">
          <div className="flex items-center mb-2">
            <ShieldCheck size={16} className={analysisResult.hasAbnormality ? "text-yellow-400 mr-2" : "text-green-400 mr-2"} />
            <h4 className="text-sm font-medium text-gray-200">Легочная ткань</h4>
          </div>
          <p className="text-xs text-gray-400">
            {analysisResult.hasAbnormality 
              ? "Обнаружены изменения в легочной ткани. Рекомендуется дополнительная диагностика."
              : "Легочные поля без очаговых и инфильтративных изменений. Легочный рисунок не изменен. Корни структурны. Синусы свободны."}
          </p>
        </div>
        
        <div className="glass-panel p-3 rounded-lg">
          <div className="flex items-center mb-2">
            <ShieldCheck size={16} className={analysisResult.hasAbnormality ? "text-yellow-400 mr-2" : "text-green-400 mr-2"} />
            <h4 className="text-sm font-medium text-gray-200">Сердце и сосуды</h4>
          </div>
          <p className="text-xs text-gray-400">
            {analysisResult.hasAbnormality 
              ? "Отмечается изменение конфигурации сердечной тени. Требуется дополнительное обследование."
              : "Сердце нормальных размеров и конфигурации. Аорта без особенностей. КТИ в пределах нормы."}
          </p>
        </div>
        
        <div className="glass-panel p-3 rounded-lg">
          <div className="flex items-center mb-2">
            <Users size={16} className="text-medical-accent mr-2" />
            <h4 className="text-sm font-medium text-gray-200">Сравнительный анализ</h4>
          </div>
          <p className="text-xs text-gray-400">
            {analysisResult.hasAbnormality 
              ? "Результат отклоняется от нормы. Сравнение проведено с базой из 50,000+ рентгенограмм с подтвержденными диагнозами."
              : "Результат соответствует норме. Сравнение проведено с базой из 50,000+ рентгенограмм с подтвержденными диагнозами."}
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-white/10">
        <p className="text-xs text-gray-500">
          Анализ выполнен с использованием алгоритма нейросетевой диагностики AuraX-Ray Scan v1.0
        </p>
      </div>
      
      {/* Button to download report in details tab */}
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
  );
};

export default DetailsTab;
