import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bar-recherche',
  imports: [FormsModule, CommonModule],
  templateUrl: './bar-recherche.html',
  styleUrl: './bar-recherche.css'
})
export class BarRecherche {

  @Input() totalContacts:number = 0;
  @Input()filteredContacts: number = 0;
  @Output() searchTermChanged = new EventEmitter<string>();

  searchValue: string = '';

}
