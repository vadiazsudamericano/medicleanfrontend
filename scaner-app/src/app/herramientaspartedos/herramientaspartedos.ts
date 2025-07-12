import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-herramientas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './herramientaspartedos.html',
  styleUrls: ['./herramientaspartedos.css']
})
export class HerramientasComponent {
  herramientas = [
    { nombre: 'Bisturí', imagen: 'https://via.placeholder.com/150?text=Bisturí' },
    { nombre: 'Pinza', imagen: 'https://via.placeholder.com/150?text=Pinza' },
    { nombre: 'Tijeras', imagen: 'https://via.placeholder.com/150?text=Tijeras' },
  ];
}