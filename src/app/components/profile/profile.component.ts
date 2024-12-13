import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string = '';
  email: string = '';
  createdAt: string = '';
  lastLogin: string = '';

  constructor(private authService: AuthService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.authService.getUserDetails().subscribe(
      (data: any) => {
        this.username = data.username;
        this.email = data.email;
        this.createdAt = this.datePipe.transform(data.created_at, 'dd/MM/yyyy HH:mm') || '';
        this.lastLogin = this.datePipe.transform(data.last_login, 'dd/MM/yyyy HH:mm') || '';
      },
      (error) => {
        console.error('Erro ao carregar os dados do usuário:', error);
      }
    );
  }
}
