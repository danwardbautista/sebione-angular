import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { AppComponent } from '../app.component';
import { SebioneApiService } from '../sebione-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  companiesCount:any;
  employeesCount:any;

  constructor(private router: Router, private appcomponent: AppComponent, private sebioneService: SebioneApiService,) { }

  ngOnInit() {

    this.getuser();
    this.getDashboardInfo();

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

  getDashboardInfo() {
    this.sebioneService.getDashboardInfo().subscribe(res => {
      console.log(res);
        this.companiesCount = res.companies_count;
        this.employeesCount = res.employees_count;
    },
    err => {
      
    }
  );
  }


  currentDate = new Date();

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'August',
      'September',
      'October',
      'November',
      'December',
      'January',
      'February',
      'March',
    ],
    datasets: [
      {
        data: [44, 40, 70, 65, 54, 87, 64, 71],
        label: 'Activity',
        fill: true,
        tension: 0.5,
        borderColor: 'white',
        backgroundColor: 'rgba(0, 20, 73,0.9)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = true;

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public pieChartLabels = ['Razcorp', 'None', 'Microkeys'];
  public pieChartDatasets = [{
    data: [200, 350, 150],
    backgroundColor: ['#0b5575', '#0b2b75', '#400b75']
  }];
  public pieChartLegend = true;
  public pieChartPlugins = [];
}
