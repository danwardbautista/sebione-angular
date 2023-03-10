import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SebioneApiService } from '../sebione-api.service';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort'
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators, ValidatorFn, AbstractControl, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

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


  columns: string[] = ['id','name', 'email', 'logo', 'website'];
  formValuesCompany !: FormGroup;
  NameError:any;
  EmailError:any;
  WebsiteError:any;

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  constructor(private sebioneService: SebioneApiService, private _liveAnnouncer: LiveAnnouncer, private modalService: NgbModal, private formBuilder: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.formValuesCompany = this.formBuilder.group(
      {
        name: [''],
        email: [''],
        website: [''],
      }
    );

    this.getCompanies();
  }

  get f() { return this.formValuesCompany.controls; }

  dataSource: MatTableDataSource<IPost>;
  posts: IPost[] = [];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  postCompanies() {

    let name = this.formValuesCompany.value.name;
    let email = this.formValuesCompany.value.email;
    let website = this.formValuesCompany.value.website;

    const formData = new FormData();
    // formData2.append('file', this.selectedFileImage, this.selectedFileImage.name);
    formData.append('name', name);
    formData.append('email', email)
    formData.append('website', website)

    this.sebioneService.postCompaniesAPI(formData).subscribe(res => {
      console.log(res)
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValuesCompany.reset();
      this.getCompanies();
    },
      err => {
        console.log(err.error);
        this.NameError = err.error.name;
        this.EmailError = err.error.email;
        this.WebsiteError = err.error.website;

        this.openSm(this.attachmentModalRef);
        // this._snackBar.open("test!", 'Close', {
        //   panelClass: 'error-snackbar',
        //   verticalPosition: 'bottom',
        // });
      }
    )
  }

 
  open(content:any) {
    this.modalService.open(content);
  }

  openSm(content:any) {
    this.modalService.open(content, { size: 'sm' });
  }

  openLg(content:any) {
    this.modalService.open(content, { size: 'lg' });
  }

  openXl(content:any) {
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
