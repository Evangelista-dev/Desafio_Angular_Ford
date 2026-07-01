import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  // URL corrigida para a porta 3001 e rota exata do teu api.js
  private readonly apiUrl = 'http://localhost:3001/login'; 
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const session = localStorage.getItem('ford_user_session');
      if (session) {
        this.isAuthenticatedSubject.next(true);
      }
    }
  }

  public get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  login(nome: string, senha: string): Observable<boolean> {
    // Fazendo um POST enviando nome e senha conforme o req.body da tua API
    return this.http.post<any>(this.apiUrl, { nome, senha }).pipe(
      map(response => {
        // Se a API retornar 200, significa que o login foi bem sucedido
        if (response && response.nome) {
          this.saveSession(response.nome);
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Erro de autenticação:', error);
        return of(false); // Retorna falso se der erro 401 ou 400
      })
    );
  }

  private saveSession(username: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('ford_user_session', JSON.stringify({ nome: username, loginTime: new Date() }));
    }
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('ford_user_session');
    }
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}