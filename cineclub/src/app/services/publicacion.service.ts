import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Publicacion } from 'src/interfaces/publicacion.interface';


@Injectable({
    providedIn: 'root'
})
export class PublicacionService {

    urlBasic: string;

    constructor(private httpClient: HttpClient) {
        this.urlBasic = 'https://cineclub-back.herokuapp.com';
    }

    getAll() {
        return firstValueFrom(
            this.httpClient.get<any[]>(`${this.urlBasic}/api/publicaciones`));
    }

    getPeliculaId(publicacionId: number) {
        return firstValueFrom(
            this.httpClient.get<any>(`${this.urlBasic}/api/publicaciones/${publicacionId}`)
        )
    }

    create(publicacion: Publicacion) {
        return firstValueFrom(
            this.httpClient.post<any>(`${this.urlBasic}/api/publicaciones`, publicacion)
        )
    }

    getAllPaginated(page: number = 1) {
        return firstValueFrom(
            this.httpClient.get<any[]>(`${this.urlBasic}/api/publicaciones/order?page=${page}`
            ));
    }

    deleteById(pPublicacionId) {
        return firstValueFrom(
            this.httpClient.delete<any>(`${this.httpClient}/api/publicaciones/${pPublicacionId}`
            ));
    }

    getByTitle(pTitle) {
        return firstValueFrom(
            this.httpClient.get<any>(`${this.urlBasic}/api/publicaciones/search/${pTitle}`
            ));
    }

    getRating(publicacionId) {
        return firstValueFrom(
            this.httpClient.get<any>(`${this.urlBasic}/api/publicaciones/rating/${publicacionId}`)
        )
    }


}