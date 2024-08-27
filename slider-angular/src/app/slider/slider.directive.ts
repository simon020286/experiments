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
    this.element.scrollIntoView({
      block: 'start',
      inline: 'start',
      behavior: 'smooth'
    });
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
    '[style.scrollbar-width]': `'none'`,
    '[style.scroll-snap-type]': `snapType()`
  },
})
export class SliderDirective {
  private sliderElement = inject(ElementRef).nativeElement as HTMLElement;
  elements = contentChildren(SliderItem);

  isEnd = output<boolean>();
  isStart = output<boolean>();
  firstVisible = model(0);
  navigate = model<'next' | 'prev' | undefined>();

  currentElement = model<SliderItem>();
  direction = input<'horizontal' | 'vertical'>('vertical');
  
  private snapType = computed(() => this.direction() === 'horizontal' ? 'x mandatory' : 'y mandatory');
  private topLeft = computed(() => this.direction() === 'horizontal' ? 'left' : 'top');
  private scrollTopLeft = computed(() => this.direction() === 'horizontal' ? 'scrollLeft' : 'scrollTop');
  private scrollHeightWidth = computed(() => this.direction() === 'horizontal' ? 'scrollWidth' : 'scrollHeight');
  private offsetHeightWidth = computed(() => this.direction() === 'horizontal' ? 'offsetWidth' : 'offsetHeight');

  constructor() {
    effect(() => {
      const currentElement = untracked(() => this.currentElement());
      const elements = untracked(() =>  this.elements());
      if (this.firstVisible() < elements.length && elements[this.firstVisible()] !== currentElement) {
         this.elements()[this.firstVisible()].scrollIntoView();
      }
    });
  }

  @HostListener('scrollend')
  onScroll() {
    this.isStart.emit(this.calculateStart());
    this.isEnd.emit(this.calculateEnd());
    for (let index = 0; index < this.elements().length; index++) {
      const element = this.elements()[index];
      if (this.calculateDistance(element.position) <= 0) {
        this.currentElement.set(element);
        this.firstVisible.set(index);
        break;
      }
    }
  }

  calculateStart() {
    return this.sliderElement[this.scrollTopLeft()] === 0;
  }

  calculateEnd() {
    return this.sliderElement[this.scrollHeightWidth()] - this.sliderElement[this.offsetHeightWidth()] <= Math.round(this.sliderElement[this.scrollTopLeft()]);
  }

  calculateDistance(el: DOMRect) {
    return Math.ceil(this.sliderElement.getBoundingClientRect()[this.topLeft()] - el[this.topLeft()]);
  }
}
