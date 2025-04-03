"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DniFormValues } from "@/lib/schemas";
import DniForm from "@/components/forms/dni-form";
import ThanksDialog from "./thanks-dialog";
import { useState } from "react";

export default function DniDialog() {
  const [showThanks, setShowThanks] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function onSubmit(values: DniFormValues) {
    try {
      // Aquí iría la lógica de autenticación
      console.log(values);
      setIsOpen(false); // Cerrar el diálogo de DNI
      setShowThanks(true); // Mostrar el diálogo de agradecimiento
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" onClick={() => setIsOpen(true)}>
            Unirse a la fila
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[293px] pt-14 gap-4">
          <DialogHeader>
            <DialogTitle className="text-start text-2xl font-semibold">
              Verifica tu identidad <br /> para confirmar tu turno
            </DialogTitle>
            <DialogDescription className="sr-only">
              Por favor, ingresa tu DNI para confirmar tu turno.
            </DialogDescription>
          </DialogHeader>
          <DniForm onSubmit={onSubmit} />
        </DialogContent>
      </Dialog>

      <ThanksDialog open={showThanks} onOpenChange={setShowThanks} />
    </>
  );
}

