import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  query: string = '';
  results: any[] = [];
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private gameService: GameService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query = params['query'] || '';
      if (this.query.trim()) {
        this.fetchSearchResults();
      }
    });
  }

  // Chama a API para buscar jogos
  fetchSearchResults(): void {
    this.loading = true;
    this.gameService.searchGames(this.query).subscribe(
      (response) => {
        this.results = response.results;
        this.loading = false;
      },
      (error) => {
        console.error('Erro ao buscar jogos:', error);
        this.loading = false;
      }
    );
  }
}
