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

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const country = this.route.snapshot.params['country'];
    this.detail$ = this.olympicService.getOlympicByCountry(country).pipe(
      tap((value) => {
        if (value !== undefined) {
          this.totalNumberAthletes = this.getTotal(value, 'athlete');
          this.totalNumberMedals = this.getTotal(value, 'medals');
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
                borderColor: documentStyle.getPropertyValue('--teal-500'),
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
        legend: false,
      },
    };
  }

  getTotal(olympic: Olympic, type: 'medals' | 'athlete') {
    let totalMedals = 0;
    for (const participation of olympic.participations) {
      totalMedals +=
        type === 'medals'
          ? participation.medalsCount
          : participation.athleteCount;
    }
    return totalMedals;
  }
}
