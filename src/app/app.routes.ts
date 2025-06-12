import { Routes } from '@angular/router';
import { Formulaire } from './formulaire/formulaire';
import { Home } from "./home/home";
import { Annuaire } from './annuaire/annuaire';


export const routes: Routes = [
    { path: "", component: Home},
    { path: "accueil", component: Home},
    { path:"formulaire", component: Formulaire},
    { path: "annuaire", component: Annuaire},
];
