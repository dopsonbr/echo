import { Component } from '@angular/core';
import { EchoFormComponent } from './components/echo-form/echo-form.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [EchoFormComponent],
  template: `
    <div class="app-container">
      <header>
        <h1>Echo App</h1>
      </header>
      <main>
        <app-echo-form></app-echo-form>
      </main>
      <footer>
        <p>© 2025 Echo App - Built with Angular and Express</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    header {
      background: #3f51b5;
      padding: 16px;
      text-align: center;
      margin-bottom: 32px;
    }
    
    h1 {
      color: white;
      font-size: 32px;
      margin: 0;
    }
    
    main {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 32px;
      width: 100%;
      box-sizing: border-box;
    }
    
    footer {
      background: #3f51b5;
      padding: 16px;
      text-align: center;
      margin-top: 32px;
    }
    
    footer p {
      color: white;
      margin: 0;
      font-size: 14px;
    }
  `]
})
export class AppComponent {}
