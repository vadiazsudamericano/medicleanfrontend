// RUTA: src/app/detalle-herramienta/detalle-herramienta.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HerramientaService, HerramientaBackend } from '../servicios/herramienta.service';
import { RegistroService, Registro } from '../servicios/registro.service';

@Component({
  selector: 'app-detalle-herramienta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-herramienta.html',
  styleUrls: ['./detalle-herramienta.css']
})
export class DetalleHerramientaComponent implements OnInit {

  herramienta: HerramientaBackend | undefined;
  historial: Registro[] = [];
  cargandoHistorial = true;

  constructor(
    private route: ActivatedRoute,
    private herramientaService: HerramientaService,
    private registroService: RegistroService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const nombreHerramienta = params.get('nombre');
      
      if (nombreHerramienta) {
        this.herramientaService.getHerramientaPorNombre(nombreHerramienta)
          .subscribe(datosDeLaHerramienta => {
            this.herramienta = datosDeLaHerramienta;
            
            if (this.herramienta && this.herramienta.id) {
              this.cargarHistorial(this.herramienta.id);
            } else {
              this.cargandoHistorial = false; // No hay herramienta, no hay historial que cargar
            }
          });
      }
    });
  }

  cargarHistorial(herramientaId: number): void {
    this.cargandoHistorial = true;
    this.registroService.getRegistrosPorHerramienta(herramientaId)
      .subscribe(registros => {
        this.historial = registros;
        this.cargandoHistorial = false;
      });
  }
}