import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservableUserService {

  private token: string;
  private token$: Subject<string>;

  constructor() {
    this.token = '';
    this.token$ = new Subject();
  }

  recoverToken(pToken: string) {
    this.token = pToken;
    this.token$.next(this.token);
  }

  setToken(pToken: string) {
    localStorage.setItem("token", pToken);
    this.token = pToken;
    this.token$.next(this.token);
  }

  getToken$(): Observable<string> {
    return this.token$.asObservable();
  }

  isLogged(): boolean {
    return localStorage.getItem('token') ? true : false;
  }

}
