import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tips-modal',
  standalone: true,
  imports: [CommonModule],
  // 👇 AQUÍ ESTÁ LA CORRECCIÓN. AHORA COINCIDE CON TUS NOMBRES DE ARCHIVO
  templateUrl: './tips-modal.html', 
  styleUrls: ['./tips-modal.scss']
})
export class TipsModalComponent {
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}