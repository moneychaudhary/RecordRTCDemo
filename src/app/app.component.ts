import { Component, OnDestroy } from '@angular/core';
import { AudioRecordingService } from './audio-recording.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <button class="start-button" *ngIf="!isRecording && !blobUrl" (click)="startRecording()">Start Recording</button>
      <button class="stop-button" *ngIf="isRecording && !blobUrl" (click)="stopRecording()">Stop Recording</button>
      <button class="cancel-button" *ngIf="!isRecording && blobUrl" (click)="clearRecordedData()">Clear Recording</button>
      <div *ngIf="isRecording && !blobUrl"> {{recordedTime}} </div>
      <div>
      <audio *ngIf="!isRecording && blobUrl"  controls>
        <source [src]="blobUrl" type="audio/webm">
      </audio>
      </div>
    </div>
  `,
  styles: [`
    .start-button {
      background-color: #7ffe9f; /* Green */
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin-bottom: 10px;
    }

    .stop-button {
      background-color: rgba(118, 146, 254, 0.69); /* Green */
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin-bottom: 10px;

    }

    .cancel-button {
      background-color: #af7541; /* Green */
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin-bottom: 10px;

    }
  `]
})
export class AppComponent implements OnDestroy {

  isRecording = false;
  recordedTime;
  blobUrl;

  constructor(private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer) {

    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
    });
  }

  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

}
