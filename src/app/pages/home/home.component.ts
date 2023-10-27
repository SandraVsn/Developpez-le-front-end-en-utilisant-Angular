import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, switchMap, tap } from 'rxjs';
import { ChartData } from 'src/app/core/models/ChartData';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  documentStyle = getComputedStyle(document.documentElement);
  textColor = this.documentStyle.getPropertyValue('--text-color');
  public olympics$!: Observable<Olympic[] | undefined>;
  public numberOfCountries!: number;
  public numberOfJOs!: number;
  public data!: ChartData;
  public options!: any;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.options = {
      plugins: {
        legend: {
          labels: false,
        },
      },
    };
    this.olympics$ = this.olympicService.getOlympics().pipe(
      tap((value) => {
        if (value) {
          this.numberOfCountries = value.length;
          // TODO : is this the right info ????
          this.numberOfJOs = value[0].participations.length;
          this.data = {
            labels: value.map((olympic) => olympic.country),
            datasets: [
              {
                data: value.map((olympic) => this.getMedalsTotal(olympic)),
                backgroundColor: [
                  this.documentStyle.getPropertyValue('--pink-800'),
                  this.documentStyle.getPropertyValue('--blue-400'),
                  this.documentStyle.getPropertyValue('--purple-300'),
                  this.documentStyle.getPropertyValue('--cyan-100'),
                  this.documentStyle.getPropertyValue('--blue-100'),
                ],
                hoverBackgroundColor: [
                  this.documentStyle.getPropertyValue('--pink-900'),
                  this.documentStyle.getPropertyValue('--blue-500'),
                  this.documentStyle.getPropertyValue('--purple-400'),
                  this.documentStyle.getPropertyValue('--cyan-200'),
                  this.documentStyle.getPropertyValue('--blue-200'),
                ],
              },
            ],
          };
        }
      })
    );
  }

  getMedalsTotal(olympic: Olympic) {
    let totalMedals = 0;
    for (const participation of olympic.participations) {
      totalMedals += participation.medalsCount;
    }
    return totalMedals;
  }

  selectData(e: any): any {
    const country = this.data.labels[e.element.index];
    this.router.navigateByUrl(`${country}`);
  }
}
