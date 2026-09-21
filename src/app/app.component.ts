import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header style="background-color: #0072c6; color: #fff; padding: 12px 24px; font-family: sans-serif;">
      <strong>Pedidos360</strong>
    </header>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}