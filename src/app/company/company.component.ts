import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SebioneApiService } from '../sebione-api.service';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort'
import {LiveAnnouncer} from '@angular/cdk/a11y';

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
  columns: string[] = ['id','name', 'email', 'logo', 'website'];

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  constructor(private sebioneService: SebioneApiService, private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit() {
    this.getCompanies();
  }

  dataSource: MatTableDataSource<IPost>;
  posts: IPost[] = [];

  getCompanies() {
    this.sebioneService.getCompaniesAPI().subscribe(res => {
      this.posts = res.results;

      this.dataSource = new MatTableDataSource(this.posts);
      console.log(res.results);

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
