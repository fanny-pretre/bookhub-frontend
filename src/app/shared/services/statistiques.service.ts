import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, map, Observable, take } from 'rxjs';

export interface EmpruntResponse {
  id: number;
  message: string;
  isbn: string;
  idUtilisateur: number;
  dateEmprunt: string;
  dateRetourPrevue: string;
  idStatut: number;
}

export interface LivreDTO {
  isbn: string;
  titre: string;
  couverture: string;
  description: string;
  disponibilite: boolean;
  dateAjout: string;
  auteur: { id: number; nom: string; prenom: string };
  categories: { id: number; typeCategorie: string }[];
}

export interface StatsData {
  totalLivres: number;
  totalUtilisateurs: number;
  empruntsEnCours: number;
  empruntsEnRetard: number;
  empruntsParMois: { month: string; value: number }[];
  categories: { name: string; value: number }[];
  tauxUtilisation: number;
  dureeMoyenne: number;
  lecteursReguliers: number;
}

@Injectable({ providedIn: 'root' })
export class StatistiquesService {
  private base = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getStats(): Observable<StatsData> {
    return combineLatest({
      books: this.http.get<any>(`${this.base}/books`).pipe(take(1)),
      loans: this.http.get<any>(`${this.base}/loans`).pipe(take(1)),
      users: this.http.get<any>(`${this.base}/users`).pipe(take(1)),
    }).pipe(
      take(1),
      map(({ books, loans, users }) => {
        const livres: LivreDTO[] = books.data ?? [];
        const emprunts: EmpruntResponse[] = loans.data ?? [];
        const utilisateurs: any[] = users.data ?? [];
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // Totaux
        const totalLivres = livres.length;
        const totalUtilisateurs = utilisateurs.length;

        // Emprunts en cours = idStatut 1 ET dateRetourPrevue >= aujourd'hui
        const empruntsEnCours = emprunts.filter(
          (e) => e.idStatut === 2 && new Date(e.dateRetourPrevue) >= now
        ).length;

        // Emprunts en retard = idStatut 1 ET dateRetourPrevue < aujourd'hui
        const empruntsEnRetard = emprunts.filter(
          (e) => e.idStatut === 2 && new Date(e.dateRetourPrevue) < now
        ).length;

        // Lecteurs réguliers = utilisateurs avec 3+ emprunts
        const parUser = emprunts.reduce((acc: Record<number, number>, e) => {
          acc[e.idUtilisateur] = (acc[e.idUtilisateur] || 0) + 1;
          return acc;
        }, {});
        const lecteursReguliers = Object.values(parUser).filter((n) => n >= 3).length;

        // Emprunts par mois (5 derniers mois)
        const moisLabels = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];
        const empruntsParMois = Array.from({ length: 5 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - 4 + i, 1);
          const count = emprunts.filter((e) => {
            const ed = new Date(e.dateEmprunt);
            return (
              ed.getMonth() === d.getMonth() &&
              ed.getFullYear() === d.getFullYear()
            );
          }).length;
          return { month: moisLabels[d.getMonth()], value: count };
        });

        // Catégories populaires : croisement isbn → livre → typeCategorie
        const catCount: Record<string, number> = {};
        emprunts.forEach((e) => {
          const livre = livres.find((l) => l.isbn === e.isbn);
          livre?.categories?.forEach((cat) => {
            catCount[cat.typeCategorie] = (catCount[cat.typeCategorie] || 0) + 1;
          });
        });
        const categories = Object.entries(catCount)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        // Taux d'utilisation = livres non disponibles / total
        const livresEmpruntes = livres.filter((l) => !l.disponibilite).length;
        const tauxUtilisation = totalLivres
        ? Math.round((livresEmpruntes / totalLivres) * 100)
        : 0;
        
        // Durée moyenne en jours (dateRetourPrevue - dateEmprunt)
        const empruntsRendus = emprunts.filter((e) => e.idStatut === 2);
        const dureeMoyenne = empruntsRendus.length
          ? Math.round(
              empruntsRendus.reduce((sum, e) => {
                const diff =
                  new Date(e.dateRetourPrevue).getTime() -
                  new Date(e.dateEmprunt).getTime();
                return sum + diff / (1000 * 60 * 60 * 24);
              }, 0) / empruntsRendus.length
            )
          : 0;

        return {
          totalLivres,
          totalUtilisateurs,
          empruntsEnCours,
          empruntsEnRetard,
          empruntsParMois,
          categories,
          tauxUtilisation,
          dureeMoyenne,
          lecteursReguliers,
        };
      })
    );
  }
}