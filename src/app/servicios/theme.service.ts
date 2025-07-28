import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private theme: 'dark' | 'cobalt' = 'dark';

  constructor() {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'cobalt';
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('dark');
    }
  }

  setTheme(theme: 'dark' | 'cobalt'): void {
    document.body.classList.remove('theme-dark', 'theme-cobalt');
    document.body.classList.add(`theme-${theme}`);
    this.theme = theme;
    localStorage.setItem('theme', theme);
  }

  getTheme(): 'dark' | 'cobalt' {
    return this.theme;
  }

  toggleContrast(enabled: boolean) {
  if (enabled) {
    document.body.classList.add('high-contrast');
    localStorage.setItem('app-contrast', 'high');
  } else {
    document.body.classList.remove('high-contrast');
    localStorage.setItem('app-contrast', 'normal');
  }
}
}
