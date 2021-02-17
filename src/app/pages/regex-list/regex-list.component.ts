import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { RegexListService } from './regex-list.service';

@Component({
  selector: 'app-regex-list',
  templateUrl: './regex-list.component.html',
  styleUrls: ['./regex-list.component.scss'],
})
export class RegexListComponent implements OnInit {
  public regexList: any[] = [];
  public isLoading = false;
  public displayedColumns: string[] = ['name', 'expression', 'actions'];
  private regexSubscrition: Subscription;

  constructor(
    private authService: AuthService,
    private sharedDataService: SharedDataService,
    private regexListService: RegexListService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loadRegex();
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.regexSubscrition.unsubscribe();
  }

  loadRegex() {
    this.isLoading = true;
    this.regexSubscrition = this.authService.user
      .pipe(
        mergeMap((data: any) => {
          return this.regexListService.listRegexByUser(data.uid);
        }),
        catchError((err) => throwError(err))
      )
      .subscribe(
        (response) => {
          // this.showRegex(response);
          this.regexList = response;
          this.isLoading = false;
        },
        (error) => {
          this.snackBar.open(
            'Falha ao carregar expressões, tente novamente mais tarde!',
            'Fechar',
            {
              duration: 2000,
              panelClass: ['danger-snack'],
            }
          );
          this.isLoading = false;
          console.log('ERRO', error);
        }
      );
  }

  showRegex(snapShot: any) {
    snapShot.forEach((regex: any) => {
      const regexData = regex.data();
      regexData.id = regex.id;
      this.regexList.push(regexData);
    });
  }

  openRegex(regexData: any) {
    this.sharedDataService.changeData(regexData);
    this.router.navigate(['regexTester']);
  }

  async deleteRegex(regexData: any) {
    try {
      await this.regexListService.deleteRegex(regexData.id);
      this.snackBar.open('Expressão deletada com sucesso!', 'Fechar', {
        duration: 2000,
        panelClass: ['succes-snack'],
      });
    } catch (error) {
      this.snackBar.open(
        'Falha ao carregar deletar expressão, tente novamente mais tarde!',
        'Fechar',
        {
          duration: 2000,
          panelClass: ['danger-snack'],
        }
      );
      console.error(error);
    }
  }
}
