import { computed, contentChildren, Directive, effect, ElementRef, HostListener, inject, input, model, OnInit, output, untracked, viewChildren } from '@angular/core';

@Directive({
  selector: '[sliderItem]',
  standalone: true,
  host: {
    'style': 'scroll-snap-align: start; box-sizing: border-box'
  }
})
export class SliderItem {
  element = inject(ElementRef).nativeElement as HTMLElement;

  scrollIntoView() {
    this.element.scrollIntoView();
  }

  get position() {
    return this.element.getBoundingClientRect();
  }
}

@Directive({
  selector: '[slider]',
  standalone: true,
  host: {
    '[style.overflow]': `'scroll'`, 
    '[style.scroll-snap-type]': `snapType()`
  },
})
export class SliderDirective {
  private elRef = inject(ElementRef);
  elements = contentChildren(SliderItem);

  isEnd = output<boolean>();
  isStart = output<boolean>();
  firstVisible = model(0);
  currentElement = model<SliderItem>();
  direction = input<'horizontal' | 'vertical'>('vertical');
  snapType = computed(() => this.direction() === 'horizontal' ? 'x mandatory' : 'y mandatory');

  constructor() {
    effect(() => {
      // const currentElement = untracked(() => this.currentElement());
      const elements = untracked(() =>  this.elements());
      if (this.firstVisible() < elements.length) {
        this.elements()[this.firstVisible()].scrollIntoView();
        // this.currentElement.set(this.elements()[this.firstVisible()]);
      }
    }, {
      allowSignalWrites: true
    });
  }

  @HostListener('scroll')
  onScroll() {
    this.isStart.emit(this.calculateStart());
    this.isEnd.emit(this.calculateEnd());
    const firstItem = this.elements().find(item => this.calculateDistance(item.position) <= 0);
    for (let index = 0; index < this.elements().length; index++) {
      const element = this.elements()[index];
      if (element.position.top >= 0) {
        this.currentElement.set(firstItem);
        //this.firstVisible.set(index);
        break;
      }
    }
    // console.log('SCROLL');
    // console.log(firstItem?.element);
  }

  calculateStart() {
    return this.elRef.nativeElement.scrollTop === 0;
  }

  calculateEnd() {
    const ul = this.elRef.nativeElement;
    return ul.scrollHeight - ul.offsetHeight <= Math.round(ul.scrollTop);
  }

  private calculateDistance(el: DOMRect) {
    return Math.ceil(this.elRef.nativeElement.getBoundingClientRect().top - el.top);
  }
}
