import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SliderDirective, SliderItem } from './slider/slider.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SliderDirective, SliderItem],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'slider-angular';
  isStart = signal(true);
  isEnd = signal(false);
  images = signal<{ height: number }[]>([]);
  firstVisible = signal(0);

  constructor() {
    const gra = function(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    for (let i = 0; i < 15; i++) {
      this.images.update(current => [...current, { height: gra(40, 80) }]);
    }
  }

  prev() {
    this.firstVisible.update(value => value - 1);
  }

  next() {
    this.firstVisible.update(value => value + 1);
  }
}
