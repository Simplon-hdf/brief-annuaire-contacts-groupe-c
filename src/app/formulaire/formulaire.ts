import { Component } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './formulaire.html',
  styleUrl: './formulaire.css'
})
export class Formulaire {
  prenom: string = "";
  nom: string = "";
  numero: string = "";
  type: string = "";
  email: string = "";
  img: File | null = null;

  onSubmit(): void {
    this.email = "";
    this.prenom = "";
    this.nom = "";
    this.numero= "";
    this.img = null;
    this.type = "";
  }
}
