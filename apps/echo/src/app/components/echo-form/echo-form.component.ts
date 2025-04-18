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
        <div class="card">
          <div class="card-header">New Echo</div>
          <div class="card-content">
            <form nz-form [formGroup]="echoForm" (ngSubmit)="onSubmit()">
              <nz-form-item>
                <nz-form-control [nzErrorTip]="'Please input some text'">
                  <nz-textarea-count [nzMaxCharacterCount]="500">
                    <textarea
                      formControlName="text"
                      nz-input
                      rows="4"
                      placeholder="Type something here..."
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
        </div>
      </div>

      <div class="results-section">
        <div class="card">
          <div class="card-header">Results</div>
          <div class="card-content">
            <nz-list [nzDataSource]="results" [nzRenderItem]="resultItem">
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
      </div>
    </div>
  `,
  styles: [`
    .echo-container {
      display: flex;
      gap: 32px;
    }
    
    .input-section, .results-section {
      flex: 1;
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
    }
    
    .card-header {
      background: #3f51b5;
      color: white;
      padding: 16px;
      font-size: 16px;
      border-radius: 4px 4px 0 0;
    }
    
    .card-content {
      padding: 24px;
    }
    
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    textarea {
      background: #f9f9f9;
      border-radius: 4px;
      resize: none;
    }
    
    button {
      align-self: flex-end;
      min-width: 80px;
    }
    
    :host ::ng-deep .ant-list-item {
      background-color: #f9f9f9;
      border-radius: 4px;
      margin-bottom: 8px;
      padding: 16px;
    }
    
    .echo-text {
      font-size: 18px;
      margin-bottom: 8px;
    }
    
    .meta {
      display: flex;
      justify-content: space-between;
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
    }
    
    @media (max-width: 768px) {
      .echo-container {
        flex-direction: column;
      }
      
      button {
        width: 100%;
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