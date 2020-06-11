import { Component, OnInit, OnDestroy } from '@angular/core';
import { AudioRecordingService } from './rec.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DataTransferService } from '../data-transfer.service'

@Component({
  selector: 'app-speeches',
  templateUrl: './speeches.component.html',
  styleUrls: ['./speeches.component.css']
})
export class SpeechesComponent implements OnDestroy {

  isRecording = false;
  recordedTime;
  blobUrl;

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
      this.uploadRecording();
    }
  }

  uploadRecording() {
    var fileType = 'audio'; // or "audio"
    var fileName = 'ABCDEF.wav';  // or "wav"

    var formData = new FormData();
    formData.append(fileType + '-filename', fileName);
    formData.append(fileType + '-blob', this.blobUrl);
    console.log(formData);
    this.transfer.additem(formData);
    
  }


  clearRecordedData() {
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }


}
