import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  username: string = '';
  email: string = '';
  newUsername: string = '';
  newEmail: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.http.get(`http://localhost:3000/api/user/${email}`).subscribe({
        next: (response: any) => {
          console.log(response); // Verifique a resposta no console

          this.username = response.username; // Nome de usuário
          this.email = response.email; // Email vindo do backend
          this.newUsername = response.username; // Preenche automaticamente o campo de nome
          this.newEmail = response.email; // Preenche automaticamente o campo de email
        },
        error: (err) =>
          alert('Erro ao buscar dados do usuário: ' + err.message),
      });
    }
  }

  saveChanges() {
    // Validações básicas
    if (!this.newUsername.trim() || !this.newEmail.trim()) {
      alert('Nome de usuário e e-mail são obrigatórios!');
      return;
    }

    // Validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newEmail)) {
      alert('Por favor, insira um e-mail válido!');
      return;
    }

    // Validações de senha (apenas se algum dos campos de senha for preenchido)
    if (this.newPassword.trim() || this.confirmPassword.trim()) {
      if (this.newPassword !== this.confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }
    }

    // Prepara os dados para envio
    const updatedUserData: any = {
      username: this.newUsername,
      email: this.newEmail,
    };

    // Adiciona a senha ao objeto apenas se preenchida
    if (this.newPassword.trim()) {
      updatedUserData.password = this.newPassword;
    }

    // Obtém o e-mail atual do armazenamento local
    const currentEmail = localStorage.getItem('userEmail');
    if (!currentEmail) {
      alert('Erro: E-mail do usuário não encontrado no armazenamento local!');
      return;
    }

    // Verifica os dados antes de enviar
    console.log('Dados enviados para atualização:', updatedUserData);

    // Envia a atualização para o backend
    this.userService.updateUserData(currentEmail, updatedUserData).subscribe({
      next: (response: any) => {
        alert('Alterações salvas com sucesso!');
        this.username = this.newUsername;
        this.email = this.newEmail;

        // Atualiza o e-mail no localStorage, se alterado
        if (this.newEmail !== currentEmail) {
          localStorage.setItem('userEmail', this.newEmail);
          console.log('E-mail atualizado no localStorage.');
        }
      },
      error: (err) => {
        console.error('Erro ao salvar alterações:', err);
        alert(
          'Erro ao salvar alterações: ' + (err.message || 'Erro desconhecido.')
        );
      },
    });
  }
}
