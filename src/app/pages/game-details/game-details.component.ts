import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { YoutubeService } from '../../services/youtube.service';

interface Developer {
  name: string;
}

interface Publisher {
  name: string;
}

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {
  game: any;
  isLoading = true;
  mostrarTrailer = false;
  trailerUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private youtubeService: YoutubeService // Adicionando o serviço do YouTube
  ) {}

  ngOnInit(): void {
    const gameId = this.route.snapshot.paramMap.get('id');
    if (gameId) {
      this.gameService.getGameDetails(gameId).subscribe({
        next: (data) => {
          console.log(data);
          this.game = data;
          this.isLoading = false;
          this.buscarTrailer(); // Busca o trailer automaticamente
        },
        error: (error) => {
          console.error('Erro ao carregar os detalhes do jogo: ', error);
          this.isLoading = false;
        },
      });
    }
  }

  abrirTrailer(): void {
    this.mostrarTrailer = true;
  }

  fecharTrailer(): void {
    this.mostrarTrailer = false;
  }

  // Método para buscar o trailer no YouTube
  buscarTrailer(): void {
    if (this.game?.name) {
      const gameName = this.game.name + ' trailer';
      this.youtubeService.getTrailer(gameName).subscribe({
        next: (response: any) => {
          const video = response.items[0]; // Pega o primeiro vídeo retornado
          this.trailerUrl = `https://www.youtube.com/embed/${video.id.videoId}`;
        },
        error: (error) => {
          console.error('Erro ao buscar o trailer no YouTube: ', error);
          this.trailerUrl = null; // Não disponível
        },
      });
    }
  }

  formatarData(data: string): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', options);
  }

  getFormattedDevelopers(): string {
    return this.game?.developers?.map((dev: Developer) => dev.name).join(', ') || 'Informação não disponível';
  }

  getFormattedPublishers(): string {
    return this.game?.publishers?.map((pub: Publisher) => pub.name).join(', ') || 'Informação não disponível';
  }
}
