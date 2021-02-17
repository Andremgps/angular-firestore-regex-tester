import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegexTesterComponent } from './regex-tester.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SaveModalComponent } from './save-modal/save-modal.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [RegexTesterComponent, SaveModalComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDialogModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
})
export class RegexTesterModule {}
