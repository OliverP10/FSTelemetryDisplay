import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, FormControl, Validators, Form } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Post } from '../../Models/interfaces/Display';
import { catchError, Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faTimes, faCirclePlus, faBars } from '@fortawesome/free-solid-svg-icons';
import { SettingsService } from 'src/app/services/settings.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-create-display-form',
    templateUrl: './create-display-form.component.html',
    styleUrls: ['./create-display-form.component.css']
})
export class CreateDisplayFormComponent implements OnInit {
    faTimes = faTimes;
    faCirclePlus = faCirclePlus;
    faBars = faBars;

    readonly URL = environment.ROOT_URL + ':4000';
    graphForm: UntypedFormGroup;
    graphDatalabels: UntypedFormArray = new UntypedFormArray([]);
    guageForm: UntypedFormGroup;
    guageDatalabels: UntypedFormArray = new UntypedFormArray([]);

    majorTicks: UntypedFormArray = new UntypedFormArray([]);
    highlights: UntypedFormArray = new UntypedFormArray([]);

    type: string = 'graph';
    recivedLabels: string[] = [];

    constructor(private http: HttpClient, private fb: UntypedFormBuilder, private snackBar: MatSnackBar, private router: Router, private settingsService: SettingsService) {
        this.settingsService.setTitle('Create Display');
        this.graphForm = this.fb.group({
            type: ['', [Validators.required]],
            title: ['', [Validators.required, Validators.minLength(3)]],
            colSize: ['', [Validators.required, Validators.min(1), Validators.max(4)]],
            rowSize: ['', [Validators.required, Validators.min(1), Validators.max(4)]],
            dataLabels: this.graphDatalabels
        });

        this.guageForm = this.fb.group({
            type: ['', [Validators.required]],
            title: ['', [Validators.required, Validators.minLength(3)]],
            colSize: ['', [Validators.required, Validators.min(1), Validators.max(4)]],
            rowSize: ['', [Validators.required, Validators.min(1), Validators.max(4)]],
            units: ['', [Validators.required]],
            minValue: ['', [Validators.required]],
            maxValue: ['', [Validators.required]],
            majorTicks: this.majorTicks,
            minorTicks: ['', [Validators.required]],
            highlights: this.highlights,
            dataLabels: this.guageDatalabels
        });
    }

    ngOnInit(): void {
        this.getDataLabels();
    }

    loadType(event: any) {
        this.type = event.value;
        this.graphForm.get('type')?.setValue(this.type);
        this.guageForm.get('type')?.setValue(this.type);
    }

    getDataLabels() {
        return; //needs updating
        this.http.get<Post>(this.URL + '/datalabels').subscribe((data: Post) => {
            this.showDatalabels(data.datalabels);
        });
    }

    showDatalabels(datalabels: string[]) {
        this.recivedLabels = datalabels;
        for (let item of datalabels) {
            this.graphDatalabels.push(
                this.fb.group({
                    [item]: ['', []]
                })
            );

            this.guageDatalabels.push(
                this.fb.group({
                    [item]: ['', []]
                })
            );
        }
    }

    sucessResponseHandler(response: any) {
        //this.graphForm.reset();
        //this.guageForm.reset();
        this.snackBar.open('Success!', 'Dismiss', { duration: 3000 });
    }

    errorResponseHandler(response: any) {
        this.snackBar.open(response.error.errors[0].msg, 'Dismiss');
    }

    async submitFormGraph() {
        console.log(this.graphForm.value);
        return this.http.post<any>(this.URL + '/create-display-graph', this.graphForm.value).subscribe({
            next: (v) => this.sucessResponseHandler(v),
            error: (e) => this.errorResponseHandler(e)
        });
    }

    async submitFormGuage() {
        return this.http.post<any>(this.URL + '/create-display-guage', this.guageForm.value).subscribe({
            next: (v) => this.sucessResponseHandler(v),
            error: (e) => this.errorResponseHandler(e)
        });
    }

    guageTextarea(event: any) {}

    addMajorTick() {
        this.majorTicks.push(
            this.fb.group({
                tick: ['', [Validators.required]]
            })
        );
    }

    removeMajorTick(i: number) {
        this.majorTicks.removeAt(i);
    }

    addHighlight() {
        this.highlights.push(
            this.fb.group({
                from: ['', [Validators.required]],
                to: ['', [Validators.required]],
                color: ['', [Validators.required]]
            })
        );
    }

    removeHighlight(i: number) {
        this.highlights.removeAt(i);
    }

    toggleSideBar() {
        this.settingsService.toggleSidebar();
    }

    get graphLabelsFormArray() {
        return this.graphForm.controls['dataLabels'] as UntypedFormArray;
    }

    get graphType() {
        return this.graphForm.get('type');
    }

    get graphTitle() {
        return this.graphForm.get('title');
    }

    get graphWidth() {
        return this.graphForm.get('colSize');
    }

    get graphHeight() {
        return this.graphForm.get('rowSize');
    }

    get guageLabelsFormArray() {
        return this.guageForm.controls['dataLabels'] as UntypedFormArray;
    }

    get guageType() {
        return this.guageForm.get('type');
    }

    get guageTitle() {
        return this.guageForm.get('title');
    }

    get guageWidth() {
        return this.guageForm.get('colSize');
    }

    get guageHeight() {
        return this.guageForm.get('rowSize');
    }

    get guageUnits() {
        return this.guageForm.get('units');
    }

    get guageMinValue() {
        return this.guageForm.get('minValue');
    }

    get guageMaxValue() {
        return this.guageForm.get('maxValue');
    }

    get guageMajorTicks(): UntypedFormArray {
        return this.guageForm.controls['majorTicks'] as UntypedFormArray;
    }

    get guageMinorticks() {
        return this.guageForm.get('minorTicks');
    }

    get guageHighlights() {
        return this.guageForm.controls['highlights'] as UntypedFormArray;
    }
}
