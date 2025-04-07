import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {
  private apiURL = 'http://localhost:3000/enviar-mensaje'; 

  constructor(private http: HttpClient) {}

  enviarMensaje(numero: string, mensaje: string) {
    return this.http.post(this.apiURL, { numero, mensaje });
  }
}
