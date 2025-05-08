
import { ApiConfig } from '../types/api';

// Конфигурация по умолчанию для API
const DEFAULT_API_URL = 'https://snikasipoin-api-xray-scan-ed4e.twc1.net'; // URL API бэкенда

// Получаем URL API из локального хранилища или используем значение по умолчанию
export const getApiConfig = (): ApiConfig => {
  const storedApiUrl = localStorage.getItem('xrayApiUrl');
  const baseUrl = storedApiUrl || DEFAULT_API_URL;
  
  return {
    baseUrl,
    endpoints: {
      analyze: '/upload', // Эндпоинт для анализа изображений соответствует бэкенду
      health: '/' // Эндпоинт для проверки доступности
    }
  };
};

// Сохранение нового URL API
export const setApiUrl = (url: string): void => {
  localStorage.setItem('xrayApiUrl', url);
};

// Проверка доступности API
export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    const { baseUrl, endpoints } = getApiConfig();
    const response = await fetch(`${baseUrl}${endpoints.health}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Таймаут 5 секунд для проверки доступности
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch (error) {
    console.error('Ошибка при проверке доступности API:', error);
    return false;
  }
};
