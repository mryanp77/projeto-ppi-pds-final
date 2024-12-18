import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { YoutubeService } from '../../services/youtube.service';
import { HttpClient } from '@angular/common/http';

interface Developer {
  name: string;
}

interface Publisher {
  name: string;
}

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css'],
})
export class GameDetailsComponent implements OnInit {
  game: any;
  isLoading = true;
  mostrarTrailer = false;
  trailerUrl: string | null = null;
  comentarios: any[] = [];
  novoComentario = {
    title: '',
    comment: '',
    rating: 1,
  };
  userEmail: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private youtubeService: YoutubeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail')?.trim();
    this.route.params.subscribe((params) => {
      const gameId = params['id'];
      if (gameId) {
        this.carregarDetalhesDoJogo(gameId);
        this.carregarComentarios(gameId);
      }
    });
  }


  carregarDetalhesDoJogo(gameId: string): void {
    this.isLoading = true;
    this.gameService.getGameDetails(gameId).subscribe({
      next: (data) => {
        console.log(data);
        this.game = data;
        this.isLoading = false;
        this.buscarTrailer();
      },
      error: (error) => {
        console.error('Erro ao carregar os detalhes do jogo: ', error);
        this.isLoading = false;
      },
    });
  }

  abrirTrailer(): void {
    this.mostrarTrailer = true;
  }

  fecharTrailer(): void {
    this.mostrarTrailer = false;
  }

  buscarTrailer(): void {
    if (this.game?.name) {
      const gameName = this.game.name + ' trailer';
      this.youtubeService.getTrailer(gameName).subscribe({
        next: (response: any) => {
          const video = response.items[0];
          this.trailerUrl = `https://www.youtube.com/embed/${video.id.videoId}`;
        },
        error: (error) => {
          console.error('Erro ao buscar o trailer no YouTube: ', error);
          this.trailerUrl = null;
        },
      });
    }
  }

  formatarData(data: string): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', options);
  }

  getFormattedDevelopers(): string {
    return (
      this.game?.developers?.map((dev: Developer) => dev.name).join(', ') ||
      'Informação não disponível'
    );
  }

  getFormattedPublishers(): string {
    return (
      this.game?.publishers?.map((pub: Publisher) => pub.name).join(', ') ||
      'Informação não disponível'
    );
  }

  carregarComentarios(gameId: string): void {
    this.http.get(`http://localhost:3000/api/comments/${gameId}`).subscribe({
      next: (data: any) => {
        this.comentarios = data;
      },
      error: (error) => {
        console.error('Erro ao carregar comentários:', error);
      },
    });
  }
  
  enviarComentario(): void {
    if (this.novoComentario.title && this.novoComentario.comment) {
      const payload = {
        game_id: this.game.id,
        user_email: localStorage.getItem('userEmail'),
        title: this.novoComentario.title,
        comment: this.novoComentario.comment,
        rating: this.novoComentario.rating,
      };
  
      this.http.post('http://localhost:3000/api/comments', payload).subscribe({
        next: () => {
          alert('Comentário enviado com sucesso!');
          this.novoComentario = { title: '', comment: '', rating: 1 };
          this.carregarComentarios(this.game.id);
        },
        error: (error) => {
          console.error('Erro ao enviar comentário:', error);
        },
      });
    } else {
      alert('Preencha todos os campos antes de enviar!');
    }
  }
}
