import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  username: string = '';
  email: string = '';
  newUsername: string = '';
  newEmail: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private http: HttpClient, private authService: AuthService, private userService: UserService) {}

    ngOnInit(): void {
      const email = localStorage.getItem('userEmail');
      if (email) {
        this.http.get(`http://localhost:3000/api/user/${email}`).subscribe({
          next: (response: any) => {
            console.log(response); // Verifique a resposta no console
    
            this.username = response.username;  // Nome de usuário
            this.email = response.email;        // Email vindo do backend
            this.newUsername = response.username; // Preenche automaticamente o campo de nome
            this.newEmail = response.email;     // Preenche automaticamente o campo de email
          },
          error: (err) => alert('Erro ao buscar dados do usuário: ' + err.message)
        });
      }
    }
    
    

    saveChanges() {
      if (this.newUsername.trim() === '' || this.newEmail.trim() === '') {
          alert('Nome de usuário e e-mail não podem estar vazios!');
          return;
      }
  
      if (this.newPassword !== this.confirmPassword) {
          alert('As senhas não coincidem!');
          return;
      }
  
      // Verifica os dados antes de enviar
      console.log({
          username: this.newUsername,
          email: this.newEmail,
          password: this.newPassword
      });
  
      const updatedUserData = {
          username: this.newUsername,
          email: this.newEmail,
          password: this.newPassword // Envia a nova senha, caso tenha sido alterada
      };
  
      const email = localStorage.getItem('userEmail');
      if (email) {
          this.userService.updateUserData(email, updatedUserData).subscribe({
              next: (response: any) => {
                  alert('Alterações salvas com sucesso!');
                  this.username = this.newUsername;
                  this.email = this.newEmail;
                  if (this.newEmail !== email) {
                      localStorage.setItem('userEmail', this.newEmail);
                  }
              },
              error: (err) => {
                  console.error('Erro ao salvar alterações:', err);
                  alert('Erro ao salvar alterações: ' + err.message);
              }
          });
      }
  }
  
    
    
}
