// src/services/audio-activation.service.ts
'use client';

// ✅ SERVICIO DE AUDIO PERSISTENTE CON LOCALSTORAGE
export class AudioActivationService {
  private static readonly STORAGE_KEY = 'freeq_audio_activated';
  private static readonly ACTIVATION_TIME_KEY = 'freeq_audio_activation_time';

  static async activateAudio(): Promise<boolean> {
    try {
      // ✅ VERIFICAR si ya está activado y aún válido (menos de 24 horas)
      if (this.isRecentlyActivated()) {
        return true;
      }

      // ✅ REPRODUCIR audio temporal para desbloquear permisos
      const tempAudio = new Audio('/alarma.mp3');
      tempAudio.volume = 0.01; // Casi silencioso
      tempAudio.currentTime = 0;

      await tempAudio.play();

      // Pausar muy rápido
      setTimeout(() => {
        tempAudio.pause();
        tempAudio.currentTime = 0;
      }, 50);

      // ✅ GUARDAR en localStorage que el audio está activado
      this.saveActivationState();

      return true;
    } catch (error) {
      return false;
    }
  }

  static saveActivationState(): void {
    const now = Date.now();
    localStorage.setItem(this.STORAGE_KEY, 'true');
    localStorage.setItem(this.ACTIVATION_TIME_KEY, now.toString());
  }

  static isActivated(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  static isRecentlyActivated(): boolean {
    const activationTime = localStorage.getItem(this.ACTIVATION_TIME_KEY);
    if (!activationTime || !this.isActivated()) return false;

    const now = Date.now();
    const activatedAt = parseInt(activationTime, 10);
    const hoursSinceActivation = (now - activatedAt) / (1000 * 60 * 60);

    // ✅ CONSIDERAR activado si fue hace menos de 24 horas
    return hoursSinceActivation < 24;
  }

  static getActivationInfo(): { activated: boolean; hoursAgo: number | null } {
    const activationTime = localStorage.getItem(this.ACTIVATION_TIME_KEY);
    const activated = this.isActivated();

    if (!activationTime || !activated) {
      return { activated: false, hoursAgo: null };
    }

    const now = Date.now();
    const activatedAt = parseInt(activationTime, 10);
    const hoursAgo = (now - activatedAt) / (1000 * 60 * 60);

    return { activated, hoursAgo };
  }

  static clearActivation(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.ACTIVATION_TIME_KEY);
  }
}
