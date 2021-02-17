import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isLoading: boolean = false;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.matIconRegistry.addSvgIcon(
      'google-logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/icons/google/Google__G__Logo.svg'
      )
    );

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  async signIn() {
    try {
      if (this.loginForm.invalid) {
        return;
      }
      this.isLoading = true;
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      await this.auth.signIn(email, password);
      this.router.navigate(['regexTester']);
    } catch (error) {
      if (error.code == 'auth/wrong-password') {
        this.snackBar.open('Senha incorreta!', 'Fechar', {
          duration: 2000,
        });
      } else if (error.code == 'auth/user-not-found') {
        this.snackBar.open('Usuário não cadastrado!', 'Fechar', {
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
      this.isLoading = false;
      console.error(error);
    }
  }
}
