import { Component, OnInit, OnDestroy, OnChanges, SimpleChange, SimpleChanges, Input } from '@angular/core';
import { AudioRecordingService } from './rec.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DataTransferService } from '../data-transfer.service'
import { title } from 'process';

@Component({
  selector: 'app-speeches',
  templateUrl: './speeches.component.html',
  styleUrls: ['./speeches.component.css']
})
export class SpeechesComponent implements OnDestroy, OnChanges {

  isRecording = false;
  recordedTime;
  @Input() blobUrl = null;

  constructor(private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer, private transfer: DataTransferService) {
  

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
      //console.log(this.blobUrl[title]);
    }
  }

  uploadRecording() {
    var fileType = 'audio'; 
    var fileName = 'ABCDEF.wav';  
    var formData = new FormData();
    formData.append(fileType + '-filename', fileName);
    formData.append(fileType + '-blob', this.audioRecordingService.getBlob());
    this.transfer.additem(formData);
  }
  clearRecordedData() {
    if(this.blobUrl){
       this.uploadRecording();  
    }
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }
  ngOnChanges(changes : SimpleChanges): void{
    if(changes.blobUrl && this.blobUrl){
      this.uploadRecording();
    }
  }


}
