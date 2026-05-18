// Interface représentant un auteur, correspond à AuteurDTO côté Spring
export interface Auteur {
  id: number;
  nom: string;
  prenom: string;
}

// Interface représentant une catégorie, correspond à CategorieDTO côté Spring
export interface Categorie {
  id: number;
  typeCategorie: string; // ex: "Roman", "Fantasy", "Policier"...
}

// Interface principale représentant un livre
// Correspond aux champs du LivreDTO Java
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

// Format de la réponse paginée de Spring Boot Page<T>
// Retourné par GET /api/books/search
export interface BooksPage {
  content: Book[]; // Les livres de la page courante
  totalElements: number; // Nombre total de livres en base (toutes pages confondues)
  totalPages: number; // Nombre total de pages
  number: number; // Page courante
  size: number; // Nombre d'éléments par page (20)
}

// Wrapper générique utilisé par le back pour toutes ses réponses
export interface ApiResponse<T> {
  success: boolean; // true si la requête a réussi
  message: string;
  data: T;
}

// Paramètres de recherche envoyés à GET /api/books/search
// Chaque champ correspond à un @RequestParam côté Spring
export interface SearchParams {
  search?: string;      // titre, auteur, ISBN
  category?: string;    // typeCategorie
  available?: boolean;  // disponibilite
  page?: number;        // commence à 0 côté Spring
  sort?: string;        // ex: "title,asc"
}
