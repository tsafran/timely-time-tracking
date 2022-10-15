import { Injectable } from '@angular/core';
import { WorkSession } from './workSession';
import { catchError, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkService {

  private timelyURL = "http://localhost:8080/timely";

  httpOptions:any = {
    Headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  getWorkSessions(): Observable<WorkSession[]> {
    return this.http.get<WorkSession[]>(this.timelyURL)
      .pipe(
        tap(_ => console.log('fetched work sessions')),
        catchError(this.handleError<WorkSession[]>('getWorkSessions', []))
      );
  }

  addWorkSession(workSession: WorkSession) {
    return this.http.post<WorkSession>(this.timelyURL, workSession).pipe(
      tap(_ => console.log('added new work session')),
      catchError(this.handleError<WorkSession>('addWorkSession'))
    );
  }

  deleteSession(session: WorkSession | string): Observable<WorkSession> {
    const name = typeof session === 'string' ? session : session.name;
    const url = `${this.timelyURL}/${name}`;

    return this.http.delete<WorkSession>(url).pipe(
      tap(_ => console.log(`deleted session ${name}`)),
      catchError(this.handleError<WorkSession>('deleteSession'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(operation);
      console.error(error);
      return of(result as T);
    };
  }
}
