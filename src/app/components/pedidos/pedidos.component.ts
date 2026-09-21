import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../../environments/environment';

interface TokenClaims {
  [key: string]: any;
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 40px; font-family: sans-serif;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="margin: 0;">Órdenes de Trabajo</h2>
        <button (click)="logout()" class="secondary">Cerrar Sesión</button>
      </div>

      <p>Usuario autenticado: <strong>{{ username }}</strong></p>

      <h3>Claims del Token</h3>
      <table style="border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 6px 12px; font-weight: bold;">Roles</td>
          <td style="padding: 6px 12px;">{{ (roles.length ? roles.join(', ') : '(sin roles asignados)') }}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px; font-weight: bold;">Scopes</td>
          <td style="padding: 6px 12px;">{{ (scopes.length ? scopes.join(', ') : '(scopes no presentes en el token)') }}</td>
        </tr>
      </table>

      <button (click)="cargarPedidos()" style="margin-right: 10px;">Consumir API Pedidos</button>
      <span *ngIf="cargando">Cargando...</span>
      <span *ngIf="error" style="color: #c00;">{{ error }}</span>

      <h3>Pedidos:</h3>
      <ul *ngIf="pedidos.length">
        <li *ngFor="let p of pedidos">
          ID: {{ p.id }} - Cliente: {{ p.cliente }} - Monto: CLP {{ p.monto }} - Estado: {{ p.estado }}
        </li>
      </ul>
      <p *ngIf="!pedidos.length && !cargando">Presiona el botón para cargar los pedidos.</p>
    </div>
  `
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  username = '';
  roles: string[] = [];
  scopes: string[] = [];
  cargando = false;
  error = '';

  constructor(
    private authService: MsalService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const activeAccount = this.authService.instance.getActiveAccount();
    if (activeAccount) {
      this.username = activeAccount.username;
    }
    this.obtenerClaimsDelToken();
  }

  private obtenerClaimsDelToken(): void {
    const account = this.authService.instance.getActiveAccount();
    if (!account) {
      return;
    }

    this.authService.instance
      .acquireTokenSilent({ scopes: environment.azure.scopes, account })
      .then((response) => {
        const claims: TokenClaims = this.decodeJwt(response.accessToken);
        this.roles = claims['roles'] ?? [];
        this.scopes = (claims['scp'] ?? []).split(' ') as string[];
      })
      .catch((err) => {
        console.error('Error al obtener claims del token:', err);
        this.error = 'No fue posible leer los claims del token.';
      });
  }

  private decodeJwt(token: string): TokenClaims {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as TokenClaims;
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.error = '';
    this.http.get<any[]>(`${environment.apiGatewayUrl}/api/pedidos`).subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al consumir API:', err);
        this.cargando = false;
        this.error = err.status
          ? `Error ${err.status}: ${err.statusText}`
          : 'No fue posible conectar con el backend.';
      }
    });
  }

  logout(): void {
    this.authService.logoutRedirect();
  }
}