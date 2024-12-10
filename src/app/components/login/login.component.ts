import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  // login() {
  //   const credentials = { email: this.email, password: this.password };

  //   this.http.post('http://localhost:3000/api/login', credentials).subscribe({
  //     next: (response: any) => {
  //       alert('Login bem-sucedido!');
  //       this.authService.login(); // Atualiza o estado global de autenticação
  //       this.router.navigate(['/']); // Redireciona para a página inicial
  //     },
  //     error: (err) => alert('Erro ao fazer login: ' + err.message)
  //   });
  // }

  login() {
    const credentials = { email: this.email, password: this.password };
  
    this.http.post('http://localhost:3000/api/login', credentials).subscribe({
      next: (response: any) => {
        alert('Login bem-sucedido!');
        this.authService.login(this.email); // Passa o email para o serviço de autenticação
        this.router.navigate(['/']); // Redireciona para a página inicial
      },
      error: (err) => alert('Erro ao fazer login: ' + err.message)
    });
  }
  
}
