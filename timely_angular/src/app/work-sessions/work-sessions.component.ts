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

  sessionsRow: WorkSessionRow[] = [];
  sessions: WorkSession[] = [];
  currentStart: Date = new Date(0);
  currentStop: Date = new Date(0);
  currentName: String = "";
  isRecording: Boolean = false;

  buttonText: String = "Start";
  buttonColor: String = "primary";

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: String[] = ['project', 'startTime', 'endTime', 'duration', 'action'];
  dataSource = new MatTableDataSource<WorkSessionRow>(this.sessionsRow);

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
        this.sessionsRow = sessions
        .map(session => ({...session, startTime: this.formatDate(new Date(session.startTime)), endTime: this.formatDate(new Date(session.endTime))}));
        this.dataSource.data = this.sessionsRow;
        this.sessions = sessions;
      });
      this.dataSource.data = this.sessionsRow;
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
    let newSession = this.sessions.find(i => i.id === row.id);
    if (newSession) {
      this.workService.updateWorkSession({...newSession, name: row.name})
    .subscribe(_ => this.getSessions());
    }
    
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
      this.sessionsRow.unshift(
        {name: "...", startTime: this.formatDate(this.currentStart), endTime: "...", duration: "..."} as WorkSessionRow);
    } 
    else {
      this.openStopDialog();
    }
    this.isRecording = !this.isRecording; 
    this.dataSource.data = this.sessionsRow
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
      this.workService.addWorkSession({name: this.currentName, startTime: this.currentStart, endTime: this.currentStop} as WorkSession)
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
}
