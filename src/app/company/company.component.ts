import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SebioneApiService } from '../sebione-api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort'
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators, ValidatorFn, AbstractControl, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

interface IPost {
  id: number;
  name: string;
  email: string;
  logo: string;
  website: string;
}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})

export class CompanyComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("ErrorModal") private attachmentModalRef: TemplateRef<Object>;


  columns: string[] = ['id', 'name', 'email', 'logo', 'website', 'action'];
  formValuesCompany !: FormGroup;
  NameError: any;
  EmailError: any;
  LogoError: any;
  WebsiteError: any;
  image: any;
  selectedFileImage: any = null;
  showAdd: boolean;
  showEdit: boolean;
  uploadedImage: any;
  rowID: any;
  deleteID: any;
  deleteCompany: any;

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  constructor(private router: Router, private appcomponent: AppComponent, private sebioneService: SebioneApiService, private _liveAnnouncer: LiveAnnouncer, private modalService: NgbModal, private formBuilder: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.formValuesCompany = this.formBuilder.group(
      {
        name: [''],
        email: [''],
        website: [''],
      }
    );

    this.getuser();
    this.getCompanies();
  }

  get f() { return this.formValuesCompany.controls; }

  dataSource: MatTableDataSource<IPost>;
  posts: IPost[] = [];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getuser() {
    this.sebioneService.getCurrentUser().subscribe(res => {
      console.log("Authenticated");
      // this.appcomponent.isUserLoggedIn = true;
    },
    err => {
      console.log("Not Authenticated");
      this.router.navigate(['/login']);
    }
  );
  }

  getCompanies() {
    this.sebioneService.getCompaniesAPI().subscribe(res => {
      this.posts = res.results;

      this.dataSource = new MatTableDataSource(this.posts);
      // console.log(res.results);

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  imageModal(getter: any) {
    this.image = getter;
  }

  onFileSelectImage(event: any) {
    this.selectedFileImage = <File>event.target.files[0];
  }

  clickAddCompany() {
    this.formValuesCompany.reset();
    this.showAdd = true;
    this.showEdit = false;
  }

  clickEditCompany(element: any) {
    this.showAdd = false;
    this.showEdit = true;
    this.rowID = element.id;

    this.formValuesCompany.controls['name'].setValue(element.name);
    this.formValuesCompany.controls['email'].setValue(element.email);
    this.uploadedImage = element.logo;
    this.formValuesCompany.controls['website'].setValue(element.website);
  }

  clickDeleteCompany(element: any) {
    this.deleteID = element.id;
    this.deleteCompany = element.name;
  }

  postCompanies() {

    let name = "";
    let email = "";
    let website = "";

    if (this.formValuesCompany.value.name != null) {
      name = this.formValuesCompany.value.name;
    }
    if (this.formValuesCompany.value.email != null) {
      email = this.formValuesCompany.value.email;
    }
    if (this.formValuesCompany.value.website != null) {
      website = this.formValuesCompany.value.website;
    }

    console.log(email);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email)
    if (this.selectedFileImage != null) {
      formData.append('logo', this.selectedFileImage, this.selectedFileImage.name);
    }
    formData.append('website', website)

    this.sebioneService.postCompaniesAPI(formData).subscribe(res => {
      console.log(res)
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValuesCompany.reset();
      this.getCompanies();
      this._snackBar.open("Company successfully added.", 'Close', {
        panelClass: 'success-snackbar',
        verticalPosition: 'bottom',
        duration: 5000,
      });
    },
      err => {
        console.log(err.error);
        this.NameError = err.error.name;
        this.EmailError = err.error.email;
        this.LogoError = err.error.logo;
        this.WebsiteError = err.error.website;

        this.openSm(this.attachmentModalRef);

      }
    )
  }

  editCompanies() {

    let name = "";
    let email = "";
    let website = "";

    if (this.formValuesCompany.value.name != null) {
      name = this.formValuesCompany.value.name;
    }
    if (this.formValuesCompany.value.email != null) {
      email = this.formValuesCompany.value.email;
    }
    if (this.formValuesCompany.value.website != null) {
      website = this.formValuesCompany.value.website;
    }

    console.log(email);

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', name);
    formData.append('email', email)
    if (this.selectedFileImage != null) {
      formData.append('logo', this.selectedFileImage, this.selectedFileImage.name);
    }
    formData.append('website', website)

    this.sebioneService.editCompaniesAPI(formData, this.rowID).subscribe(res => {
      console.log(res)
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValuesCompany.reset();
      this.getCompanies();
      this._snackBar.open("Company successfully edited.", 'Close', {
        panelClass: 'success-snackbar',
        verticalPosition: 'bottom',
        duration: 5000,
      });
    },
      err => {
        console.log(err.error);
        this.NameError = err.error.name;
        this.EmailError = err.error.email;
        this.LogoError = err.error.logo;
        this.WebsiteError = err.error.website;

        this.openSm(this.attachmentModalRef);

      }
    )
  }

  deleteCompanies() {

    this.sebioneService.deleteCompaniesAPI(this.deleteID).subscribe(res => {
      console.log(res)
      let ref = document.getElementById('cancelDelete')
      ref?.click();
      this.getCompanies();
      this._snackBar.open(this.deleteCompany + " successfully deleted.", 'Close', {
        panelClass: 'success-snackbar',
        verticalPosition: 'bottom',
        duration: 5000,
      });
    },
      err => {
        console.log(err.error);
        this._snackBar.open("An error has occured.", 'Close', {
          panelClass: 'error-snackbar',
          verticalPosition: 'bottom',
          duration: 5000,
        });

      }
    )

  }

  open(content: any) {
    this.modalService.open(content);
  }

  openSm(content: any) {
    this.modalService.open(content, { size: 'sm' });
  }

  openLg(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }


  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
