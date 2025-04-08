import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {
  private apiURL = 'https://backedn-twiilio.onrender.com/enviar-mensaje'; 

  constructor(private http: HttpClient) {}

  enviarMensaje(numero: string, mensaje: string) {
    return this.http.post(this.apiURL, { numero, mensaje }).pipe(
      tap(res => console.log('Respuesta del servidor:', res)),
      catchError(err => {
        console.error('Error al enviar mensaje', err);
        return throwError(err);
      })
    );
  }
  
}
