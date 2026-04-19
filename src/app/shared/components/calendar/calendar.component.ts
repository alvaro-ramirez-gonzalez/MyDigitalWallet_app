import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone : false
})
export class CalendarComponent {
  @Output() dateSelected = new EventEmitter<Date>();

  selectedDate: string = new Date().toISOString();

  onDateChange(event: any): void {
    const date = new Date(event.detail.value);
    this.selectedDate = event.detail.value;
    this.dateSelected.emit(date);
  }
}