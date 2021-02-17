import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public isDarkMode: boolean = false;

  constructor(
    public auth: AuthService,
    private overlayContainer: OverlayContainer
  ) {}

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('theme') == 'dark' ? true : false;
    if (!this.isDarkMode) {
      this.overlayContainer
        .getContainerElement()
        .classList.remove('dark-theme-mode');
    }
  }

  handleSelectedMode() {
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    if (!this.isDarkMode) {
      this.overlayContainer
        .getContainerElement()
        .classList.remove('dark-theme-mode');
    } else {
      this.overlayContainer
        .getContainerElement()
        .classList.add('dark-theme-mode');
    }
  }
}
