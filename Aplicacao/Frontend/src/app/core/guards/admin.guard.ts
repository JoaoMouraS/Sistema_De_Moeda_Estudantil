import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snack = inject(MatSnackBar);

  const user = authService.getCurrentUser();
  
  if (user && user.tipoUsuario?.toUpperCase() === 'ADMIN') {
    return true; // Deixa passar
  }

  // Bloqueia e redireciona
  snack.open('Área restrita a administradores do sistema.', 'Fechar', { duration: 4000 });
  router.navigate(['/home']);
  return false;
};