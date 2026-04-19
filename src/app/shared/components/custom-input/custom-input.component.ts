import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() icon = '';
  @Input() errorMessage = '';
  @Input() hasError = false;

  value = '';
  showPassword = false;
  isPasswordType = false;

  private onChange = (val: any) => {};
  private onTouched = () => {};

  ngOnInit(): void {
    this.isPasswordType = this.type === 'password';
  }

  onInput(event: any): void {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    this.type = this.showPassword ? 'text' : 'password';
  }

  writeValue(val: any): void {
    this.value = val || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}