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
  selectedFileName: string = "Choissisez un fichier"
  errorMessage: string | null = null;

  constructor(private http: HttpClient) { }

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

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.img) {
        this.uploadContact(this.img, form.value);
      } else {
        // If no image is selected, call the dedicated method for text data
        this.submitContactData(form.value); 
      }

      this.resetForm();
      form.resetForm();

    } else {
      this.markAllAsTouched(form);
    }
  }

  private uploadContact(file: File, formData: any): void {
    // Make sure this URL matches your backend's endpoint for image uploads
    const backendUrl = 'http://localhost:3000/api/contacts'; 

    const data = new FormData();
    data.append('image', file, file.name); 
    data.append('prenom', formData.prenom);
    data.append('nom', formData.nom);
    data.append('numero', formData.numero);
    data.append('type', formData.type);
    data.append('email', formData.email);

    // Call the HttpClient to send the POST request
    this.http.post(backendUrl, data).subscribe({
      next: (response) => {
        console.log('Contact created successfully:', response);
        alert('Contact créé avec succès!'); // Provide user feedback
      },
      error: (error) => {
        console.error('Error creating contact:', error);
        alert('Erreur lors de la création du contact. Veuillez réessayer.'); // Provide user feedback
      }
    });
  }

  // New method to handle submission when no image is provided
  private submitContactData(formData: any): void {
    // Make sure this URL matches your backend's endpoint for no-image uploads
    const backendUrl = 'http://localhost:3000/api/contacts-no-image'; 

    this.http.post(backendUrl, formData).subscribe({
      next: (response) => {
        console.log('Contact data submitted without image:', response);
        alert('Contact créé avec succès (sans image)!'); 
      },
      error: (error) => {
        console.error('Error submitting contact data without image:', error);
        alert('Erreur lors de la création du contact (sans image). Veuillez réessayer.');
      }
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
    this.errorMessage = null; 
    const fileInput = document.getElementById('img') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}