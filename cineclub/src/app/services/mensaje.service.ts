import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  urlBasic: string;

  constructor(private httpClient: HttpClient) {
    this.urlBasic = 'https://cineclub-back.herokuapp.com';
  }

  create(formValue) {
    return firstValueFrom(
      this.httpClient.post<any>(`${this.urlBasic}/api/mensajes/create`, formValue)
    );
  }

  //recuperar los mensajes recibidos de un determinado usuario. El id lo tomará en el back con el token
  getRecibidosByUserId() {
    return firstValueFrom(
      this.httpClient.get<any>(`${this.urlBasic}/api/mensajes/recibidos`)
    );
  }

  //recuperar los mensajes enviados de un determinado usuario. El id lo tomará en el back con el token
  getEmitidosByUserId() {
    return firstValueFrom(
      this.httpClient.get<any>(`${this.urlBasic}/api/mensajes/emitidos`)
    );
  }

  deleteById(mensajeId) {
    return firstValueFrom(
      this.httpClient.delete<any>(`${this.urlBasic}/api/mensajes/${mensajeId}`)
    );
  }


}
