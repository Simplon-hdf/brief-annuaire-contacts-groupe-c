import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { CarteContact } from "./carte-contact/carte-contact";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, CarteContact],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'brief-annuaire-contacts-groupe-c';
}
