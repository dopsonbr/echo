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
        <p>Enter text below and see it echoed back with performance metrics</p>
      </header>
      <main>
        <app-echo-form></app-echo-form>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    
    p {
      color: rgba(0, 0, 0, 0.65);
    }
  `]
})
export class AppComponent {}
