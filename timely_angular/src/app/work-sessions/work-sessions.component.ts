import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { WorkSession } from 'src/workSession';
import { WorkService } from 'src/work.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { WorkSessionRow } from 'src/workSession';
import { MatPaginator } from '@angular/material/paginator';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';


@Component({
  selector: 'app-work-sessions',
  templateUrl: './work-sessions.component.html',
  styleUrls: ['./work-sessions.component.css']
})
export class WorkSessionsComponent implements OnInit, AfterViewInit {

  sessions: WorkSessionRow[] = [];
  currentStart: Date = new Date(0);
  currentStop: Date = new Date(0);
  currentName: String = "";
  isRecording: Boolean = false;

  buttonText: String = "Start";
  buttonColor: String = "primary";

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: String[] = ['project', 'startTime', 'endTime', 'duration', 'action'];
  dataSource = new MatTableDataSource<WorkSessionRow>(this.sessions);

  constructor(private workService: WorkService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getSessions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  getSessions(): void{
    this.workService.getWorkSessions()
      .subscribe(sessions => {
        this.sessions = sessions.map(session => ({...session, duration: this.timeBetweenDates(session.startTime, session.endTime)}))
        this.dataSource.data = this.sessions
      });
      this.dataSource.data = this.sessions;
  }

  deleteSession(row: WorkSessionRow): void {
    if (row.name != '...'){
      this.workService.deleteSession(row.name).subscribe(_ => this.getSessions());
    } else {
      if (this.isRecording) {
        this.isRecording = !this.isRecording;
        this.getSessions();
      }
    }
    this.refreshStartButton(); 
  }

  updateSession(row: WorkSessionRow): void {
    this.workService.updateWorkSession({id: row.id, name: row.name, startTime: this.dateToISO(row.startTime).toJSON(), endTime: this.dateToISO(row.endTime).toJSON()})
    .subscribe(_ => this.getSessions());
  }

  refreshStartButton(): void {
    if (this.isRecording) {
      this.buttonText = "Stop";
      this.buttonColor = "warn";
    }
    else {
      this.buttonText = "Start";
      this.buttonColor = "primary";
    }
  }

  toggleStart(): void{
    if(!this.isRecording) {
      this.currentStart = new Date;
      this.sessions.push(
        {name: "...", startTime: this.formatDate(this.currentStart), endTime: "...", duration: "..."} as WorkSessionRow);
    } 
    else {
      this.openStopDialog();
    }
    this.isRecording = !this.isRecording; 
    this.dataSource.data = this.sessions
    this.refreshStartButton();
  }

  openStopDialog(): void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {name: "", endTime: Date};
    const dialogRef = this.dialog.open(ProjectDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.currentName = result.name;
      this.currentStop = result.endTime;
      this.workService.addWorkSession({name: this.currentName, startTime: this.currentStart.toJSON(), endTime: this.currentStop.toJSON()} as WorkSession)
      .subscribe(_ => this.getSessions());
      this.refreshStartButton();
    })
  }

  openEditDialog(row: WorkSessionRow): void {
    if (row.name != '...') {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {name: row.name};
      const dialogRef = this.dialog.open(EditDialogComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        row.name = result.name;
        this.updateSession(row);
      })
    }
  }

  padDigits(num: number) {
    return num.toString().padStart(2,'0');
  }

  formatDate(date: Date) {
    return (
      [
        this.padDigits(date.getDate()),
        this.padDigits(date.getMonth() + 1),
        date.getFullYear(),
      ].join('.') + ' '
      + 
      [
        this.padDigits(date.getHours()),
        this.padDigits(date.getMinutes()),
      ].join(':')
    );
  }

  dateToISO(s: String) {
    const[date, time] = s.split(' ');
    const[D, M, Y] = date.split('.');
    const[h, m] = time.split(':');
    const d1 = new Date(+Y, +M - 1, +D, +h, +m, +0);
    return d1;
  }

  timeBetweenDates(s1: string, s2: string){

    const[date1, time1] = s1.split(' ');
    const[date2, time2] = s2.split(' ');

    const[D1, M1, Y1] = date1.split('.');
    const[D2, M2, Y2] = date2.split('.');
    const[h1, m1] = time1.split(':');
    const[h2, m2] = time2.split(':');

    const d1 = new Date(+Y1, +M1 - 1, +D1, +h1, +m1, +0);
    const d2 = new Date(+Y2, +M2 - 1, +D2, +h2, +m2, +0);

    const msBetweenDates = d2.getTime() - d1.getTime();
    let seconds = Math.floor(msBetweenDates / 1000);
    let minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return ([this.padDigits(hours), this.padDigits(minutes)].join(':'));
  }

}
