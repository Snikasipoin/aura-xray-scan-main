
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PdfReportOptions } from '../types/api';

// Сервис для генерации PDF отчетов
export const generatePdfReport = async (options: PdfReportOptions): Promise<void> => {
  const { imageUrl, analysisResult, showHeatmap, patientName = 'Не указан', timestamp = new Date() } = options;
  
  try {
    // Создаем временный элемент для рендеринга отчета
    const reportElement = document.createElement('div');
    reportElement.style.padding = '20px';
    reportElement.style.background = 'white';
    reportElement.style.width = '595px'; // A4 в пикселях (72 dpi)
    reportElement.style.position = 'fixed';
    reportElement.style.left = '-9999px';
    
    // Форматируем дату для отчета
    const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const formattedDate = dateFormatter.format(timestamp);

    // Получаем URL изображений для отчета
    const originalImageUrl = analysisResult.originalUrl 
      ? `${getApiBaseUrl()}${analysisResult.originalUrl}`
      : imageUrl;
      
    const heatmapImageUrl = analysisResult.heatmapUrl 
      ? `${getApiBaseUrl()}${analysisResult.heatmapUrl}`
      : imageUrl;

    // Создаем содержимое отчета
    reportElement.innerHTML = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div style="font-size: 22px; font-weight: bold; color: #4338ca;">Aura X-Ray Scan</div>
          <div style="font-size: 14px; color: #666;">${formattedDate}</div>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #ddd; margin: 10px 0;">
        
        <div style="margin-bottom: 20px;">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">Данные пациента</div>
          <div style="padding: 8px; background-color: #f7f7f7; border-radius: 4px;">${patientName}</div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div style="width: 48%;">
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px; text-align: center;">Оригинальный снимок</div>
            <img src="${originalImageUrl}" style="width: 100%; border: 1px solid #ddd;" alt="Рентген" />
          </div>
          <div style="width: 48%;">
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px; text-align: center;">Тепловая карта</div>
            <img src="${heatmapImageUrl}" style="width: 100%; border: 1px solid #ddd;" alt="Тепловая карта" />
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">Заключение</div>
          <div style="padding: 10px; background-color: ${analysisResult.hasAbnormality ? '#fff0f0' : '#f0fff0'}; border-radius: 4px;">
            ${analysisResult.conclusion}
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">Уверенность алгоритма</div>
          <div style="display: flex; align-items: center;">
            <div style="width: 80%; height: 10px; background-color: #ddd; border-radius: 5px; margin-right: 10px; position: relative;">
              <div style="position: absolute; top: 0; left: 0; height: 100%; width: ${analysisResult.confidence}%; background-color: ${
                analysisResult.hasAbnormality ? '#ef4444' : '#22c55e'
              }; border-radius: 5px;"></div>
            </div>
            <div>${analysisResult.confidence}%</div>
          </div>
        </div>
        
        <div>
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">Параметры анализа</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            ${analysisResult.dataPoints.map(point => `
              <div style="padding: 8px; background-color: #f7f7f7; border-radius: 4px;">
                <div style="font-weight: bold;">${point.label}</div>
                <div>${point.percent}%</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0 10px;">
        
        <div style="font-size: 12px; color: #666; text-align: center;">
          Анализ выполнен с использованием алгоритма нейросетевой диагностики AuraX-Ray Scan v1.0
        </div>
      </div>
    `;

    // Функция для получения базового URL API
    function getApiBaseUrl() {
      const storedApiUrl = localStorage.getItem('xrayApiUrl');
      return storedApiUrl || 'https://snikasipoin-api-xray-scan-ed4e.twc1.net';
    }

    // Добавляем элемент в документ для рендеринга
    document.body.appendChild(reportElement);

    // Создаем PDF с помощью html2canvas и jsPDF
    const canvas = await html2canvas(reportElement, {
      scale: 2, // Увеличиваем масштаб для лучшего качества
      useCORS: true, // Разрешаем загрузку внешних изображений
      logging: false // Отключаем логи
    });
    
    // Создаем PDF документ
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Добавляем изображение с canvas в PDF
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    
    pdf.addImage(imgData, 'PNG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
    
    // Удаляем временный элемент
    document.body.removeChild(reportElement);
    
    // Скачиваем PDF
    const fileName = `xray-report-${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(fileName);
    
    console.log('PDF отчет успешно создан и скачан');
  } catch (error) {
    console.error('Ошибка при создании PDF отчета:', error);
    throw new Error('Не удалось создать PDF отчет');
  }
};
