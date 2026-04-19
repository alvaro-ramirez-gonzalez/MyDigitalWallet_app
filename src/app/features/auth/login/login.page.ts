import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast';
import { LoadingService } from '../../../core/services/loading';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private loadingService: LoadingService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.isLoading = true;

    try {
      await this.loadingService.show('Iniciando sesión...');
      await this.authService.loginWithEmail(email, password);
      await this.toastService.showSuccess('¡Bienvenido de vuelta!');
      this.router.navigate(['/home'], { replaceUrl: true });
    } catch (error: any) {
      await this.toastService.showError(this.getErrorMessage(error.code));
    } finally {
      this.isLoading = false;
      await this.loadingService.hide();
    }
  }

  async onGoogleLogin(): Promise<void> {
    try {
      await this.loadingService.show('Conectando con Google...');
      await this.authService.loginWithGoogle();
      await this.toastService.showSuccess('¡Bienvenido!');
      this.router.navigate(['/home'], { replaceUrl: true });
    } catch (error: any) {
      await this.toastService.showError('Error al conectar con Google');
      console.error(error);
    } finally {
      await this.loadingService.hide();
    }
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  private getErrorMessage(code: string): string {
    const errors: Record<string, string> = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-email': 'Correo inválido',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/invalid-credential': 'Credenciales inválidas',
    };
    return errors[code] || 'Error al iniciar sesión';
  }
}