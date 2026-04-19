import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast';
import { LoadingService } from '../../../core/services/loading';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false 
})
export class RegisterPage {

  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private loadingService: LoadingService
  ) {
    this.registerForm = this.fb.group({
      nombre:           ['', Validators.required],
      apellido:         ['', Validators.required],
      tipoDocumento:    ['', Validators.required],
      numeroDocumento:  ['', Validators.required],
      pais:             ['', Validators.required],
      email:            ['', [Validators.required, Validators.email]],
      password:         ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword:  ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirm  = control.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  togglePassword(): void { this.showPassword = !this.showPassword; }
  toggleConfirmPassword(): void { this.showConfirmPassword = !this.showConfirmPassword; }

  async onRegister(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { email, password, nombre, apellido,
            tipoDocumento, numeroDocumento, pais } = this.registerForm.value;

    this.isLoading = true;

    try {
      await this.loadingService.show('Creando tu cuenta...');
      await this.authService.registerWithEmail(email, password, {
        nombre, apellido, tipoDocumento, numeroDocumento, pais
      });
      await this.toastService.showSuccess('¡Cuenta creada exitosamente!');
      this.router.navigate(['/home'], { replaceUrl: true });
    } catch (error: any) {
      await this.toastService.showError(this.getErrorMessage(error.code));
    } finally {
      this.isLoading = false;
      await this.loadingService.hide();
    }
  }

  goBack(): void {
    this.router.navigate(['/auth/login']);
  }

  private getErrorMessage(code: string): string {
    const errors: Record<string, string> = {
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/invalid-email':        'Correo inválido',
      'auth/weak-password':        'Contraseña muy débil',
    };
    return errors[code] || 'Error al crear la cuenta';
  }
}