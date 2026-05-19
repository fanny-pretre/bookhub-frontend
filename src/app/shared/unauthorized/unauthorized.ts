import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  imports: [],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css',
})
export class Unauthorized {
    message = '';

  ngOnInit() {
    this.message =
      sessionStorage.getItem('error_message')
      || 'Accès non autorisé';
  }
}
