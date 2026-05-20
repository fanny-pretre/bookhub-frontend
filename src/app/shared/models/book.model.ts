// Interface représentant un auteur, correspond à AuteurDTO côté Spring
export interface Auteur {
  id: number;
  nom: string;
  prenom: string;
}

// Interface représentant une catégorie, correspond à CategorieDTO côté Spring
export interface Categorie {
  id: number;
  typeCategorie: string;
}

// Interface principale représentant un livre, correspond au LivreDTO Java
export interface Book {
  isbn: string;
  titre: string;
  couverture: string;
  description: string;
  disponibilite: boolean;
  dateAjout: string;
  auteur: Auteur;
  categories: Categorie[];
  rating?: number;
}

// Format de la réponse paginée Spring Boot Page<T>
export interface BooksPage {
  content: Book[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// Wrapper générique retourné par le back pour toutes ses réponses
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Paramètres de recherche pour GET /api/books/search
export interface SearchParams {
  search?: string;
  category?: string;
  available?: boolean;
  page?: number;
  sort?: string;
}

// Payload envoyé au back pour créer ou modifier un livre
// Séparé de Book car le back attend un format légèrement différent
export interface BookFormData {
  isbn: string;
  titre: string;
  description: string;
  couverture: string;
  disponibilite: boolean;
  dateAjout?: string;
  auteur: {
    nom: string;
    prenom: string;
  };
  categories: Categorie[]; // On envoie les noms, le back fait le mapping vers les entités
}
