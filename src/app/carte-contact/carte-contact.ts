import { Component, Input} from '@angular/core';
import { CommonModule,} from '@angular/common';
import { Contact } from '../contact';

@Component({
  selector: 'app-carte-contact',
  imports: [CommonModule],
  templateUrl: './carte-contact.html',
  styleUrl: './carte-contact.css'
})
export class CarteContact {
  @Input() contact!: Contact;
  getImageUrl(image_path: string): string {
    return `http://localhost:3000${image_path}`;
  }
}