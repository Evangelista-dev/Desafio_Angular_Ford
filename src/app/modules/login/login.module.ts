import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  nomeUsuario: string = '';
  senhaUsuario: string = '';
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  executarLogin(): void {
    if (!this.nomeUsuario.trim() || !this.senhaUsuario.trim()) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login(this.nomeUsuario, this.senhaUsuario).subscribe({
      next: (sucesso) => {
        this.isLoading = false;
        if (sucesso) {
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Usuário ou senha inválidos.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao conectar ao servidor.';
      }
    });
  }
}