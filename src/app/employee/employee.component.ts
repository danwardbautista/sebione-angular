import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SebioneApiService } from '../sebione-api.service';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort'
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators, ValidatorFn, AbstractControl, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

interface IPost {
  id: number;
  first_name: string;
  last_name: string;
  FK_employees_companies: string;
  name: string;
  email: string;
  phone: string;
}

interface CompanyPost {
  id: number;
  name: string;
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent {

  columns: string[] = ['id','first_name', 'last_name', 'name', 'email', 'phone', 'action'];
  dataSource: MatTableDataSource<IPost>;
  posts: IPost[] = [];
  companyCapture: any;
  companyCaptureFilter:any;
  showAdd: boolean;
  showEdit: boolean;
  FirstNameError:any;
  LastNameError:any;
  CompanyError:any;
  EmailError:any;
  PhoneError:any;
  formValuesEmployee !: FormGroup;
  selectedValue:string;
  editRowID:any;
  selected:any = "None";
  deleteRowID:any;
  deleteFirstName:any;
  deleteLastName:any;
  tableLoaded:boolean=false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("ErrorModal") private attachmentModalRef: TemplateRef<Object>;

  constructor(private router: Router, private appcomponent: AppComponent, private sebioneService: SebioneApiService, private _liveAnnouncer: LiveAnnouncer, private modalService: NgbModal, private formBuilder: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.formValuesEmployee = this.formBuilder.group(
      {
        last_name: [''],
        first_name: [''],
        FK_employees_companies: [''],
        email: [''],
        phone: [''],
      }
    );

    this.getuser();
    this.getEmployees();
    this.getCompanies();
    
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
      this.companyCapture = res.results;
    });
  }

  applyCompanyFilter(event:any) {

    const filterValue = event ? event.target.value.toLowerCase() : '';

    this.companyCaptureFilter = this.companyCapture
      .map((x:any, index:any) => ({
        index: index,
        value: x,
      }))
      .filter((y: any) => y.value.name.toLowerCase().includes(filterValue));

      // console.log(this.companyCaptureFilter);
    
  }
  
  getEmployees() {
    this.sebioneService.getEmployeesAPI().subscribe(res => {
      this.posts = res.results;

      this.dataSource = new MatTableDataSource(this.posts);
      // console.log(res.results);

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.tableLoaded = true;
    });
  }

  postEmployees() {

    let first_name = "";
    let last_name = "";
    let FK_employees_companies = "";
    let email = "";
    let phone = "";

    if (this.formValuesEmployee.value.first_name != null) {
      first_name = this.formValuesEmployee.value.first_name;
    }

    if (this.formValuesEmployee.value.last_name != null) {
      last_name = this.formValuesEmployee.value.last_name;
    }

    if (this.formValuesEmployee.value.FK_employees_companies != null) {
      FK_employees_companies = this.formValuesEmployee.value.FK_employees_companies;
    }

    if (this.formValuesEmployee.value.email != null) {
      email = this.formValuesEmployee.value.email;
    }

    if (this.formValuesEmployee.value.phone != null) {
      phone = this.formValuesEmployee.value.phone;
    }

    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('FK_employees_companies', FK_employees_companies);
    formData.append('email', email);
    formData.append('phone', phone);

    this.sebioneService.postEmployeesAPI(formData).subscribe(res => {
      console.log(res)
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValuesEmployee.reset();
      this.getEmployees();
      this._snackBar.open("Employee successfully added.", 'Close', {
        panelClass: 'success-snackbar',
        verticalPosition: 'bottom',
        duration: 5000,
      });
    },
      err => {
        console.log(err.error);
        this.FirstNameError = err.error.first_name;
        this.LastNameError = err.error.last_name;
        this.CompanyError = err.error.FK_employees_companies;
        this.EmailError = err.error.email;
        this.PhoneError = err.error.phone;

        this.openSm(this.attachmentModalRef);

      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clickAddEmployee() {
    this.selected = "None";
    this.formValuesEmployee.reset();
    this.showAdd = true;
    this.showEdit = false;
    this.applyCompanyFilter(null);
  }

  clickEditEmployee(element:any) {
    this.formValuesEmployee.reset();
    this.showAdd = false;
    this.showEdit = true;
    this.applyCompanyFilter(null);
    this.editRowID = element.id;
    this.selected = element.name;

    this.formValuesEmployee.controls['first_name'].setValue(element.first_name);
    this.formValuesEmployee.controls['last_name'].setValue(element.last_name);
    this.formValuesEmployee.controls['FK_employees_companies'].setValue(element.FK_employees_companies);
    this.formValuesEmployee.controls['email'].setValue(element.email);
    this.formValuesEmployee.controls['phone'].setValue(element.phone);
  }

  clickDeleteEmployee(element: any) {
    this.deleteRowID = element.id;
    this.deleteFirstName = element.first_name;
    this.deleteLastName = element.last_name;
  }

  editEmployees() {

    let first_name = "";
    let last_name = "";
    let FK_employees_companies = "";
    let email = "";
    let phone = "";

    if (this.formValuesEmployee.value.first_name != null) {
      first_name = this.formValuesEmployee.value.first_name;
    }

    if (this.formValuesEmployee.value.last_name != null) {
      last_name = this.formValuesEmployee.value.last_name;
    }

    if (this.formValuesEmployee.value.FK_employees_companies != null) {
      FK_employees_companies = this.formValuesEmployee.value.FK_employees_companies;
    }

    if (this.formValuesEmployee.value.email != null) {
      email = this.formValuesEmployee.value.email;
    }

    if (this.formValuesEmployee.value.phone != null) {
      phone = this.formValuesEmployee.value.phone;
    }

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('FK_employees_companies', FK_employees_companies);
    formData.append('email', email);
    formData.append('phone', phone);

    this.sebioneService.editEmployeesAPI(formData, this.editRowID).subscribe(res => {
      console.log(res)
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValuesEmployee.reset();
      this.getEmployees();
      this._snackBar.open("Employee successfully edited.", 'Close', {
        panelClass: 'success-snackbar',
        verticalPosition: 'bottom',
        duration: 5000,
      });
    },
      err => {
        console.log(err.error);
        this.FirstNameError = err.error.first_name;
        this.LastNameError = err.error.last_name;
        this.CompanyError = err.error.FK_employees_companies;
        this.EmailError = err.error.email;
        this.PhoneError = err.error.phone;

        this.openSm(this.attachmentModalRef);

      }
    )
  }

  deleteEmployees() {

    this.sebioneService.deleteEmployeesAPI(this.deleteRowID).subscribe(res => {
      console.log(res)
      let ref = document.getElementById('cancelDelete')
      ref?.click();
      this.getEmployees();
      this._snackBar.open(this.deleteFirstName + " " + this.deleteLastName + " successfully deleted.", 'Close', {
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
