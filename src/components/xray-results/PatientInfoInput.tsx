
import { useState } from "react";
import { Input } from "@/components/ui/input";

type PatientInfoInputProps = {
  onPatientNameChange: (name: string) => void;
  patientName: string;
};

const PatientInfoInput = ({ onPatientNameChange, patientName }: PatientInfoInputProps) => {
  return (
    <div className="glass-panel p-3 rounded-lg mb-4">
      <h4 className="text-sm font-medium text-gray-200 mb-2">ФИО пациента</h4>
      <Input 
        value={patientName}
        onChange={(e) => onPatientNameChange(e.target.value)}
        className="bg-medical-dark/50 border-medical-primary/30 text-white"
        placeholder="Введите ФИО пациента для отчета"
      />
    </div>
  );
};

export default PatientInfoInput;
