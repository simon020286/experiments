import { Component, computed, ElementRef, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SliderDirective, SliderItem } from './slider/slider.directive';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SliderDirective, SliderItem, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'slider-angular';
  httpClient = inject(HttpClient);
  isStart = signal(true);
  isEnd = signal(false);
  images$ = this.httpClient.get<any[]>('https://fakestoreapi.com/products')
  .pipe(map(data => data.map(item => ({ src: item.image, alt: item.title }))));

  firstVisible = signal(0);
  currentItem = signal<SliderItem | undefined>(undefined);
  currentImage = computed(() => {
    return this.currentItem() ? (this.currentItem()?.element as HTMLImageElement).src : undefined;
  });

  prev() {
    this.firstVisible.update(value => value - 1);
  }

  next() {
    this.firstVisible.update(value => value + 1);
  }
}
