import { Component, Input} from '@angular/core';
import { CommonModule,} from '@angular/common';


interface Contact {
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  addresse: string;
  type: 'client' | 'fournisseur';
  imageUrl?: string;
}

@Component({
  selector: 'app-carte-contact',
  imports: [CommonModule],
  templateUrl: './carte-contact.html',
  styleUrl: './carte-contact.css'
})
export class CarteContact {
  @Input() contact: Contact | undefined;
}
