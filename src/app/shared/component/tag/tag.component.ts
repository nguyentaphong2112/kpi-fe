import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent {
  @Input() tags = ['Unremovable', 'Tag 2', 'Tag 3'];
  @Output() removed = new EventEmitter<boolean>();
  inputVisible = false;
  inputValue = '';
  @Input() remove = true;
  @Input() showValue = '';
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  handleClose(removedTag): void {
    //this.tags = this.tags.filter(tag => tag !== removedTag);
    let index = this.tags.indexOf(removedTag);
    this.removed.emit(true);
    this.tags.splice(index, 1);
  }

  sliceTagName(tag): string {
    let isLongTag;
    let value;
    if (!this.showValue || this.showValue === '') {
      isLongTag = tag?.length > 20;
      value = tag;
    } else {
      isLongTag = tag[this.showValue]?.length > 20;
      value = tag[this.showValue];
    }
    return isLongTag ? `${value.slice(0, 20)}...` : value;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.tags = [...this.tags, this.inputValue];
    }
    this.inputValue = '';
    this.inputVisible = false;
  }
}
