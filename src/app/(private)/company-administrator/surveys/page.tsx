'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { initialSurveyData } from './data';

import { SurveyTable } from './_components/surveys-table';

export default function SurveysPage() {
  return (
    <>
      <section className="grid gap-6 pb-[calc(56px+16px)]">
        <Heading
          title="Gestión de Encuestas"
          right={
            <Link
              href="/company-administrator/surveys/new"
              aria-label="Crear encuesta"
              className={cn(buttonVariants({ variant: 'default' }), 'hidden lg:flex')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Encuesta
            </Link>
          }
        />
        <Separator />

        <Tabs defaultValue="encuestas" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encuestas">Encuestas</TabsTrigger>
            <TabsTrigger value="resultados">Resultados Generales</TabsTrigger>
          </TabsList>

          <TabsContent value="encuestas" className="space-y-4 mt-4">
            <SurveyTable data={initialSurveyData} />
          </TabsContent>

          <TabsContent value="resultados" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Satisfacción General</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">+5% desde el mes pasado</p>
                  <div className="mt-4 h-2 w-full bg-gray-200 rounded-full">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tiempo de Espera</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">+3% desde el mes pasado</p>
                  <div className="mt-4 h-2 w-full bg-gray-200 rounded-full">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Atención del Personal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">95%</div>
                  <p className="text-xs text-muted-foreground">+2% desde el mes pasado</p>
                  <div className="mt-4 h-2 w-full bg-gray-200 rounded-full">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Recomendación</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">90%</div>
                  <p className="text-xs text-muted-foreground">+4% desde el mes pasado</p>
                  <div className="mt-4 h-2 w-full bg-gray-200 rounded-full">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Calificaciones</CardTitle>
                  <CardDescription>Porcentaje de calificaciones por estrellas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">5 estrellas</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">4 estrellas</span>
                        <span className="text-sm font-medium">30%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-400 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">3 estrellas</span>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">2 estrellas</span>
                        <span className="text-sm font-medium">7%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-orange-400 h-2.5 rounded-full" style={{ width: '7%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">1 estrella</span>
                        <span className="text-sm font-medium">3%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '3%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comentarios Recientes</CardTitle>
                  <CardDescription>Últimos comentarios de los clientes</CardDescription>
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
                                <svg
                                  key={idx}
                                  className={`h-4 w-4 ${idx < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
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
          </TabsContent>
        </Tabs>
      </section>
      <Link
        href="/company-administrator/surveys/new"
        aria-label="Crear encuesta"
        className={cn(buttonVariants({ variant: 'fab', size: 'fab' }), 'fixed bottom-[calc(55px+16px)] right-4 lg:hidden')}
      >
        <Plus />
        Crear encuesta
      </Link>
    </>
  );
}
