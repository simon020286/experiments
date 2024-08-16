import { contentChildren, Directive, effect, ElementRef, HostListener, inject, input, OnInit, output, viewChildren } from '@angular/core';

@Directive({
  selector: '[sliderItem]',
  standalone: true,
})
export class SliderItem {
  private element = inject(ElementRef).nativeElement;

  scrollIntoView() {
    this.element.scrollIntoView();
  }
}

@Directive({
  selector: '[slider]',
  standalone: true,
})
export class SliderDirective implements OnInit {
  private elRef = inject(ElementRef);
  elements = contentChildren(SliderItem);

  isEnd = output<boolean>();
  isStart = output<boolean>();
  firstVisible = input(0);

  constructor() {
    effect(() => {
      if (this.firstVisible() < this.elements().length) {
        this.elements()[this.firstVisible()].scrollIntoView();
      }
    });
  }

  ngOnInit() {
    console.log('Elements ', this.elements());
  }

  @HostListener('scroll')
  onScroll() {
    this.isStart.emit(this.calculateStart());
    this.isEnd.emit(this.calculateEnd());
  }

  calculateStart() {
    return this.elRef.nativeElement.scrollTop === 0;
  }

  calculateEnd() {
    const ul = this.elRef.nativeElement;
    return ul.scrollHeight - ul.offsetHeight <= Math.round(ul.scrollTop);
  }

}
