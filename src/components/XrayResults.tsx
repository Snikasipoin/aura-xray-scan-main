
import { useState } from "react";
import { XrayAnalysisResult } from "@/types/api";
import ImageDisplay from "./xray-results/ImageDisplay";
import DiagnosisTab from "./xray-results/DiagnosisTab";
import DetailsTab from "./xray-results/DetailsTab";
import TabNavigation from "./xray-results/TabNavigation";
import PatientInfoInput from "./xray-results/PatientInfoInput";

type XrayResultsProps = {
  imageUrl: string;
  analysisResult: XrayAnalysisResult;
};

const XrayResults = ({ imageUrl, analysisResult }: XrayResultsProps) => {
  const [activeTab, setActiveTab] = useState("diagnosis");
  const [patientName, setPatientName] = useState("");
  const [diagnosisShown, setDiagnosisShown] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tesla-style tabs */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Patient info input */}
      <div className="mb-4">
        <PatientInfoInput 
          patientName={patientName}
          onPatientNameChange={setPatientName}
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* X-ray image with heatmap */}
        <ImageDisplay imageUrl={imageUrl} analysisResult={analysisResult} />
        
        {/* Diagnosis information */}
        <div className="tesla-card rounded-xl p-5 flex flex-col">
          {activeTab === "diagnosis" ? (
            <DiagnosisTab 
              imageUrl={imageUrl} 
              analysisResult={analysisResult} 
              diagnosisShown={diagnosisShown}
              setDiagnosisShown={setDiagnosisShown}
              patientName={patientName}
            />
          ) : (
            <DetailsTab 
              imageUrl={imageUrl} 
              analysisResult={analysisResult} 
              patientName={patientName}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default XrayResults;
