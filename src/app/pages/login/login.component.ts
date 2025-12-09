import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Prueba Técnica EFACT</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onLogin()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Usuario</mat-label>
              <input matInput [(ngModel)]="username" name="username">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput type="password" [(ngModel)]="password" name="password">
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="loading">
              {{ loading ? 'Ingresando...' : 'Ingresar' }}
            </button>
            <p class="error" *ngIf="error">{{ error }}</p>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5; }
    mat-card { width: 400px; padding: 20px; }
    .full-width { width: 100%; margin-bottom: 15px; }
    button { width: 100%; }
    .error { color: red; margin-top: 10px; text-align: center;}
  `]
})
export class LoginComponent {
  private api = inject(ApiService);
  private router = inject(Router);
  username = '20111193035';
  password = '61a77b6fda77c3a2d6b28930546c86d7f749ccf0bd4bad1e1192f13bb59f0f30';
  loading = false;
  error = '';
  onLogin() {
    this.loading = true;
    this.api.login(this.username, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = 'Credenciales incorrectas o error de servidor';
        this.loading = false;
        console.error(err);
      }
    });
  }
}