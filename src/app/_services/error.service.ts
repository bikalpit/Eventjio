import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private _snackBar : MatSnackBar,
  ) { }
  errorMessage(errorMessage){
    this._snackBar.open(errorMessage, "X", {
      duration: 2000,
      verticalPosition: 'top',
      panelClass : ['red-snackbar']
      });
  }
}
