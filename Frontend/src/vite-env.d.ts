// src/types/speech.d.ts or vite-env.d.ts
/// <reference types="vite/client" />

export {};

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add more if needed...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


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

interface ImportMetaEnv {
  VITE_API_URL: string; // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
