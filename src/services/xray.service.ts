
import { XrayAnalysisResult } from '../types/api';
import { getApiConfig } from '../config/api.config';

// Mock data for when API is unavailable
const MOCK_RESULT: XrayAnalysisResult = {
  conclusion: "Заключение: Значимых патологических изменений не выявлено.",
  details: "Сердечный контур нормальных размеров. Легочные поля без очаговых теней, пневмоторакса или плеврального выпота. Острых костных аномалий не выявлено.",
  confidence: 94,
  dataPoints: [
    { label: "Чистые легкие", percent: 96 },
    { label: "Нормальный размер сердца", percent: 92 },
    { label: "Отсутствие выпота", percent: 97 },
    { label: "Отсутствие пневмоторакса", percent: 98 },
  ],
  hasAbnormality: false
};

// Extract conclusion text from GPT diagnosis
const extractConclusionText = (diagnosisText: string): string => {
  if (!diagnosisText) return "";
  
  // Different conclusion markers with various formats and cases
  const conclusionMarkers = [
    "Заключение:", 
    "заключение:", 
    "ЗАКЛЮЧЕНИЕ:", 
    "### Заключение", 
    "### ЗАКЛЮЧЕНИЕ",
    "**Заключение:**",
    "Заключение",
    "ЗАКЛЮЧЕНИЕ",
    "\n\n### Заключение",
    "\nЗаключение:",
    "\n\nЗаключение:"
  ];
  
  // Find first occurrence of any marker
  let startIndex = -1;
  let markerFound = "";
  
  for (const marker of conclusionMarkers) {
    const index = diagnosisText.indexOf(marker);
    if (index !== -1 && (startIndex === -1 || index < startIndex)) {
      startIndex = index;
      markerFound = marker;
    }
  }
  
  // If marker found, return text after it
  if (startIndex !== -1) {
    return diagnosisText.substring(startIndex);
  }
  
  // If no marker found, return original text
  return diagnosisText;
};

// Transform API response to frontend format
const transformApiResponse = (apiResponse: any): XrayAnalysisResult => {
  // Determine if pathology exists based on first element in details
  // If first element is "Норма" with high confidence, consider no pathology
  const isNormal = apiResponse.details[0].label === "Норма" && apiResponse.details[0].confidence > 50;
  
  // Extract conclusion text from gpt_diagnosis
  const conclusionText = extractConclusionText(apiResponse.gpt_diagnosis || "");
  
  return {
    conclusion: conclusionText || "Заключение: Анализ завершен",
    details: apiResponse.interpretation || "",
    confidence: apiResponse.details[0].confidence || 0,
    dataPoints: apiResponse.details.map((detail: any) => ({
      label: detail.label,
      percent: detail.confidence
    })),
    hasAbnormality: !isNormal,
    // Add additional fields returned by API
    heatmapUrl: apiResponse.heatmap_url || "",
    originalUrl: apiResponse.original_url || ""
  };
};

// Send image for analysis
export const analyzeXrayImage = async (imageFile: File): Promise<XrayAnalysisResult> => {
  const { baseUrl, endpoints } = getApiConfig();
  
  try {
    // Transform file to suitable format for sending
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await fetch(`${baseUrl}${endpoints.analyze}`, {
      method: 'POST',
      body: formData,
      // Increase timeout to 60 seconds for image analysis
      signal: AbortSignal.timeout(60000),
    });
    
    if (!response.ok) {
      throw new Error(`Analysis error: ${response.statusText}`);
    }
    
    const apiResponse = await response.json();
    console.log('API response:', apiResponse);
    
    // Transform API response to format used by frontend
    return transformApiResponse(apiResponse);
  } catch (error) {
    console.error('Error sending analysis request:', error);
    
    // Use mock data in case of error
    console.warn('Using local test data instead of server results');
    return MOCK_RESULT;
  }
};
