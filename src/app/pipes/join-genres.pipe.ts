import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinGenres'
})
export class JoinGenresPipe implements PipeTransform {
  transform(value: any[]): string {
    if (!value) return '';
    return value.map((genre: any) => genre.name).join(', ');
  }
}
