import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: false, // Força o uso da arquitetura de Módulos
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  nomeUsuario: string = 'Usuário';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
   
    if (typeof window !== 'undefined' && window.localStorage) {
      const sessionData = localStorage.getItem('ford_user_session');
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData);
          this.nomeUsuario = session.nome || 'Usuário';
        } catch (e) {
          this.nomeUsuario = 'Usuário';
        }
      }
    }
  }

  irParaDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  fazerLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  menuAberto: boolean = false;

  // Função para abrir/fechar o menu
  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  // Função para redirecionar para a Home e fechar o menu
  irParaHome() {
    this.menuAberto = false;
    // Se precisar forçar a navegação para a home, use o Router:
    // this.router.navigate(['/home']);
  }
}