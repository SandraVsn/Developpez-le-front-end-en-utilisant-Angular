import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | undefined>(undefined);

  constructor(private http: HttpClient, private router: Router) {}

  loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error: HttpErrorResponse, caught) => {
        this.router.navigateByUrl('error');
        this.olympics$.next(undefined);
        return caught;
      })
    );
  }

  getOlympics(): Observable<Olympic[] | undefined> {
    return this.olympics$.asObservable();
  }

  getOlympicByCountry(country: string): Observable<Olympic | undefined> {
    return this.olympics$
      .asObservable()
      .pipe(
        map((olympics) =>
          olympics?.find((olympic) => olympic.country === country)
        )
      );
  }
}
