// src/hooks/use-audio-alarm.ts
'use client';

import { useRef, useCallback } from 'react';

interface UseAudioAlarmReturn {
  playAlarm: () => Promise<boolean>;
  stopAlarm: () => void;
  isPlaying: () => boolean;
}

export function useAudioAlarm(): UseAudioAlarmReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // ✅ FUNCIÓN para reproducir alarma
  const playAlarm = useCallback(async (): Promise<boolean> => {
    try {
      // ✅ CREAR nueva instancia de audio cada vez
      const audio = new Audio('/alarma.mp3');
      audio.volume = 0.8;
      audio.currentTime = 0;

      audioRef.current = audio;
      isPlayingRef.current = true;

      // ✅ EVENTO cuando termina de reproducirse
      audio.addEventListener('ended', () => {
        isPlayingRef.current = false;
      });

      // ✅ EVENTO si hay error
      audio.addEventListener('error', () => {
        isPlayingRef.current = false;
      });

      // ✅ REPRODUCIR
      await audio.play();
      return true;
    } catch (error) {
      isPlayingRef.current = false;

      // ✅ FALLBACK: Beeps sintéticos
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Crear 3 beeps de emergencia
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 1000;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.3;

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
          }, i * 400);
        }
        return true;
      } catch (fallbackError) {
        return false;
      }
    }
  }, []);

  // ✅ FUNCIÓN para detener alarma
  const stopAlarm = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    isPlayingRef.current = false;
  }, []);

  // ✅ FUNCIÓN para verificar si está reproduciéndose
  const isPlaying = useCallback(() => {
    return isPlayingRef.current;
  }, []);

  return {
    playAlarm,
    stopAlarm,
    isPlaying,
  };
}
