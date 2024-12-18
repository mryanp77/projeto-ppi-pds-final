import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private apiUrl = 'http://localhost:3000/api';
  private userId: number | null = null;

  constructor(private http: HttpClient) {
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

  setUserId(userId: number): void {
    this.userId = userId;
    localStorage.setItem('userId', userId.toString());
  }

  private checkLoginStatus(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  isLoggedIn$ = this.loggedIn.asObservable();

  login(email: string) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    this.loggedIn.next(true);
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    this.loggedIn.next(false);
  }

  getUserDetails(): Observable<any> {
    const email = localStorage.getItem('userEmail');
    if (email) {
      return this.http.get<any>(`${this.apiUrl}/user/${email}`);
    } else {
      throw new Error('Usuário não encontrado.');
    }
  }

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

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      throw new Error('Usuário não autenticado.');
    }

    return this.http.put(`${this.apiUrl}/change-password`, {
      email,
      currentPassword,
      newPassword,
    });
  }

  getUserLists(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lists/user/${userId}`);
  }

  createList(listName: string): Observable<any> {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('Usuário não autenticado.');
    }
  
    const listData = {
      name: listName,
      user_id: userId,
    };
  
    return this.http.post(`${this.apiUrl}/lists`, listData);
  }
}
