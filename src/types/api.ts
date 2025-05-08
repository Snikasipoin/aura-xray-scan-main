
// Типы для работы с API

export interface XrayAnalysisResult {
  conclusion: string; // Общее заключение
  details: string; // Подробности диагноза
  confidence: number; // Уровень уверенности алгоритма (в процентах)
  dataPoints: {
    label: string; // Название параметра
    percent: number; // Процент уверенности по этому параметру
  }[];
  hasAbnormality: boolean; // Флаг наличия патологии
  heatmapUrl?: string; // URL тепловой карты (с API)
  originalUrl?: string; // URL оригинального изображения (с API)
}

export interface ApiConfig {
  baseUrl: string; // Базовый URL для API
  endpoints: {
    analyze: string; // Эндпоинт для анализа изображений
    health: string; // Эндпоинт для проверки доступности
  };
}

// Параметры для функции создания PDF-отчета
export interface PdfReportOptions {
  imageUrl: string; // URL изображения рентгена
  analysisResult: XrayAnalysisResult; // Результаты анализа
  showHeatmap: boolean; // Флаг отображения тепловой карты
  patientName?: string; // Опционально: имя пациента
  timestamp?: Date; // Опционально: дата и время анализа
}
