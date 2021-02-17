import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SaveModalComponent } from './save-modal/save-modal.component';

@Component({
  selector: 'app-regex-tester',
  templateUrl: './regex-tester.component.html',
  styleUrls: ['./regex-tester.component.scss'],
})
export class RegexTesterComponent implements OnInit {
  public regexTesterForm: FormGroup;
  public showMessage = false;
  public message = '';
  public formatedResult = '';
  public isEditExpression = false;
  public regexName = '';
  private regexId = '';

  constructor(
    public dialog: MatDialog,
    private sharedDataService: SharedDataService
  ) {
    this.regexTesterForm = new FormGroup({
      regexExpression: new FormControl('', Validators.required),
      textToTest: new FormControl('', Validators.required),
      iFlag: new FormControl(false),
      mFlag: new FormControl(false),
      gFlag: new FormControl(false),
    });
  }

  ngOnInit(): void {
    this.sharedDataService.currentData.subscribe((response: any) => {
      if (response) {
        this.isEditExpression = true;
        this.regexName = response.name;
        this.regexId = response.id;
        this.regexTesterForm.patchValue({
          regexExpression: response.expression,
        });
      }
    });
  }

  testRegex() {
    const regex = this.getRegex();
    if (typeof regex === 'string') {
      this.showMessage = true;
      this.message = regex;
      return;
    }
    const results = this.getResults(regex);
    if (results.length === 0) {
      this.showMessage = true;
      this.message = 'Nenhuma combinação foi encontrada!';
      return;
    }
    this.showMessage = false;
    const source = this.regexTesterForm.get('textToTest')?.value;
    let index = 0;
    let result;
    this.formatedResult = '';
    while ((result = results.shift())) {
      this.formatedResult += source.substring(index, result?.index);
      if (result[0] !== '') {
        this.formatedResult += `<span>${result[0]}</span>`;
        index = result.index + result[0].length;
      } else {
        this.formatedResult += '<span>&nbsp;</span>';
        index = result.index;
      }
    }
    this.formatedResult += source.substring(index, source.length);
  }

  getRegex() {
    const regexSource = this.regexTesterForm.get('regexExpression')?.value;
    let flags = '';
    if (this.regexTesterForm.get('iFlag')?.value) {
      flags += 'i';
    }
    if (this.regexTesterForm.get('mFlag')?.value) {
      flags += 'm';
    }
    if (this.regexTesterForm.get('gFlag')?.value) {
      flags += 'g';
    }
    try {
      return new RegExp(regexSource, flags);
    } catch (err) {
      return err.message;
    }
  }

  getResults(regex: RegExp) {
    const source = this.regexTesterForm.get('textToTest')?.value;
    let result;
    let allResult = [];
    while ((result = regex.exec(source))) {
      if (result.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      allResult.push(result);
      if (!regex.global) {
        break;
      }
    }
    return allResult;
  }

  openSaveExpressionDialog() {
    const dialogRef = this.dialog.open(SaveModalComponent, {
      minWidth: '500px',
      data: {
        expression: this.regexTesterForm.get('regexExpression')?.value,
        expressionId: this.regexId,
        expressionName: this.regexName,
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.isEditExpression = true;
        this.regexName = response.expressionName;
        this.regexId = response.expressionId;
        this.regexTesterForm.patchValue({
          regexExpression: response.expression,
        });
      }
    });
  }

  clearForm() {
    this.showMessage = false;
    this.formatedResult = '';
    this.isEditExpression = false;
    this.regexName = '';
    this.regexId = '';
    this.regexTesterForm.reset();
  }
}
