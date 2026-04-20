import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast';
import { LoadingService } from '../../../core/services/loading';
import { BiometricService } from '../../../core/services/biometric';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  biometricAvailable = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private biometricService: BiometricService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async ngOnInit(): Promise<void> {
    this.biometricAvailable = await this.biometricService.isAvailable();
    if (this.biometricAvailable) {
      await this.tryBiometricLogin();
    }
  }

  async tryBiometricLogin(): Promise<void> {
  
    const credentials = await this.biometricService.getCredentials();
    
    if (!credentials) {
    
      if (!this.isLoading) {
        await this.toastService.showError('Debes iniciar sesión con clave una vez para activar la huella');
      }
      return;
    }

    try {
      await this.loadingService.show('Iniciando sesión...');
      await this.authService.loginWithEmail(credentials.username, credentials.password);
      await this.toastService.showSuccess('¡Bienvenido!');
      this.router.navigate(['/home'], { replaceUrl: true });
    } catch (error) {
      await this.toastService.showError('Error al iniciar sesión con biometría');
    } finally {
      await this.loadingService.hide();
    }
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

      if (this.biometricAvailable) {
        await this.biometricService.saveCredentials(email, password);
      }

      await this.toastService.showSuccess('¡Bienvenido de vuelta!');
      this.router.navigate(['/home'], { replaceUrl: true });
    } catch (error: any) {
      await this.toastService.showError(this.getErrorMessage(error.code));
      console.error(error);
    } finally {
      this.isLoading = false;
      await this.loadingService.hide();
    }
  }

  async onGoogleLogin(): Promise<void> {
    this.isLoading = true;
    try {
      await this.loadingService.show('Conectando con Google...');
      await this.authService.loginWithGoogle();
      await this.toastService.showSuccess('¡Bienvenido!');
      this.router.navigate(['/home'], { replaceUrl: true });
    } catch (error: any) {
      await this.toastService.showError('Error al conectar con Google');
      console.error(error);
    } finally {
      this.isLoading = false;
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