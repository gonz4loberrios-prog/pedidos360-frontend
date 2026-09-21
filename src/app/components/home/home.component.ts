import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 40px; font-family: sans-serif;">
      <h1>Sistema Pedidos360 - Cloud Native</h1>
      <p>Inicia sesión con tu cuenta de Azure AD (Entra ID) para acceder al módulo de pedidos.</p>

      <div *ngIf="!isLoggedIn()">
        <button (click)="login()">Iniciar Sesión con Azure AD</button>
      </div>

      <div *ngIf="isLoggedIn()">
        <p>Usuario: <strong>{{ username }}</strong></p>
        <button (click)="irAPedidos()">Ir a Pedidos</button>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  username = '';

  constructor(
    private authService: MsalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.instance.handleRedirectPromise().then((response) => {
      if (response) {
        this.authService.instance.setActiveAccount(response.account);
      }
      this.checkAccount();
    });
  }

  private checkAccount(): void {
    const activeAccount = this.authService.instance.getActiveAccount();
    if (activeAccount) {
      this.username = activeAccount.username;
    }
  }

  isLoggedIn(): boolean {
    return this.authService.instance.getActiveAccount() !== null;
  }

  login(): void {
    this.authService.loginRedirect();
  }

  irAPedidos(): void {
    this.router.navigate(['/pedidos']);
  }
}