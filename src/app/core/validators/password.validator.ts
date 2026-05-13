// AbstractControl est le type générique d'un champ de formulaire
// ValidationErrors est le type retourné quand il y a des erreurs : { clé: valeur }
// ValidatorFn est le type d'une fonction de validation
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// On exporte une fonction qui retourne un validateur
export function passwordStrengthValidator(): ValidatorFn {
  // La fonction retournée reçoit le contrôle à valider et retourne null (valide) ou un objet d'erreurs
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';

    // Si le champ est vide, on ne génère pas d'erreur ici
    // Validators.required s'en chargera séparément
    if (!value) return null;

    // On collecte toutes les règles non respectées
    const errors: string[] = [];

    if (value.length < 12) errors.push('12 caractères minimum');
    if (!/[A-Z]/.test(value)) errors.push('1 majuscule requise');
    if (!/[a-z]/.test(value)) errors.push('1 minuscule requise');
    if (!/[0-9]/.test(value)) errors.push('1 chiffre requis');
    if (!/[^A-Za-z0-9]/.test(value)) errors.push('1 caractère spécial requis');

    // S'il y a des erreurs, on retourne un objet avec la clé 'passwordStrength'
    // Cette clé est celle qu'on utilise dans le template : password.hasError('passwordStrength')
    // S'il n'y a pas d'erreur, on retourne null = champ valide
    return errors.length > 0 ? { passwordStrength: errors } : null;
  };
}
