import { Component, NgModule } from '@angular/core'; 
import { FormsModule, NgModel } from '@angular/forms'; 
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
  selectedFileName: string = "Choissisez un fichier"
  errorMessage: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ["image/png", "image/jpeg"]; 

      if (allowedTypes.includes(file.type)) {
        this.img = file;
        this.selectedFileName = file.name;
        this.errorMessage = null; 
      } else {
        this.img = null;
        this.selectedFileName = "Choisir un fichier";
        this.errorMessage = "Seuls les fichiers PNG et JPG/JPEG sont acceptés."; 
        input.value = ''; 
      }
    } else {
      this.img = null;
      this.selectedFileName = "Choisir un fichier";
      this.errorMessage = null;
    }
  }

  onSubmit(): void {
    this.resetForm();
  }

  clearError(): void {
    this.errorMessage = null;
  }

  onReset(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.prenom = "";
    this.nom = "";
    this.numero = "";
    this.type = "";
    this.email = "";
    this.img = null;
    this.selectedFileName = "Choissisez un fichier"; 
    this.errorMessage = null; 
    const fileInput = document.getElementById('img') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
