import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 30px; font-family: sans-serif;">
      <h1>Sistema Pedidos360 - Cloud Native</h1>
      
      <div *ngIf="!isLoggedIn()">
        <button (click)="login()" style="padding: 10px 20px; cursor: pointer;">Iniciar Sesión con Azure AD</button>
      </div>

      <div *ngIf="isLoggedIn()">
        <p>Usuario: <strong>{{ username }}</strong></p>
        <button (click)="logout()" style="padding: 8px 16px;">Cerrar Sesión</button>
        <button (click)="cargarPedidos()" style="padding: 8px 16px; margin-left: 10px;">Consumir API Pedidos</button>

        <h3 style="margin-top: 20px;">Pedidos:</h3>
        <ul>
          <li *ngFor="let p of pedidos">
            ID: {{ p.id }} - Cliente: {{ p.cliente }} - Monto: ${{ p.monto }}
          </li>
        </ul>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  pedidos: any[] = [];
  username: string = '';

  constructor(private authService: MsalService, private http: HttpClient) {}

  ngOnInit(): void {
    this.authService.instance.handleRedirectPromise().then(res => {
      if (res) {
        this.authService.instance.setActiveAccount(res.account);
      }
      this.checkAccount();
    });
  }

  checkAccount() {
    const activeAccount = this.authService.instance.getActiveAccount();
    if (activeAccount) {
      this.username = activeAccount.username;
    }
  }

  isLoggedIn(): boolean {
    return this.authService.instance.getActiveAccount() !== null;
  }

  login() {
    this.authService.loginRedirect();
  }

  logout() {
    this.authService.logoutRedirect();
  }

  cargarPedidos() {
    this.http.get<any[]>(`${environment.apiGatewayUrl}/api/pedidos`).subscribe({
      next: (data) => this.pedidos = data,
      error: (err) => console.error('Error al consumir API:', err)
    });
  }
}
