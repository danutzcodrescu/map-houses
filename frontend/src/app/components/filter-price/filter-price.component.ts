import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const ADJUST_PRICES = gql`
  mutation AdjustPrices($min: string!, $max: string) {
    adjustPriceRange(min: $min, max: $max) @client
  }
`;

@Component({
  selector: 'app-filter-price',
  templateUrl: './filter-price.component.html',
  styleUrls: ['./filter-price.component.scss']
})
export class FilterPriceComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private localStorage: LocalStorageService,
    private apollo: Apollo
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
    this.apollo
      .mutate({
        mutation: ADJUST_PRICES,
        variables: {
          min: this.form.value.min,
          max: this.form.value.max
        }
      })
      .subscribe();
  }
}
