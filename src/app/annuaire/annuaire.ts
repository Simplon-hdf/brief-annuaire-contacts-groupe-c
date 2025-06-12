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
  allContacts:Contact[] = [];
  isLoading: boolean = false;
  searchTerm: string = '';


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
       this.allContacts = data;
     },
     error: (err) => {
       console.error('Error fetching contacts:', err);
       this.isLoading = false;
     }
   });
 }

 onSearchTermChanged(searchTerm: string): void {
  this.searchTerm = searchTerm;
  this.filterContacts();
}

private filterContacts(): void {
  if (!this.searchTerm || this.searchTerm.trim() === '') {
    this.contacts = [...this.allContacts];
  } else {
    const term = this.searchTerm.toLowerCase().trim();
    this.contacts = this.allContacts.filter(contact => 
      contact.prenom?.toLowerCase().includes(term) ||
      contact.nom?.toLowerCase().includes(term) ||
      contact.email?.toLowerCase().includes(term) ||
      contact.numero?.includes(term) ||
      contact.type?.toLowerCase().includes(term)
    );
  }
}

clearSearch(): void{
  this.searchTerm = '';
  this.contacts = [...this.allContacts];
}

trackByContactId(index: number, contact: Contact): any {
  return contact.id ||index;
}


}