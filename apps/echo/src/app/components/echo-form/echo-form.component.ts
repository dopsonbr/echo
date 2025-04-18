import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';

import { EchoService, EchoResponse } from '../../services/echo.service';

@Component({
  standalone: true,
  selector: 'app-echo-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzListModule,
    NzMessageModule
  ],
  template: `
    <div class="echo-container">
      <div class="input-section">
        <form nz-form [formGroup]="echoForm" (ngSubmit)="onSubmit()">
          <nz-form-item>
            <nz-form-control [nzErrorTip]="'Please input some text'">
              <nz-textarea-count [nzMaxCharacterCount]="500">
                <textarea
                  formControlName="text"
                  nz-input
                  rows="4"
                  placeholder="Enter text to echo..."
                  [maxLength]="500"
                ></textarea>
              </nz-textarea-count>
            </nz-form-control>
          </nz-form-item>
          <button
            nz-button
            nzType="primary"
            [nzLoading]="isSubmitting"
            [disabled]="!echoForm.valid"
          >
            SUBMIT
          </button>
        </form>
      </div>

      <div class="results-section">
        <h3>Results</h3>
        <nz-list [nzDataSource]="results" [nzRenderItem]="resultItem" [nzBordered]="true">
          <ng-template #resultItem let-item>
            <nz-list-item>
              <div class="result-item">
                <div class="echo-text">{{ item.echo }}</div>
                <div class="meta">
                  <span>Processing Time: {{ item.processingTime }}ms</span>
                  <span>{{ item.timestamp | date:'medium' }}</span>
                </div>
              </div>
            </nz-list-item>
          </ng-template>
        </nz-list>
      </div>
    </div>
  `,
  styles: [`
    .echo-container {
      display: flex;
      gap: 2rem;
      padding: 2rem;
    }
    
    .input-section, .results-section {
      flex: 1;
    }
    
    .input-section form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .result-item {
      width: 100%;
    }
    
    .echo-text {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }
    
    .meta {
      display: flex;
      justify-content: space-between;
      color: rgba(0, 0, 0, 0.45);
      font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
      .echo-container {
        flex-direction: column;
      }
    }
  `]
})
export class EchoFormComponent {
  echoForm: FormGroup;
  isSubmitting = false;
  results: (EchoResponse & { processingTime: number })[] = [];

  constructor(
    private fb: FormBuilder,
    private echoService: EchoService,
    private message: NzMessageService
  ) {
    this.echoForm = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onSubmit() {
    if (this.echoForm.valid) {
      this.isSubmitting = true;
      const startTime = performance.now();
      
      this.echoService.echo(this.echoForm.value.text).subscribe({
        next: (response) => {
          const processingTime = Math.round(performance.now() - startTime);
          this.results = [{ ...response, processingTime }, ...this.results];
          this.echoForm.reset();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.message.error('Failed to echo text. Please try again.');
          this.isSubmitting = false;
        }
      });
    }
  }
} 