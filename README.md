# Efact prueba tecnica

Esta aplicación es una prueba técnica desarrollada en *Angular* que aplica lo requerido en el documento recepcionado para la convocatoria que consiste en la visualización de Facturas/Boletas de EFACT.

La aplicación permite visualizar:
- El PDF del comprobante.
- El XML firmado.
- La Constancia de Recepción (CDR).

## Características Principales

* **Autenticación OAuth2**: Login seguro contra la API de EFACT (`odin-dev.efact.pe`) obteniendo un token de acceso.
* **Proxy Inverso**: Configuración de proxy para evitar problemas de CORS durante el desarrollo local.
* **Dashboard Interactivo**: Interfaz con pestañas (Tabs) para navegar entre los diferentes formatos del documento.
* **Visualización de Archivos**:
    * Renderizado de PDF en un `iframe`.
    * Visualización de código XML y CDR en bloques de texto formateados.
* **Angular Material**: Interfaz de usuario moderna y responsiva.

## Tecnologías Utilizadas

* **Framework**: Angular 19+
* **UI**: Angular Material (Toolbar, Card, Tabs, Inputs, Buttons)
* **Estilos**: SCSS y CSS estándar.
* **HTTP**: `HttpClient` con interceptores y manejo de `Blobs` para archivos.

## Pre-requisitos
Node.js (https://nodejs.org/)
Angular CLI (https://github.com/angular/angular-cli)

## Ejecución en Desarrollo

ng serve --proxy-config proxy.conf.json