import { useCallback, useEffect, useState } from 'react';

// Define the available sound effects
type SoundEffect = 'move' | 'capture' | 'check' | 'castle' | 'error' | 'success';

// Create audio elements for each sound effect
const createAudioElements = () => {
  const audioElements: Record<SoundEffect, HTMLAudioElement> = {
    move: new Audio(),
    capture: new Audio(),
    check: new Audio(),
    castle: new Audio(),
    error: new Audio(),
    success: new Audio()
  };

  // Set the sources for each audio element using base64 encoded data
  // These are small, simple sounds to avoid needing external files
  audioElements.move.src = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAABIAEAAQABQAFAAYABwAHAAcACAAJAAkACQAJAAoACgALAAsADAAMAA0ADQANAA0ADgAOAA8ADwAQABAAEQARABEAEQASABIAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAANQAbGeAAAABBYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIg=";
  
  audioElements.capture.src = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAgAAACcAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/+MYxAANcAbGeAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTE/+MYxCkNMAa+eAAAAMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTE/+MYxDYAAANIAAAAADExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTE=";
  
  audioElements.check.src = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAABAAEAAYABwAHAAcACAAJAAkACQAKAAoACgAKAAoACwALAAwADAAMAAwADAANAA0ADgAOAA4ADgAOAA8ADwAQABAAEQARABIAEgAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAANwAbGeAAAABBISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEiEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhIg=";
  
  audioElements.castle.src = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAgAAACwAZABkAGQAZABkAGQAZABkAGQAZABkAGQApKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpA/+MYxAANMAbGeAAAACkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSk3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3/+MYxCIL6Ba+UMAAADc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3NQ==";
  
  audioElements.error.src = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAgAAAFkAvAC8ALwAvAC8ALwAvAC8ALwAvAC8ALwAvADa2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra/+MYxAANIAbGeAAAANra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tqAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/+MYxCEMCAa2eAAAAICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA/+MYxCgAAANIAAAAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA=";
    
  audioElements.success.src = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAgAAADQAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkADMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzA/+MYxAANMAbGeAAAADMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzPMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM/+MYxCML+BbGUAAAAMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM/+MYxDQAAANIAAAAAMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM";

  // Set volume levels
  audioElements.move.volume = 0.3;
  audioElements.capture.volume = 0.4;
  audioElements.check.volume = 0.5;
  audioElements.castle.volume = 0.4;
  audioElements.error.volume = 0.4;
  audioElements.success.volume = 0.5;
  
  return audioElements;
};

/**
 * Custom hook for managing chess sound effects
 */
export function useChessAudio() {
  const [audioElements, setAudioElements] = useState<Record<SoundEffect, HTMLAudioElement> | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize audio elements on component mount
  useEffect(() => {
    // Only create audio elements in browser environment
    if (typeof window !== 'undefined') {
      setAudioElements(createAudioElements());
    }
    
    return () => {
      // Clean up audio elements on unmount
      if (audioElements) {
        Object.values(audioElements).forEach(audio => {
          audio.pause();
          audio.src = '';
        });
      }
    };
  }, []);

  // Function to play a sound effect
  const playSound = useCallback((effect: SoundEffect) => {
    if (audioElements && !isMuted) {
      // Stop any currently playing sounds
      Object.values(audioElements).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      
      // Play the requested sound
      audioElements[effect].currentTime = 0;
      audioElements[effect].play().catch(error => {
        console.error('Error playing sound:', error);
        // Most likely due to user interaction policy in browsers
      });
    }
  }, [audioElements, isMuted]);

  // Toggle mute state
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return {
    playSound,
    isMuted,
    toggleMute
  };
}