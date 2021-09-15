import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ChinaComponent} from './china/china.component';
import {ProvinceComponent} from './province/province.component';

@NgModule({
    declarations: [
        AppComponent,
        ChinaComponent,
        ProvinceComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
