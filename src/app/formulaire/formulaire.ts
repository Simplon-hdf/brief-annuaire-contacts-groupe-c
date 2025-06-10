import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
  selectedFileName: string = "Choissisez un fichier";
  imageRequiredError: string | null = null; 
  fileTypeError: string | null = null; 

  constructor(private http: HttpClient) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.imageRequiredError = null; 
    this.fileTypeError = null; 

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ["image/png", "image/jpeg"]; 

      if (allowedTypes.includes(file.type)) {
        this.img = file;
        this.selectedFileName = file.name;
      } else {
        this.img = null;
        this.selectedFileName = "Choisir un fichier";
        this.fileTypeError = "Seuls les fichiers PNG et JPG/JPEG sont acceptés."; 
        input.value = ''; 
      }
    } else {
      this.img = null;
      this.selectedFileName = "Choisir un fichier";
    }
  }

  onSubmit(form: NgForm): void {
    this.imageRequiredError = null; 

    if (!this.img) {
      this.imageRequiredError = "Une photo est obligatoire.";
    }

    if (form.valid && this.img) {
      this.uploadContact(this.img, form.value);
      this.resetForm();
      form.resetForm();
    } else {
      this.markAllAsTouched(form);
    }
  }

  private uploadContact(file: File, formData: any): void {
    const backendUrl = 'http://localhost:3000/api/contacts'; 

    const data = new FormData();
    data.append('image', file, file.name); 
    data.append('prenom', formData.prenom);
    data.append('nom', formData.nom);
    data.append('numero', formData.numero);
    data.append('type', formData.type);
    data.append('email', formData.email);

    this.http.post(backendUrl, data).subscribe({
      next: (response) => {},
      error: (error) => {}
    });
  }

  private markAllAsTouched(form: NgForm): void {
    Object.keys(form.controls).forEach(field => {
      const control = form.controls[field];
      control.markAsTouched({ onlySelf: true });
    });
  }

  onReset(form: NgForm): void {
    this.resetForm();
    form.resetForm();
  }

  private resetForm(): void {
    this.prenom = "";
    this.nom = "";
    this.numero = "";
    this.type = "";
    this.email = "";
    this.img = null;
    this.selectedFileName = "Choissisez un fichier"; 
    this.imageRequiredError = null; 
    this.fileTypeError = null; 
    const fileInput = document.getElementById('img') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}