import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/user.model';
import { RegexTesterService } from '../regex-tester.service';

@Component({
  selector: 'app-save-modal',
  templateUrl: './save-modal.component.html',
  styleUrls: ['./save-modal.component.scss'],
})
export class SaveModalComponent implements OnInit {
  public expressionForm: FormGroup;
  private userData: User | null | undefined;
  public isLoading = false;
  private expressionId = '';

  constructor(
    private dialog: MatDialogRef<SaveModalComponent>,
    private authService: AuthService,
    private regexService: RegexTesterService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      expression: string;
      expressionId: string;
      expressionName: string;
    }
  ) {
    this.expressionForm = new FormGroup({
      expressionName: new FormControl(data.expressionName, Validators.required),
      expression: new FormControl(data.expression, Validators.required),
    });
    this.expressionId = this.data.expressionId;
    this.authService.user.subscribe((data) => {
      this.userData = data;
    });
  }

  ngOnInit(): void {}

  async saveExpression() {
    const isFormValid = this.expressionForm.valid;
    if (!isFormValid) {
      this.expressionForm.markAllAsTouched();
      return;
    }
    try {
      this.isLoading = true;
      const expressionName = this.expressionForm.get('expressionName')?.value;
      const expression = this.expressionForm.get('expression')?.value;
      let docRef;
      if (this.expressionId) {
        docRef = await this.regexService.editExpresion(
          this.data.expressionId,
          expressionName,
          expression,
          this.userData?.uid
        );
      } else {
        docRef = await this.regexService.saveExpression(
          expressionName,
          expression,
          this.userData?.uid
        );
        this.expressionId = docRef.id;
      }
      this.snackBar.open('Expressão salva com sucesso!', 'Fechar', {
        duration: 2000,
        panelClass: ['succes-snack'],
      });
      this.dialog.close({
        expressionName,
        expression,
        expressionId: this.expressionId,
      });
    } catch (error) {
      this.snackBar.open(
        'Erro ao salvar expressão, tente novamente mais tarde!',
        'Fechar',
        {
          duration: 2000,
          panelClass: ['danger-snack'],
        }
      );
      this.isLoading = false;
      console.log(error);
    }
  }
}
