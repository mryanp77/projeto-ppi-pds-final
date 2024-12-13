import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Certifique-se de que o serviço de autenticação esteja correto

@Component({
  selector: 'app-change-username',
  templateUrl: './change-username.component.html',
  styleUrls: ['./change-username.component.css']
})
export class ChangeUsernameComponent {
  newUsername: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.changeUsername(this.newUsername, this.password).subscribe(
      (response) => {
        alert('Nome de usuário alterado com sucesso!');
        this.router.navigate(['/profile']); // Redireciona para o perfil após alteração
      },
      (error) => {
        alert('Erro ao alterar nome de usuário. Verifique a senha e tente novamente.');
        console.error(error);
      }
    );
  }
}
