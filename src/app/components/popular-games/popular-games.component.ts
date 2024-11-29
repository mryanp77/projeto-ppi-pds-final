import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-popular-games',
  templateUrl: './popular-games.component.html',
  styleUrl: './popular-games.component.css'
})

export class PopularGamesComponent implements OnInit {
  popularGames: any[] = [];
  isLoading = true;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.getPopularGames().subscribe({
      next: (data) => {
        this.popularGames = data.results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar os jogos populares: ', error);
        this.isLoading = false;
      },
    });
  }
}