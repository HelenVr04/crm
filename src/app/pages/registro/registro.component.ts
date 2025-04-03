import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  error: string = '';
  success: boolean = false;
  loading: boolean = false;
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ],
    confirmPassword: [
      '',
      Validators.required
    ]
  }, { 
    validators: this.passwordMatchValidator 
  });

  private passwordMatchValidator(form: any) {
    const password = form.get('password').value;
    const confirmPassword = form.get('confirmPassword').value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.error = 'Por favor completa el formulario correctamente';
      return;
    }
  
    this.loading = true;
    this.error = '';
    
    const { email, password } = this.form.getRawValue();
  
    this.authService.register(email, password).subscribe({
      next: (userCredential) => {
        this.success = true;
        // Redirigir inmediatamente sin esperar
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.error = this.getErrorMessage(error.code);
        this.loading = false;
      }
    });
  }

  private getErrorMessage(code: string): string {
    switch(code) {
      case 'auth/email-already-in-use':
        return 'El correo electrónico ya está en uso';
      case 'auth/invalid-email':
        return 'Correo electrónico inválido';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      case 'auth/operation-not-allowed':
        return 'Operación no permitida';
      default:
        return 'Ocurrió un error al registrar el usuario';
    }
  }

  goToLogin(): void {
    this.router.navigate(['/']);
  }
}