import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable()
export class ValidTokenInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token = localStorage.getItem('token');

    //Si no hay token sigue su camino porque no puede incluirlo en las cabeceras
    if (!token) {
      return next.handle(req);
    }

    const url = req.url;

    //Si la Url de destino es la API externa que siga su camino y no le añadimos las cabeceras con el Token 
    if (url.includes('themoviedb.org')) {
      // console.log('LO COJO', req.url)
      return next.handle(req);
    }



    //Si hay token incluye las cabeceras en la petición
    const headers = req.clone({
      setHeaders: {
        'authentication': `${token}`
      }
    });

    //console.log('REQ. CON CABECERA: ', headers)

    return next.handle(headers);

    //return next.handle(req);
  }



}