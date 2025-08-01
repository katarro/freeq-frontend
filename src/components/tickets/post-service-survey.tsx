import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Send, X, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostServiceSurveyProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (responses: SurveyResponses) => Promise<void>;
  ticketNumber: string | number;
  serviceName?: string;
  branchName?: string;
}

interface SurveyResponses {
  appUsability: number; // 1-5
  timeAccuracy: number; // 1-5
  comparedToPhysical: number; // 1-5 (1=mucho peor, 5=mucho mejor)
  ticketId?: string;
}

interface QuestionProps {
  title: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  labels?: {
    min: string;
    max: string;
  };
}

function StarRating({ title, description, value, onChange, labels }: QuestionProps) {
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  return (
    <Card className="p-4">
      <CardContent className="p-0">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-base text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>

          {/* Estrellas */}
          <div className="flex items-center justify-center gap-1 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={cn(
                  'p-1 transition-all duration-200 hover:scale-110',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50 rounded',
                )}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => onChange(star)}
              >
                <Star
                  className={cn(
                    'w-8 h-8 transition-colors duration-200',
                    hoveredStar >= star || (!hoveredStar && value >= star)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-300 hover:fill-yellow-200 hover:text-yellow-300',
                  )}
                />
              </button>
            ))}
          </div>

          {/* Labels opcionales */}
          {labels && (
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <span>{labels.min}</span>
              <span>{labels.max}</span>
            </div>
          )}

          {/* Indicador de calificación seleccionada */}
          {value > 0 && (
            <div className="text-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full text-sm font-medium text-yellow-800">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {value} de 5 estrellas
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function PostServiceSurvey({
  isOpen,
  onClose,
  onSubmit,
  ticketNumber,
  serviceName = 'Servicio',
  branchName = 'Sucursal',
}: PostServiceSurveyProps) {
  const [responses, setResponses] = useState<SurveyResponses>({
    appUsability: 0,
    timeAccuracy: 0,
    comparedToPhysical: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const updateResponse = (field: keyof SurveyResponses, value: number) => {
    setResponses((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      responses.appUsability > 0 && responses.timeAccuracy > 0 && responses.comparedToPhysical > 0
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);

    try {
      // Llamar a onSubmit y esperar a que complete
      await onSubmit(responses);

      setShowThankYou(true);

      // Esperar 4 segundos antes de cerrar modal de agradecimiento
      setTimeout(() => {
        handleClose();
      }, 4000);
    } catch (error) {
      console.error('❌ [PostServiceSurvey] Error enviando encuesta:', error);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Resetear estado
    setResponses({
      appUsability: 0,
      timeAccuracy: 0,
      comparedToPhysical: 0,
    });
    setShowThankYou(false);
    setIsSubmitting(false);

    onClose();
  };

  const handleSkip = () => {
    handleClose();
  };

  // Si estamos mostrando el mensaje de agradecimiento
  if (showThankYou) {
    return (
      <Dialog open={isOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <ThumbsUp className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">¡Gracias por tu feedback!</h2>
            <p className="text-gray-600">Tu opinión nos ayuda a mejorar la experiencia de FreeQ</p>
            <div className="mt-4 text-sm text-gray-500">
              Este mensaje se cerrará automáticamente...
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Formulario normal
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="pt-4 text-2xl font-bold text-primary">
            ¿Cómo fue tu experiencia?
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 mt-2">
            Tu ticket #{ticketNumber} ha sido atendido en <b>{serviceName}</b>, {branchName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Pregunta 1: Usabilidad de la app */}
          <StarRating
            title="¿Qué tan fácil fue usar la aplicación de FreeQ?"
            description="Evalúa la facilidad de uso, navegación y experiencia general de la aplicación"
            value={responses.appUsability}
            onChange={(value) => updateResponse('appUsability', value)}
            labels={{
              min: 'Muy difícil',
              max: 'Muy fácil',
            }}
          />

          {/* Pregunta 2: Precisión del tiempo */}
          <StarRating
            title="¿Qué tan preciso fue el tiempo estimado de espera?"
            description="¿El tiempo real de espera coincidió con la estimación mostrada?"
            value={responses.timeAccuracy}
            onChange={(value) => updateResponse('timeAccuracy', value)}
            labels={{
              min: 'Muy impreciso',
              max: 'Muy preciso',
            }}
          />

          {/* Pregunta 3: Comparación con fila física */}
          <StarRating
            title="Comparado con esperar en fila física, FreeQ es:"
            description="Compara tu experiencia usando FreeQ vs. hacer cola físicamente"
            value={responses.comparedToPhysical}
            onChange={(value) => updateResponse('comparedToPhysical', value)}
            labels={{
              min: 'Mucho peor',
              max: 'Mucho mejor',
            }}
          />

          {/* Indicador de progreso */}
          <div className="text-center">
            <div className="text-sm text-gray-500">
              Preguntas respondidas: {Object.values(responses).filter((v) => v > 0).length} de 3
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 pt-4">
          <Button variant="ghost" onClick={handleSkip} disabled={isSubmitting}>
            <X className="w-4 h-4 mr-2" />
            Omitir encuesta
          </Button>

          <Button onClick={handleSubmit} disabled={!isFormValid() || isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar encuesta
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
