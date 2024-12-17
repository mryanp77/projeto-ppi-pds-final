import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private apiUrl = 'http://localhost:3000/api'; // Altere para a URL correta do seu backend
  private userId: number | null = null; // Pode ser null ou um número

  constructor(private http: HttpClient) {
    // Tente recuperar o userId do localStorage quando o serviço for inicializado
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
    }
  }

  getUserId(): number | null {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      return parseInt(storedUserId, 10);
    }
    return null;
  }

  // Método para armazenar o userId no localStorage
  setUserId(userId: number): void {
    this.userId = userId;
    localStorage.setItem('userId', userId.toString()); // Salva no localStorage
  }

  // Verifica o status de login
  private checkLoginStatus(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // Observable para monitorar o estado de login
  isLoggedIn$ = this.loggedIn.asObservable();

  login(email: string) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);  // Armazena o email do usuário
    // Não há necessidade de userId aqui, já que estamos usando o email
    this.loggedIn.next(true);
  }
  

  // Faz o logout e remove as informações armazenadas
  logout() {
    // Remove informações do usuário armazenadas localmente
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId'); // Remover também o userId
    
    // Atualiza o BehaviorSubject
    this.loggedIn.next(false);
  }

  // Recupera os detalhes do usuário baseado no email armazenado
  getUserDetails(): Observable<any> {
    const email = localStorage.getItem('userEmail');
    if (email) {
      return this.http.get<any>(`${this.apiUrl}/user/${email}`);
    } else {
      throw new Error('Usuário não encontrado.');
    }
  }

  // Método para alterar o nome de usuário no banco de dados após verificar a senha
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

  // Método para alterar o email do usuário no banco de dados após verificar a senha
  changeEmail(newEmail: string, password: string): Observable<any> {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      const userData = {
        email: userEmail,
        password: password,
        newEmail: newEmail,
      };
      return this.http.post(`${this.apiUrl}/change-email`, userData);
    } else {
      throw new Error('Usuário não encontrado.');
    }
  }

  // Método para alterar a senha do usuário
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const email = localStorage.getItem('userEmail'); // Obtem o email do usuário logado
    if (!email) {
      throw new Error('Usuário não autenticado.');
    }

    return this.http.put(`${this.apiUrl}/change-password`, {
      email,
      currentPassword,
      newPassword,
    });
  }

  // Método para obter as listas do usuário
  getUserLists(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lists/user/${userId}`); // Substitua pelo endpoint correto
  }

  createList(listName: string): Observable<any> {
    const userId = this.getUserId(); // Obtém o user_id do usuário logado
    if (!userId) {
      throw new Error('Usuário não autenticado.');
    }
  
    const listData = {
      name: listName,
      user_id: userId, // Adiciona o user_id ao corpo da requisição
    };
  
    return this.http.post(`${this.apiUrl}/lists`, listData);
  }

  getUserDetailsByEmail(email: string) {
    return this.http.get(`http://localhost:3000/api/user-details?email=${email}`);
  }
  
  getUserIdByEmail(email: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/user-id?email=${email}`);
  }
}
