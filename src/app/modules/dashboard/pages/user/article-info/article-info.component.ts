import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef, HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';

@Component({
  selector: 'app-article-info',
  templateUrl: './article-info.component.html',
  styleUrls: ['./article-info.component.scss']
})
export class ArticleInfoComponent implements OnInit, AfterViewInit, AfterViewChecked {
  currentWidth = window.innerWidth;
  arts = [
    {
      imgLargeData: "./assets/img/banner.jpg",
      title: "Tuyển dụng Back-end Developer (Java, SQL, Spring, English)",
      createDate: "10:08 27/06/2024"
    },
    {
      imgLargeData: "./assets/img/banner2.png",
      title: "Ưu đãi giảm thêm 10% giá phòng",
      createDate: "10:15 28/06/2024"
    },
    {
      imgLargeData: "./assets/img/banner.jpg",
      title: "Tin tức nổi bật",
      createDate: "10:08 28/06/2024"
    },
    {
      imgLargeData: "./assets/img/banner2.png",
      title: "Tin tức nổi bật",
      createDate: "10:08 27/06/2024"
    },
    {
      imgLargeData: "./assets/img/banner.jpg",
      title: "Tin tức nổi bật",
      createDate: "10:08 27/06/2024"
    },
    {
      imgLargeData: "./assets/img/banner2.png",
      title: "Tin tức nổi bật",
      createDate: "10:08 27/06/2024"
    },
    {
      imgLargeData: "./assets/img/banner.jpg",
      title: "Tin tức nổi bật",
      createDate: "10:08 27/06/2024"
    }
  ];
  checkFirst = false;

  @ViewChild('elementHeight', {static: false}) elementHeight: ElementRef;
  @ViewChild('elementArtItems', {static: false}) elementArtItems: ElementRef;
  @ViewChildren('elementSubHeight') elementSubHeight: QueryList<ElementRef>;
  treemapObserver = new ResizeObserver(() => this.render());

  constructor() {
  }

  ngOnInit(): void {
  }



  private render() {
    this.currentWidth = window.innerWidth;
    let heightItems = 0;
    this.elementSubHeight?.toArray().forEach((item: ElementRef, i: number) => {
        if (item.nativeElement.offsetHeight > 0 && i < 4) {
          heightItems += item.nativeElement.offsetHeight;
        }
      }
    );
    if (this.currentWidth > 1100) {
      let gap = 0;
      let heightArts = 0;
      if (this.elementHeight?.nativeElement?.offsetHeight > 0) {
        heightArts = this.elementHeight.nativeElement.offsetHeight;
        gap = Math.round((heightArts - heightItems) / 3);
        if (gap < 0) {
          gap = 20;
        }
        if (gap > 20) {
          let _n = 4;
          heightItems = 0;
          for (let i = 0; i < this.elementSubHeight.toArray().length; i++) {
            heightItems += this.elementSubHeight.toArray()[i].nativeElement.offsetHeight;
            if ((heightItems + (i * 20)) >= heightArts) {
              _n = i + 1;
              break;
            }
          }
          gap = Math.round((heightArts - heightItems) / (_n - 1));
        }
        this.elementArtItems?.nativeElement.setAttribute('style', 'grid-gap: ' + gap + 'px; height: ' + heightArts + 'px');
      }
    } else {
      this.elementArtItems?.nativeElement.setAttribute('style', 'grid-gap: 20px; height: ' + (heightItems + 60) + 'px');
    }
  }

  ngAfterViewInit() {
    this.checkFirst = false;
  }

  ngAfterViewChecked() {
    if (this.elementArtItems && this.checkFirst == false) {
      this.checkFirst = true;
      this.treemapObserver.observe(this.elementArtItems.nativeElement);
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {
    this.currentWidth = event.target.innerWidth;
    this.elementArtItems?.nativeElement?.removeAttribute('style');
    this.render();
  }
}
