import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { FormValidation } from '../form-validations';

@Component({
  selector: 'error-msg',
  templateUrl: './error-msg.component.html',
  styleUrls: ['./error-msg.component.css']
})
export class ErrorMsgComponent {
  @Input() control?: AbstractControl;
  @Input() field?: string;

  constructor() { }

  get errorMessage() {
    console.log(this.control?.hasError('required'));
    if(this.control?.touched) {
      for(const propertyName in this.control?.errors) {
        return FormValidation.getErrorMessage(this.field!, this.control.errors![propertyName]);
      }
    }
    return null;
  }
}
