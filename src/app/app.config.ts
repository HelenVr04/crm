import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '../environments/environment.development';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), {provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig}, 
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), provideFirestore(() => getFirestore())]
};
