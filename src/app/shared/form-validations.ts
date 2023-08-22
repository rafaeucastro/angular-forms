import { FormArray, FormControl, FormGroup } from "@angular/forms";

export class FormValidation {
  static requiredMinCheckBox(min = 1) {
    const validator = (formArray: FormArray) => {
      const totalChecked = formArray.controls
        .map((control) => control.value)
        .reduce((accumulator, current) => current ? accumulator + current : accumulator);

      return totalChecked >= min ? null : { required: true };
    }

    return validator;
  }

  static cepValidator(control: FormControl) {

    const cep = control.value;
    if (cep && cep !== '') {
      const validaCep = RegExp('\^[0-9]{8}\$');
      return validaCep.test(cep) ? null : { cepInvalido: true };
    }
    return null;
  }

  static equalsTo(otherField: string) {

    const validator = (formControl: FormControl) => {
      if (!otherField) {
        throw new Error('É necessário informar um campo!');
      }

      if (!formControl.root || !(<FormGroup>formControl.root).controls) {
        return null;
      }

      const field = formControl.root.get(otherField);

      if (!field) {
        throw new Error('É necessário informar um campo válido!');
      }

      if (formControl.value !== field?.value) {
        return { equalsTo: otherField };
      }

      return null;
    };

    return validator;
  }

  static getErrorMessage(field: string, validatorName: string, validatorValue?: number) {
    const config: {[chave: string]: string} = {
      'required': `${field} é obrigatório!`,
      'minlength': `${field} precisa ter no mínimo ${validatorValue} caracteres`,
      'maxlength': `${field} precisa ter no máximo ${validatorValue} caracteres`,
      'cepInvalido': `CEP invalido!`,
    };

    return config[validatorName];
  }
}