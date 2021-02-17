import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public isLoading: boolean = false;

  constructor(
    public auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngOnInit(): void {}

  async signUp() {
    try {
      if (this.registerForm.invalid) {
        return;
      }
      this.isLoading = true;
      const email = this.registerForm.get('email')?.value;
      const name = this.registerForm.get('name')?.value;
      const password = this.registerForm.get('password')?.value;
      await this.auth.userRegister(email, name, password);
      this.snackBar.open('Usuário registrado com sucesso!', 'Fechar', {
        duration: 2000,
        panelClass: ['succes-snack'],
      });
      this.router.navigate(['/regexTester']);
    } catch (error) {
      if (error.code == 'auth/email-already-in-use') {
        this.snackBar.open('Email já esta em uso!', 'Fechar', {
          duration: 2000,
          panelClass: ['danger-snack'],
        });
      } else {
        this.snackBar.open(
          'Servidor Indisponível, tente novamente mais tarde!',
          'Fechar',
          {
            duration: 2000,
            panelClass: ['danger-snack'],
          }
        );
      }
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
