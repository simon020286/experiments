import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SliderDirective, SliderItem } from './slider/slider.directive';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SliderDirective, SliderItem],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'slider-angular';
  httpClient = inject(HttpClient);
  isStart = signal(true);
  isEnd = signal(false);
  images = signal<{ src: string, alt: string }[]>([]);
  firstVisible = signal(0);

  constructor() {
    //const gra = function(min: number, max: number) {
    //  return Math.random() * (max - min) + min;
    //}

    //for (let i = 0; i < 15; i++) {
    //  this.images.update(current => [...current, { height: gra(40, 80) }]);
    //}
    this.httpClient.get<any[]>('https://fakestoreapi.com/products')
      .subscribe(data => {
        this.images.set(data.map(item => ({ src: item.image, alt: item.title })));
      });
  }

  prev() {
    this.firstVisible.update(value => value - 1);
  }

  next() {
    this.firstVisible.update(value => value + 1);
  }
}
