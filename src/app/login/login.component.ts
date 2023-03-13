import { Component, ViewChild, TemplateRef } from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators, ValidatorFn, AbstractControl, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SebioneApiService } from '../sebione-api.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  // formValuesLogin !: FormGroup;
  @ViewChild("ErrorModal") private attachmentModalRef: TemplateRef<Object>;

  formValuesLogin: FormGroup = new FormGroup({
    email: new FormControl(''),
    username: new FormControl(''),
  });

  constructor(private appcomponent: AppComponent, private router: Router, private sebioneService: SebioneApiService, private _liveAnnouncer: LiveAnnouncer, private modalService: NgbModal, private formBuilder: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.formValuesLogin = this.formBuilder.group(
      {
        email: ['', Validators.required],
        password: ['', Validators.required],
      }
    );

    this.appcomponent.isUserLoggedIn = false;
      this.getuser();

  }

  getuser() {
    this.sebioneService.getCurrentUser().subscribe(res => {
      console.log("Authenticated");
      this.appcomponent.isUserLoggedIn = true;
      this.router.navigate(['/company']);
      
    },
    err => {
      console.log("Not Authenticated");
    }
  );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formValuesLogin.controls;
  }

  postLogin() {

    if (this.formValuesLogin.invalid) {
      console.log("Form invalid!")
      return;
    }

    let email = "";
    let password = "";

    if (this.formValuesLogin.value.email != null) {
      email = this.formValuesLogin.value.email;
    }

    if (this.formValuesLogin.value.password != null) {
      password = this.formValuesLogin.value.password;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    this.sebioneService.login(formData).subscribe(res => {
      console.log(res)
      if(res.status=="OK"){
        this._snackBar.open("Login successful.", 'Close', {
          panelClass: 'success-snackbar',
          verticalPosition: 'bottom',
          duration: 5000,
        });

        localStorage.setItem('userToken', res.token);

        console.log(localStorage.getItem('userToken'));
        this.appcomponent.isUserLoggedIn = true;
        this.router.navigate(['/company']);
        
      }


      
    },
      err => {
        console.log(err);
        // this.openSm(this.attachmentModalRef);
        this._snackBar.open("Login failed.", 'Close', {
          panelClass: 'error-snackbar',
          verticalPosition: 'bottom',
          duration: 5000,
        });
      }
    )
  }

  openSm(content: any) {
    this.modalService.open(content, { size: 'sm' });
  }
}
