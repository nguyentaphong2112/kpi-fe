import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DownloadFileService } from '@shared/services/download-file.service';

@Component({
  selector: 'app-preview-file',
  templateUrl: './preview-file.component.html',
  styleUrls: ['./preview-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewFileComponent implements OnInit {

  serviceName: string;
  data: any;
  fileName: string;
  isPdf: boolean;
  pdfSrc: string;
  excelHTML: any = '';
  isImage: boolean;

  constructor(private sanitizer: DomSanitizer,
              private downloadFileService: DownloadFileService,
              private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.loadData();
  }


  private loadData() {
    if (this.isPdf) {
      this.pdfSrc = URL.createObjectURL(this.data);
      this.changeDetectorRef.detectChanges();
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        this.excelHTML = this.sanitizer.bypassSecurityTrustHtml(reader.result as any);
        this.changeDetectorRef.detectChanges();
      };
      reader.readAsText(this.data);
    }
  }

  public exportFile() {
    this.downloadFileService.doDownloadFileByName('/v1/download/temp-file',
      { fileName: this.fileName, isPdf: this.isPdf }, this.serviceName).toPromise();
  }

  public exportJpg() {
    const fileNameJpg = this.fileName.replace('.pdf', '.jpg');
    this.downloadFileService.doDownloadFileByName('/v1/download/temp-file',
      { fileName: fileNameJpg, isPdf: this.isPdf }, this.serviceName).toPromise();
  }

}
