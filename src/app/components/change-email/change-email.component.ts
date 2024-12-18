import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css'],
})

export class ChangeEmailComponent {
  newEmail: string = '';
  password: string = '';
  // PARA EXIBIR POSSÍVEIS ERROS DE VALIDAÇÃO
  emailError: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  onSubmit() {
    // LIMPA ERRO ANTERIOR
    this.emailError = '';

    // VERIFICA SE OS CAMPOS FORAM PREENCHIDOS
    if (!this.newEmail || !this.password) {
      this.emailError = 'Por favor, preencha todos os campos.';
      return;
    }

    // ENVIA A SOLICITAÇÃO PARA FAZER A ALTERAÇÃO DO EMAIL
    this.authService.changeEmail(this.newEmail, this.password).subscribe((response) => {
        alert('Email alterado com sucesso!');

        // FAZ O LOGOUT
        this.authService.logout();
        // APÓS O LOGOUT, REDIRECIONA O USUÁRIO PARA A PÁGINA DE LOGIN
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Erro ao atualizar email:', error);
        this.emailError = 'Erro ao atualizar o email. Verifique a senha e tente novamente.';
      }
    );
  }
}
