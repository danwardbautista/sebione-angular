import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SebioneApiService } from './sebione-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sebione-angular';
  isUserLoggedIn: boolean = true;

  constructor(private sebioneService: SebioneApiService, private router: Router, private _snackBar: MatSnackBar) {
  }

  postLogout() {
    this.sebioneService.logout().subscribe(res => {
      console.log(res)
      localStorage.setItem('userToken', 'none');
      this.router.navigate(['/login']);
      this._snackBar.open("Logout successful.", 'Close', {
        panelClass: 'success-snackbar',
        verticalPosition: 'bottom',
        duration: 5000,
      });

    },
      err => {

      }
    );
  }
}
