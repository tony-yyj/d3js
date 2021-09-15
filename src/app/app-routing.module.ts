import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ChinaComponent} from './china/china.component';
import {ProvinceComponent} from './province/province.component';


const routes: Routes = [
    {
        path: 'china',
        component: ChinaComponent,
    },
    {
        path: 'province',
        component: ProvinceComponent,
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'china'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
