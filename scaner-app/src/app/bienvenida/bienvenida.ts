import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bienvenida.html',
  styleUrls: ['./bienvenida.css']
})
export class BienvenidaComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Espera 3 segundos y redirige a login
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }
}
