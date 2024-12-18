import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ListService } from '../../services/list.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  username: string = '';
  email: string = '';
  createdAt: string = '';
  lastLogin: string = '';
  userLists: any[] = []; 
  userEmail: string | null = null; 
  profile_image: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private authService: AuthService,
    private datePipe: DatePipe,
    private http: HttpClient,
    private listService: ListService
  ) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail');

    if (this.userEmail) {
      this.http
        .get(`http://localhost:3000/api/user/${this.userEmail}`)
        .subscribe(
          (data: any) => {
            this.username = data.username;
            this.email = data.email;
            this.createdAt = this.datePipe.transform(
              data.createdAt,
              'shortDate'
            )!;
            this.lastLogin = this.datePipe.transform(
              data.lastLogin,
              'shortDate'
            )!;
        const storedProfileImage = localStorage.getItem('profile_image');
        if (storedProfileImage) {
          this.profile_image = storedProfileImage;
        } else if (data.profile_image) {
          this.profile_image = `http://localhost:3000/uploads/${data.profile_image}`;
          localStorage.setItem('profile_image', this.profile_image);
        } else {
          this.profile_image = 'https://via.placeholder.com/150';
        }
          },
          (error) => {
            console.error('Erro ao carregar os dados do usuário:', error);
          }
        );

      this.getUserLists();
    } else {
      console.error('Email do usuário não encontrado!');
    }
  }

  getUserLists(): void {
    if (this.userEmail) {
      this.listService.getListsByUserEmail(this.userEmail!).subscribe(
        (lists) => {
          this.userLists = lists;
        },
        (error) => {
          console.error('Erro ao buscar listas:', error);
        }
      );
    }
  }

  onFileChange(event: any): void {
    const formData = new FormData();
    const file = event.target.files[0];

    if (file) {
      formData.append('profile_image', file);
      formData.append('email', this.userEmail!); // Adicionando o email

      this.http
        .post('http://localhost:3000/api/upload-profile-image', formData).subscribe(
          (response: any) => {
            const profileImageUrl = `http://localhost:3000/uploads/${response.profile_image}`;
            this.profile_image = profileImageUrl;
            localStorage.setItem('profile_image', profileImageUrl);
            console.log('Imagem de perfil atualizada com sucesso', response);
          },
          (error) => {
            console.error('Erro ao enviar a foto de perfil:', error);
          }
        );
    }
  }
}
