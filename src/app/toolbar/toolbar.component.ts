import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Macronutrients } from 'src/common/models/fatfacts.model';
import { PlanningDetails } from 'src/common/models/planning.model';
import { getKcal, getMacroPct } from 'src/common/models/thermodynamics';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  targetpct: Macronutrients = { carbs: 0, prots: 0, fats: 0, kcal: 0 };
  private _ckName = 'toolbar';

  @Output()
  get formChange() {
    return this.form.valueChanges;
  }

  form: FormGroup;
  constructor(private _fb: FormBuilder, private _cs: CookieService) {
    let initial = {
      schedule: {
        mealForDays: 7,
        mealsInDay: 5,
      },
      target: {
        carbs: 231,
        prots: 237,
        fats: 69,
        kcal: 2500,
      },
      grouping: {
        meal: false,
        source: false,
        name: false,
      },
    };
    if (this._cs.check(this._ckName)) {
      initial = JSON.parse(this._cs.get(this._ckName));
    }
    this.form = this._generateForm(initial);

    this.form.valueChanges.subscribe({
      next: () => {
        this._cs.set(this._ckName, JSON.stringify(this.form.value), 365);

        const kcal = getKcal(this.form.value.target);
        this.targetpct = getMacroPct(this.form.value.target, kcal);

        this.form.controls['target']
          .get('kcal')
          ?.patchValue(kcal, { emitEvent: false });

        console.log('New form cookie');
      },
      error: () => {},
    });
  }

  ngOnInit() {
    console.log();
      this.form.controls['grouping'].enable();
  }

  pctify(value:number){
    return (value * 100).toFixed(1) + '%';
  }

  _generateForm(initial: PlanningDetails) {
    return this._fb.group({
      schedule: this._fb.group({
        mealForDays: [initial.schedule.mealForDays],
        mealsInDay: [initial.schedule.mealsInDay],
      }),
      target: this._fb.group({
        kcal: [initial.target.kcal],
        carbs: [initial.target.carbs],
        prots: [initial.target.prots],
        fats: [initial.target.fats],
      }),
      grouping: this._fb.group({
        meal: [initial.grouping.meal],
        source: [initial.grouping.source],
        name: [initial.grouping.name],
      }),
    });
  }
}
