// src/types/speech.d.ts or vite-env.d.ts

export {};

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }

  var webkitSpeechRecognition: any;
  var SpeechRecognition: any;

  type SpeechRecognitionEvent = Event & {
    results: SpeechRecognitionResultList;
  };
}
