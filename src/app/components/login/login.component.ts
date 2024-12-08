import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  login() {
    const user = { email: this.email, password: this.password };
    this.http.post('http://localhost:3000/api/login', user).subscribe({
      next: () => alert('Login bem-sucedido!'),
      error: (err) => alert('Erro ao fazer login: ' + err.message),
    });
  }
}
