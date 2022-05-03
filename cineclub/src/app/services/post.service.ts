import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  urlBasic: string;

  constructor(private httpClient: HttpClient) {
    this.urlBasic = 'https://cineclub-back.herokuapp.com';
  }

  getByPubId(pPublicacionId) {
    return firstValueFrom(
      this.httpClient.get<any>(`${this.urlBasic}/api/posts/${pPublicacionId}`)
    );
  }

  getById(postId) {
    return firstValueFrom(
      this.httpClient.get<any>(`${this.urlBasic}/api/posts/id/${postId}`)
    );
  }

  getByUser(pUserId) {
    return firstValueFrom(
      this.httpClient.get<any>(`${this.urlBasic}/api/posts/byuser/${pUserId}`)
    );
  }

  create(pPost) {
    return firstValueFrom(
      this.httpClient.post<any>(`${this.urlBasic}/api/posts/create`, pPost)
    );
  }

  getByToken(pToken: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'authentication': pToken
      })
    }
    return firstValueFrom(
      this.httpClient.get<any>(`${this.urlBasic}/api/usuarios/posts`, httpOptions)
    );
  }

  update(pPostId, formValue) {
    return firstValueFrom(
      this.httpClient.put<any>(`${this.urlBasic}/api/posts/${pPostId}`, formValue)
    );
  }

  deleteById(mensajeId) {
    return firstValueFrom(
      this.httpClient.delete<any>(`${this.urlBasic}/api/posts/${mensajeId}`)
    );
  }


}
