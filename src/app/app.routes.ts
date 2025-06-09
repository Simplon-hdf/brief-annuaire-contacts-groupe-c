import { Routes } from '@angular/router';
import { Formulaire } from './formulaire/formulaire';
import { Home } from "./home/home";


export const routes: Routes = [
    { path: "", component: Home},
    { path: "accueil", component: Home},
    { path:"formulaire", component: Formulaire}
];
