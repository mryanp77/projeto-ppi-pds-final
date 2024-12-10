import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

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

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.http.get(`http://localhost:3000/api/user/${email}`).subscribe({
        next: (response: any) => {
          this.username = response.username;
        },
        error: (err) => alert('Erro ao buscar o nome do usuário: ' + err.message)
      });
    }
  }

  saveChanges() {
    // Aqui você pode adicionar a lógica para salvar as alterações, como atualizar o nome de usuário, email e senha
    alert('Alterações salvas!');
  }
}
