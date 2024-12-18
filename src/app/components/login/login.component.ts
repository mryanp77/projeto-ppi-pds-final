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
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos!'; 
      return;
    }
    
    const credentials = { email: this.email, password: this.password };
  
    this.http.post('http://localhost:3000/api/login', credentials).subscribe({
      next: (response: any) => {
        console.log('Resposta da API:', response);
  
        if (response && response.user) {
          const userEmail = response.user.email; 
          this.authService.login(userEmail); 
          this.router.navigate(['/']); 
        } else {
          alert('Erro: Dados do usuário não encontrados na resposta da API.');
        }
      },
      error: (err) => alert('Erro ao fazer login: ' + err.message)
    });
  }
}
