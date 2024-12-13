import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.newPassword !== this.confirmNewPassword) {
      alert('A nova senha e a confirmação não coincidem!');
      return;
    }

    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe(
      (response) => {
        alert('Senha alterada com sucesso! Faça login novamente.');
        this.authService.logout(); // Desloga o usuário
        this.router.navigate(['/login']); // Redireciona para a página de login
      },
      (error) => {
        alert('Erro ao alterar a senha. Verifique os dados e tente novamente.');
      }
    );
  }
}
