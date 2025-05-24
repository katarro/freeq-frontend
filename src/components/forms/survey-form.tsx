'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { surveySchema, type SurveyFormValues } from '@/lib/schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

type SurveyFormProps = {
  initialData?: SurveyFormValues;
  isEditing?: boolean;
}

export default function SurveyForm({ initialData, isEditing = false }: SurveyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateUniqueId = () => {
    return `q_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'Programada',
      responses: 0,
      satisfaction: 0,
      questions: [
        { id: generateUniqueId(), text: '¿Cómo calificaría la atención recibida?', type: 'rating' },
        {
          id: generateUniqueId(),
          text: '¿Cuánto tiempo esperó para ser atendido?',
          type: 'multiple',
          options: ['Menos de 5 minutos', 'Entre 5 y 15 minutos', 'Entre 15 y 30 minutos', 'Más de 30 minutos'],
        },
        { id: generateUniqueId(), text: '¿Algún comentario adicional sobre su experiencia?', type: 'text' },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  const submitButtonText = isEditing ? 'Guardar Cambios' : 'Crear Encuesta';
  const loadingButtonText = isEditing ? 'Guardando cambios...' : 'Creando Encuesta...';
  const successMessage = isEditing ? 'Encuesta actualizada exitosamente!' : 'Encuesta creada exitosamente!';
  const errorMessage = `Ocurrió un error al ${isEditing ? 'actualizar' : 'crear'} la encuesta. Inténtalo de nuevo.`;


  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(successMessage);
      router.push('/company-administrator/surveys');
    } catch (error) {
      console.error(errorMessage, error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    append({ id: generateUniqueId(), text: '', type: 'rating' });
  };

  const addOption = (questionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`) || [];
    form.setValue(`questions.${questionIndex}.options`, [...currentOptions, '']);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`) || [];
    const newOptions = currentOptions.filter((_, i) => i !== optionIndex);
    form.setValue(`questions.${questionIndex}.options`, newOptions);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg w-full mx-auto flex flex-col gap-4">
        <div className="grid gap-6">
          <div className="grid gap-4">
            <h2 className="text-base font-medium">Información de la encuesta</h2>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label="Título"
                      placeholder='Ej. Encuestra 1'
                      type='text'
                      disabled={isSubmitting}
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      label="Descripción"
                      placeholder='Ej. Encuesta para generar ingresos'
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-[1fr_1fr] md:grid-cols-3">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="rounded-r-none"
                        label="Fecha de inicio"
                        placeholder='Ej. 30/05/2025'
                        disabled={isSubmitting}
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="md:rounded-r-none rounded-l-none"
                        label="Fecha de fin"
                        placeholder='Ej. 08/05/2025'
                        disabled={isSubmitting}
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1 mt-4 md:mt-0">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger floatingLabel="Estado" className="md:rounded-l-none">
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Activa">Activa</SelectItem>
                        <SelectItem value="Programada">Programada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium">Preguntas</h2>
              <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" /> Agregar Pregunta
              </Button>
            </div>

            {fields.map((question, index) => (
              <Card key={question.id} className="border grid grid-cols-[1fr_auto]">
                <CardContent className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name={`questions.${index}.text`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              label={`Pregunta ${index + 1}`}
                              placeholder='Ej. ¿Cómo calificaría la atención recibida?'
                              type='text'
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`questions.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={(value) => {
                          if (value !== 'multiple') {
                            form.setValue(`questions.${index}.options`, undefined);
                          }
                          field.onChange(value);
                        }} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger floatingLabel="Tipo de respuesta">
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="rating">Calificación (1-5 estrellas)</SelectItem>
                            <SelectItem value="text">Texto libre</SelectItem>
                            <SelectItem value="multiple">Opción múltiple</SelectItem>
                            <SelectItem value="boolean">Sí/No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch(`questions.${index}.type`) === 'multiple' && (
                    <div className="space-y-2">
                      <FormLabel>Opciones</FormLabel>
                      <div className="grid gap-4">
                        {(form.watch(`questions.${index}.options`) || []).map((option, optIndex) => (
                          <div key={optIndex} className="grid items-center grid-cols-[1fr_auto] gap-2">
                            <Input
                              label={`Opción ${optIndex + 1}`}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(form.getValues(`questions.${index}.options`) || [])];
                                newOptions[optIndex] = e.target.value;
                                form.setValue(`questions.${index}.options`, newOptions);
                              }}
                              placeholder={`Opción ${optIndex + 1}`}
                            />
                            <abbr title="Eliminar opción">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(index, optIndex)}
                              >
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </abbr>
                          </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => addOption(index)}>
                          <Plus className="h-4 w-4 mr-2" /> Agregar Opción
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
                <div className="pr-4 py-6">
                  <abbr title="Eliminar pregunta">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className=""
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </abbr>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push('/company-administrator/surveys')}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-[#00a0b0] hover:bg-[#008a99]" disabled={isSubmitting}>
            {isSubmitting ? loadingButtonText : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
