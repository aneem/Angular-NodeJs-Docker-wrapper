import { Router, Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, Renderer, NgZone, OnDestroy } from '@angular/core';

@Component({
  selector: 'xspinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit, OnDestroy {
  enabled = false;
  body = document.getElementsByTagName('body')[0];
  routerEventSubscriber;

  @ViewChild('element') element: ElementRef;

  constructor(private router: Router,
    private ngZone: NgZone,
    private renderer: Renderer) {
    this.routerEventSubscriber = router.events.subscribe((event: Event) => {
      this._navigationInterceptor(event);
    });
  }

  ngOnInit() {
  }
  // Shows and hides the loading spinner during RouterEvent changes
  private _navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      // We wanna run this function outside of Angular's zone to
      // bypass change detection
      this._showSpinner();
    }
    if (event instanceof NavigationEnd) {
      this._hideSpinner();
    }
    // Set loading state to false in both of the below events to
    // hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this._hideSpinner();
    }
    if (event instanceof NavigationError) {
      this._hideSpinner();
    }
  }

  private _showSpinner(): void {
    this.ngZone.runOutsideAngular(() => {
      // For simplicity we are going to turn opacity on / off
      // you could add/remove a class for more advanced styling
      // and enter/leave animation of the spinner
      this.body.classList.add('no-scroll');
      this.renderer.setElementClass(this.element.nativeElement, 'show', true);

      // this.renderer.setElementStyle(
      //   this.element.nativeElement,
      //   'display',
      //   'inherit'
      // )
    });

  }

  private _hideSpinner(): void {
    // We wanna run this function outside of Angular's zone to
    // bypass change detection,
    this.ngZone.runOutsideAngular(() => {
      // For simplicity we are going to turn opacity on / off
      // you could add/remove a class for more advanced styling
      // and enter/leave animation of the spinner
      this.body.classList.remove('no-scroll');
      this.renderer.setElementClass(this.element.nativeElement, 'show', false);
    });
  }

  ngOnDestroy() {
    this.routerEventSubscriber.unsubscribe();
  }
}
