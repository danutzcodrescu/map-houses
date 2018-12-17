import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-filter-price',
  templateUrl: './filter-price.component.html',
  styleUrls: ['./filter-price.component.scss']
})
export class FilterPriceComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit() {
    const prices = JSON.parse(this.localStorage.get('priceRange')) || {
      min: 200_000,
      max: 500_000
    };
    this.form = this.fb.group({
      min: [prices.min, [Validators.min(200_000)]],
      max: [prices.max, [Validators.max(500_000)]]
    });
    this.updateValidators();
  }

  updateValidators() {
    const min = this.form.get('min');
    const max = this.form.get('max');
    this.form.valueChanges.subscribe(() => {
      min.setValidators(Validators.max(max.value));
      max.setValidators(Validators.min(min.value));
    });
  }

  submitHandler() {
    this.localStorage.set('priceRange', JSON.stringify(this.form.value));
  }
}
