import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class LoginComponent {
  authService = inject(AuthenticationService)
  router = inject(Router)

  errorMessage = signal<string | null>(null)
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required)
  });

  onSubmit(): void {
    this.errorMessage.set(null)
    const { username, password } = this.loginForm.getRawValue()
    this.authService.login(username, password).subscribe(
      success => {
        if (success) {
          // Navigate to a protected route or home page
          console.log('Login successful!');
          this.router.navigate(['/products']);
        } else {
          this.errorMessage.set('Invalid credentials. Please try again.')
        }
      },
      error => {
        this.errorMessage.set('An error occurred during login.')
      }
    );
  }

}
