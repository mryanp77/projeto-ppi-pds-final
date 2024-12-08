import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    const user = { username: this.username, email: this.email, password: this.password };
    this.http.post('http://localhost:3000/api/register', user).subscribe({
      next: () => {
        alert('Usuário registrado com sucesso!');
        this.router.navigate(['/login']); // Redireciona para a página de login
      },
      error: (err) => alert('Erro ao registrar usuário: ' + err.message)
    });
  }
}
