import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService); // Utilizando seu AuthService

  isLoggedIn = false;
  userRole: string | null = null; 
  userName: string | null = null; // Variável para exibir o nome

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isAuthenticated();
    
    if (this.isLoggedIn) {
      const user = this.authService.getCurrentUser();
      if (user) {
        // Pega o primeiro nome para ficar mais amigável na tela
        this.userName = user.nome.split(' ')[0]; 
        
        const tipo = user.tipoUsuario.toUpperCase();
        if (tipo.includes('ALUNO')) {
          this.userRole = 'ALUNO';
        } else if (tipo.includes('EMPRESA') || tipo.includes('PARCEIRO')) {
          this.userRole = 'EMPRESA';
        } else {
          this.userRole = 'ALUNO'; // Fallback padrão
        }
      }
    } else {
      this.isLoggedIn = false;
      this.userRole = null;
      this.userName = null;
    }
  }

  logout(event: Event) {
    event.preventDefault();
    
    // Usa o método limpo que já existe no seu serviço
    this.authService.logout();
    
    this.isLoggedIn = false;
    this.userRole = null;
    this.userName = null;
    
    // Atualiza a página redirecionando para o login
    this.router.navigate(['/login']);
  }
}