import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, partition, tap } from 'rxjs';
import { LineChartData } from 'src/app/core/models/ChartData';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  detail$!: Observable<Olympic | undefined>;
  totalNumberMedals!: number;
  totalNumberAthletes!: number;
  data!: LineChartData;
  options!: any;
  documentStyle = getComputedStyle(document.documentElement);
  textColor = this.documentStyle.getPropertyValue('--text-color');
  textColorSecondary = this.documentStyle.getPropertyValue(
    '--text-color-secondary'
  );
  surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const country = this.route.snapshot.params['country'];
    console.log('country', country);
    this.detail$ = this.olympicService.getOlympicByCountry(country).pipe(
      tap((value) => {
        if (value !== undefined) {
          this.totalNumberAthletes = this.getAthletesTotal(value);
          this.totalNumberMedals = this.getMedalsTotal(value);
          this.data = {
            labels: value.participations.map((participation) =>
              participation.year.toString()
            ),
            datasets: [
              {
                label: 'Medals per participation',
                data: value.participations.map(
                  (participation) => participation.medalsCount
                ),
                fill: false,
                borderColor: this.documentStyle.getPropertyValue('--teal-500'),
                tension: 0.4,
              },
            ],
          };
        } else {
          this.router.navigateByUrl('not-found');
        }
      })
    );

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: this.textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: this.textColorSecondary,
          },
          grid: {
            color: this.surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: this.textColorSecondary,
          },
          grid: {
            color: this.surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
    console.log(this.detail$);
  }

  getMedalsTotal(olympic: Olympic) {
    let totalMedals = 0;
    for (const participation of olympic.participations) {
      totalMedals += participation.medalsCount;
    }
    return totalMedals;
  }

  getAthletesTotal(olympic: Olympic) {
    let totalAthletes = 0;
    for (const participation of olympic.participations) {
      totalAthletes += participation.athleteCount;
    }

    return totalAthletes;
  }
}
