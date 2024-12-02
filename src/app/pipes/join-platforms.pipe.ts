import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinPlatforms'
})
export class JoinPlatformsPipe implements PipeTransform {
  transform(value: any[]): string {
    if (!value) return '';
    return value.map((platform: any) => platform.platform.name).join(', ');
  }
}
