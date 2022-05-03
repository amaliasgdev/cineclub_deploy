import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    urlBasic: string;

    constructor(private httpClient: HttpClient) {
        this.urlBasic = 'https://cineclub-back.herokuapp.com';
    }


    getAll() {
        return firstValueFrom(
            this.httpClient.get<any[]>(`${this.urlBasic}/api/usuarios/`)
        );
    }

    //para sacar informacion de otros usuarios
    getUserById(pUserId: number) {
        return firstValueFrom(
            this.httpClient.get<any>(`${this.urlBasic}/api/usuarios/info/${pUserId}`)
        );
    }

    getById() {
        return firstValueFrom(
            this.httpClient.get<any>(`${this.urlBasic}/api/usuarios/profile`)
        );
    }

    //devuelve el usuario
    getByToken(pToken: string) {
        const httpOptions = {
            headers: new HttpHeaders({
                'authentication': pToken
            })
        }
        return firstValueFrom(
            this.httpClient.get<any>(`${this.urlBasic}/api/usuarios/username`, httpOptions)
        );
    }


    create(formValue) {
        return firstValueFrom(
            this.httpClient.post<any>(`${this.urlBasic}/api/usuarios/registro`, formValue)
        );
    }

    login(formValue) {
        return firstValueFrom(
            this.httpClient.post<any>(`${this.urlBasic}/api/usuarios/login`, formValue)
        );
    }

    update(pUserId, formValue) {
        return firstValueFrom(
            this.httpClient.put<any>(`${this.urlBasic}/api/usuarios/${pUserId}`, formValue)
        );
    }

    updateRolById(pUserId, rol) {
        return firstValueFrom(
            this.httpClient.put<any>(`${this.urlBasic}/api/usuarios/rol/${pUserId}`, rol)
        );
    }

    isTokenExpired() {
        return firstValueFrom(
            this.httpClient.get<any>(`${this.urlBasic}/api/usuarios/isTokenExpired`)
        );
    }

    updateImagen(pUserId, formValue) {
        return firstValueFrom(
            this.httpClient.put<any>(`${this.urlBasic}/api/usuarios/imagen/${pUserId}`, formValue)
        );
    }

    deleteById(pUsuarioId) {
        return firstValueFrom(
            this.httpClient.delete<any>(`${this.urlBasic}/api/usuarios/${pUsuarioId}`)
        );
    }


}
