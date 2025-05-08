
import React from "react";

type TabNavigationProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const TabNavigation = ({ activeTab, setActiveTab }: TabNavigationProps) => {
  return (
    <div className="mb-6 flex justify-center">
      <div className="tesla-card rounded-full p-1 inline-flex">
        <button 
          onClick={() => setActiveTab("diagnosis")}
          className={`rounded-full px-4 py-2 text-sm ${
            activeTab === "diagnosis" 
              ? "bg-medical-primary/20 text-medical-primary" 
              : "text-gray-400 hover:bg-white/5"
          } transition-colors`}
        >
          Диагноз
        </button>
        <button 
          onClick={() => setActiveTab("details")}
          className={`rounded-full px-4 py-2 text-sm ${
            activeTab === "details" 
              ? "bg-medical-accent/20 text-medical-accent" 
              : "text-gray-400 hover:bg-white/5"
          } transition-colors`}
        >
          Детали анализа
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
