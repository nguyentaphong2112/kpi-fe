import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-pdf-modal',
  templateUrl: './view-pdf-modal.component.html',
  styleUrls: ['./view-pdf-modal.component.scss']
})
export class ViewPdfModalComponent implements OnInit {
  pdfSrc: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
