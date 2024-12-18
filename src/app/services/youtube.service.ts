import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private apiKey = 'AIzaSyAxH8l2aFmsFAULGK0dH7uotKlBMgIRDjg';
  private apiUrl = 'https://www.googleapis.com/youtube/v3/search';

  constructor(private http: HttpClient) {}

  getTrailer(gameName: string): Observable<any> {
    const query = `${gameName} trailer`;
    const url = `${this.apiUrl}?part=snippet&type=video&q=${encodeURIComponent(
      query
    )}&key=${this.apiKey}`;
    return this.http.get(url);
  }
}
