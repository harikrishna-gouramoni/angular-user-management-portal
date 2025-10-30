import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'domain',
  standalone: true,
  pure: true
})
export class DomainPipe implements PipeTransform {
  transform(email: string | null | undefined): string {
    if (!email || !email.includes('@')) return '';
    return email.split('@')[1].toLowerCase();
  }
}
