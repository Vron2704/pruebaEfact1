import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary">
      <span>Visor de Comprobantes EFACT</span>
      <span class="spacer"></span>
      <button mat-button (click)="logout()">Salir</button>
    </mat-toolbar>

    <div class="container">
      <div class="header-info">
        <h3>Ticket Activo: {{ ticketId }}</h3>
      </div>

      <mat-tab-group animationDuration="0ms" (selectedTabChange)="onTabChange($event)">
        <mat-tab label="PDF del Comprobante">
          <div class="viewer-box">
            <iframe *ngIf="pdfUrl" [src]="pdfUrl" width="100%" height="600px"></iframe>
            <div *ngIf="!pdfUrl" class="loading">Cargando PDF...</div>
          </div>
        </mat-tab>

        <mat-tab label="XML Firmado">
          <div class="viewer-box code-viewer">
            <pre>{{ xmlContent }}</pre>
            <div *ngIf="!xmlContent" class="loading">Cargando XML...</div>
          </div>
        </mat-tab>

        <mat-tab label="Constancia (CDR)">
          <div class="viewer-box code-viewer">
            <pre>{{ cdrContent }}</pre>
            <div *ngIf="!cdrContent" class="loading">Cargando CDR...</div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .container { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .viewer-box { border: 1px solid #ccc; height: 600px; background: white; overflow: auto; }
    .code-viewer { padding: 20px; background: #f5f5f5; color: #333; font-family: monospace; }
    .loading { padding: 20px; text-align: center; }
  `]
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);

  ticketId = this.api.ticket;
  pdfUrl: SafeResourceUrl | null = null;
  xmlContent: string = '';
  cdrContent: string = '';

  ngOnInit() {
    // Cargamos el PDF por defecto al entrar
    this.loadDocument('pdf');
  }

  onTabChange(event: any) {
    // Índices de las pestañas: 0=PDF, 1=XML, 2=CDR
    if (event.index === 0 && !this.pdfUrl) this.loadDocument('pdf');
    if (event.index === 1 && !this.xmlContent) this.loadDocument('xml');
    if (event.index === 2 && !this.cdrContent) this.loadDocument('cdr');
  }

  loadDocument(type: 'pdf' | 'xml' | 'cdr') {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return;
    }

    this.api.getDocument(type, token).subscribe({
      next: (blob) => {
        if (type === 'pdf') {
          // Crear una URL segura para el iframe
          const url = URL.createObjectURL(blob);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        } else {
          // Para XML y CDR, convertimos el Blob a texto para mostrarlo
          const reader = new FileReader();
          reader.onload = () => {
            if (type === 'xml') this.xmlContent = reader.result as string;
            if (type === 'cdr') this.cdrContent = reader.result as string;
          };
          reader.readAsText(blob);
        }
      },
      error: (err) => console.error('Error cargando documento', err)
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}