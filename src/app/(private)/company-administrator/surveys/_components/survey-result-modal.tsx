'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Star } from 'lucide-react';
import { SurveyFormValues } from '@/lib/schemas';

interface SurveyResultsModalProps {
  survey: SurveyFormValues;
}

export default function SurveyResultsModal({ survey }: SurveyResultsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Ver Resultados" className="h-8 w-8 shadow-none text-muted-foreground">
          <BarChart className="h-4 w-4" />
          <span className="sr-only">Ver resultados</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Resultados de la encuesta: {survey.title}</DialogTitle>
          <DialogDescription>
            Detalles y métricas clave para la encuesta &quot;{survey.title}&quot;.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Respuestas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{survey.responses}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Preguntas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{survey?.questions?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Satisfacción general</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{survey.satisfaction}%</div>
                <div className="mt-4 h-2 w-full bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${survey.satisfaction < 70 ? 'bg-red-500' : survey.satisfaction < 85 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${survey.satisfaction}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Período</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {survey.startDate} - {survey.endDate}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribución de calificaciones</CardTitle>
              <CardDescription>Porcentaje de calificaciones por estrellas (ejemplo)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { stars: 5, percentage: 45, color: 'bg-green-500' },
                  { stars: 4, percentage: 30, color: 'bg-green-400' },
                  { stars: 3, percentage: 15, color: 'bg-yellow-400' },
                  { stars: 2, percentage: 7, color: 'bg-orange-400' },
                  { stars: 1, percentage: 3, color: 'bg-red-500' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{item.stars} estrellas</span>
                      <span className="text-sm font-medium">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comentarios recientes</CardTitle>
              <CardDescription>Últimos comentarios de los clientes (ejemplo)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { comment: 'Excelente atención, muy rápido y eficiente.', rating: 5, date: '15/05/2025' },
                  {
                    comment: 'El tiempo de espera fue un poco largo, pero la atención fue buena.',
                    rating: 4,
                    date: '14/05/2025',
                  },
                  {
                    comment: 'Me gustaría que hubiera más cajas disponibles en horas punta.',
                    rating: 3,
                    date: '13/05/2025',
                  },
                  {
                    comment: 'El ejecutivo fue muy amable y resolvió todas mis dudas.',
                    rating: 5,
                    date: '12/05/2025',
                  },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-md border">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex">
                        {Array(5)
                          .fill(0)
                          .map((_, idx) => (
                            <Star
                              key={idx}
                              className={`h-4 w-4 ${idx < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                    <p className="text-sm">{item.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
