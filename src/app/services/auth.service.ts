import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private apiUrl = `http://localhost:3000/api`;  // Altere para a URL correta do seu backend

  constructor(private http: HttpClient) {}

  // Verifica o status de login
  private checkLoginStatus(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // Observable para monitorar o estado de login
  isLoggedIn$ = this.loggedIn.asObservable();

  // Faz o login e armazena o status de login e o email do usuário
  login(email: string) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email); // Armazena o email do usuário logado
    this.loggedIn.next(true);
  }

  // Faz o logout e remove as informações armazenadas
  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    this.loggedIn.next(false);
  }

  // Recupera os detalhes do usuário baseado no email armazenado
  getUserDetails(): Observable<any> {
    const email = localStorage.getItem('userEmail');
    if (email) {
      return this.http.get(`${this.apiUrl}/user/${email}`);
    } else {
      throw new Error('Usuário não encontrado.');
    }
  }

  // Altera o nome de usuário no banco de dados após verificar a senha
  changeUsername(newUsername: string, password: string): Observable<any> {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      const userData = {
        email: userEmail,
        password: password,
        newUsername: newUsername,
      };
      return this.http.post(`${this.apiUrl}/change-username`, userData);
    } else {
      throw new Error('Usuário não encontrado.');
    }
  }
}
