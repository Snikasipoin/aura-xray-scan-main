
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface ConsentModalProps {
  isOpen: boolean;
  onClose: (accepted: boolean) => void;
}

const ConsentModal = ({ isOpen, onClose }: ConsentModalProps) => {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Проверяем статус согласия каждый раз когда модальное окно открывается
  useEffect(() => {
    if (isOpen) {
      const savedConsent = sessionStorage.getItem('dataProcessingConsent');
      if (savedConsent === 'accepted') {
        setHasConsented(true);
      } else if (savedConsent === 'rejected') {
        setHasConsented(false);
      } else {
        setHasConsented(null);
      }
    }
  }, [isOpen]);

  const handleAccept = () => {
    sessionStorage.setItem('dataProcessingConsent', 'accepted');
    setHasConsented(true);
    toast({
      title: "Согласие принято",
      description: "Вы можете начать работу с сервисом",
    });
    onClose(true);
  };

  const handleReject = () => {
    sessionStorage.setItem('dataProcessingConsent', 'rejected');
    setHasConsented(false);
    toast({
      title: "Согласие отклонено",
      description: "Некоторые функции сервиса будут ограничены",
      variant: "destructive",
    });
    onClose(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(hasConsented === true)}>
      <DialogContent className="sm:max-w-xl glass-panel-heavy border-medical-primary/20">
        <DialogHeader>
          <DialogTitle className="text-medical-accent glow-text">Согласие на обработку персональных данных</DialogTitle>
          <DialogDescription className="text-gray-400">
            Пожалуйста, ознакомьтесь с условиями обработки персональных данных
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[300px] mt-4 rounded-md border border-white/10 p-4">
          <div className="text-sm text-gray-300 space-y-4">
            <p>
              Настоящим я даю согласие на обработку моих персональных данных владельцу сервиса AuraX-Ray Scan, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (распространение, предоставление, доступ), обезличивание, блокирование, удаление, уничтожение персональных данных.
            </p>
            
            <p>
              Цель обработки персональных данных: анализ медицинских изображений, предоставление результатов анализа, улучшение точности и эффективности алгоритмов искусственного интеллекта.
            </p>
            
            <p>
              Перечень персональных данных, на обработку которых дается согласие: загруженные рентгеновские изображения, результаты анализа, метаданные изображений.
            </p>
            
            <p>
              Я подтверждаю, что ознакомлен(а) с правилами обработки персональных данных и мне разъяснено, что:
            </p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Анализ изображений осуществляется на сервере, но сервер не осуществляет хранение моих данных.</li>
              <li>Мои персональные данные не будут переданы третьим лицам без моего дополнительного согласия.</li>
              <li>Я имею право отозвать свое согласие путем направления письменного уведомления.</li>
              <li>В случае отзыва согласия на обработку персональных данных, они будут удалены из системы.</li>
            </ul>
            
            <p>
              Настоящее согласие действует со дня его подписания до дня отзыва в письменной форме.
            </p>
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-2">
          {hasConsented === true ? (
            <div className="w-full text-center py-2 text-medical-accent font-medium">
              Вы уже дали свое согласие. Спасибо!
            </div>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={handleReject} 
                className="w-full sm:w-auto text-medical-light/70 border-medical-light/20 hover:bg-medical-light/10"
              >
                Отклонить
              </Button>
              <Button 
                onClick={handleAccept}
                className="w-full sm:w-auto bg-medical-primary text-white hover:bg-medical-primary/80"
              >
                Принимаю условия
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentModal;
