import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  error: boolean = false;
  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  form = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    password: ['', Validators.required],
  });

  // ✅ Validación sencilla de sesión activa
  ngOnInit(): void {
    const user = localStorage.getItem('user'); // revisar si ya hay usuario guardado
    if (user) {
      this.router.navigateByUrl('/home'); // redirigir si ya está logueado
    }
  }

  // ✅ Función para hacer login
  onSubmit() {
    const rawForm = this.form.getRawValue();

    this.authService.login(rawForm.email, rawForm.password).subscribe({
      next: (user) => {
        localStorage.setItem('user', JSON.stringify(user)); // guardar usuario en localStorage
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        this.error = true;
        console.error('Error al iniciar sesión', error);
      }
    });
  }

  // ✅ Redirigir a registro
  goToRegister() {
    this.router.navigateByUrl('/registro');
  }
}
