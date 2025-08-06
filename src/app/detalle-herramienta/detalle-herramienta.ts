import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-herramienta',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-herramienta.html',
  styleUrls: ['./detalle-herramienta.css']
})
export class DetalleHerramientaComponent implements OnInit {
  herramienta: any;
  id: number = 0;
  mensajeCarga: string = 'Cargando información...';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router // ✅ Inyectamos Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    if (this.id > 0) {
      this.http.get(`https://backend-restablecido-production.up.railway.app/herramientas/${this.id}`)
        .subscribe({
          next: (res) => {
            this.herramienta = res;

            // ✅ Registrar automáticamente en historial
            this.http.post('https://backend-restablecido-production.up.railway.app/historial', {
              herramientaId: this.herramienta.id,
              fecha: new Date().toISOString()
            }).subscribe({
              next: () => console.log('📝 Historial actualizado'),
              error: (err) => console.error('❌ Error al registrar en historial:', err)
            });
          },
          error: (err) => {
            this.mensajeCarga = '⚠️ No se pudo cargar la herramienta.';
            console.error('❌ Error al cargar herramienta:', err);
          }
        });
    } else {
      this.mensajeCarga = '⚠️ ID inválido en la URL.';
    }
  }

  // ✅ Función para ir al proceso de desinfección
  irAProceso(): void {
    this.router.navigate(['/proceso-desinfeccion']);
  }
}
