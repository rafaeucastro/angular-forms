import { Component, Input } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-debug',
  templateUrl: './form-debug.component.html',
  styleUrls: ['./form-debug.component.css']
})
export class FormDebugComponent {
  @Input() form?: NgForm;
  @Input() reactiveForm?: FormGroup;

  constructor() {
    
  }
}
