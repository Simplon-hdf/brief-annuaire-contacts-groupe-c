import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../contact';
import { ContactService } from '../service/contact';
import { CarteContact } from '../carte-contact/carte-contact';


@Component({
 selector: 'app-annuaire',
 imports: [CommonModule, CarteContact],
 templateUrl: './annuaire.html',
 styleUrl: './annuaire.css'
})
export class Annuaire implements OnInit{
 contacts: Contact[] = [];
 isLoading: boolean = false;


 constructor (private contactService: ContactService) { }


 ngOnInit(): void {
   this.loadContacts();
 }


 loadContacts(): void {
   this.isLoading = true;
   this.contactService.getContacts().subscribe({
     next: (data) => {
       this.contacts = data;
       this.isLoading = false;
     },
     error: (err) => {
       console.error('Error fetching contacts:', err);
       this.isLoading = false;
     }
   });
 }
}