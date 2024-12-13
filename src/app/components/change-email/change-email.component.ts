import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css']
})
export class ChangeEmailComponent {
  newEmail: string = '';
  password: string = '';
  emailError: string = '';  // Para exibir erros de validação

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.emailError = ''; // Limpa erro anterior

    // Verifica se os campos estão preenchidos
    if (!this.newEmail || !this.password) {
      this.emailError = 'Por favor, preencha todos os campos.';
      return;
    }

    // Envia a solicitação para alterar o email
    this.authService.changeEmail(this.newEmail, this.password).subscribe(
      (response) => {
        // Exibe alerta de sucesso
        alert('Email alterado com sucesso!');
        
        // Realiza o logout
        this.authService.logout();

        // Agora redireciona para a página de login
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Erro ao atualizar email:', error);
        this.emailError = 'Erro ao atualizar o email. Verifique a senha e tente novamente.';
      }
    );
  }
}
