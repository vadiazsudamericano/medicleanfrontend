import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../servicios/theme.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './configuracion.html',
  styleUrls: ['./configuracion.css'],
})
export class ConfiguracionComponent implements OnInit {
  currentTheme: 'dark' | 'cobalt' = 'dark';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.currentTheme = this.themeService.getTheme();
  }

  setTheme(theme: 'dark' | 'cobalt') {
    this.themeService.setTheme(theme);
    this.currentTheme = theme;
  }

  toggleHighContrast(event: Event): void {
    const isEnabled = (event.target as HTMLInputElement).checked;
    this.themeService.toggleContrast(isEnabled);
  }
}
