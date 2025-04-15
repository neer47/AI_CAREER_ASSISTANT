/// <reference types="vite/client" />

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

interface ImportMetaEnv {
  VITE_API_URL: string; // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}