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
  errorMessage: string = '';
  passwordVisible: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Todos os campos são obrigatórios!'; // Define a mensagem de erro
      return;
    }

    const user = { username: this.username, email: this.email, password: this.password };

    this.http.post('http://localhost:3000/api/register', user).subscribe({
      next: () => {
        alert('Usuário registrado com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err) => alert('Erro ao registrar usuário: ' + err.message)
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
