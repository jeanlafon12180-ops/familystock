# FamilyStock — Feuille de route

Dernière mise à jour : 30 octobre 2026

## État du projet

- Version de travail : v0.1.2 (nettoyage des données de démonstration)
- Branche : `main`
- Déploiement : à vérifier après chaque mise à jour.
- Important : le catalogue est actuellement enregistré dans le stockage local du navigateur. Les données ne sont pas synchronisées entre les appareils et ne constituent pas encore une base familiale partagée.

## v0.1.2 — Nettoyage des données de démonstration

- [x] Retirer les cinq livres/jeux fictifs et les emprunts d'exemple.
- [x] Ne plus afficher trois membres inventés ; compteur fondé sur les demandes approuvées enregistrées localement.
- [x] Conserver uniquement le vidéoprojecteur déclaré par le propriétaire comme élément initial.
- [ ] Déplacer les membres et les emprunts vers un stockage partagé et fiable.

## v0.1.0 — Catalogue intelligent

- [x] Ajouter un objet avec un nom et une catégorie.
- [x] Ajouter une description facultative.
- [x] Renseigner l'état : neuf, bon état ou usé.
- [x] Ajouter une photo facultative (1 Mo maximum).
- [x] Conserver le catalogue dans le navigateur utilisé.
- [ ] Vérifier le déploiement de cette version.
- [ ] Remplacer les exemples de démonstration par l'inventaire réel communiqué par la famille.
- [x] Ouvrir une fiche détaillée au clic sur le titre d'un objet.
- [x] Créer une page de recherche intelligente dédiée.
- [x] Rechercher des livres via Google Books et afficher les couvertures et métadonnées disponibles.
- [x] Rechercher des jeux de société via BoardGameGeek et afficher les informations disponibles.
- [x] Ajouter un résultat de recherche au catalogue local.
- [ ] Améliorer les filtres avancés et enrichir les fiches de jeux avec leurs photos et descriptions détaillées.
- [ ] Développer un véritable assistant IA conversationnel pour les recommandations.

## v0.2.0 — Emprunts et réservations

- [ ] Parcours d'emprunt complet.
- [ ] Réservations avec dates et disponibilité.
- [ ] Historique fiable des emprunts et des retours.

## v0.3.0 — Membres et accès

- [ ] Demandes d'inscription et validation par l'administrateur.
- [ ] Authentification réelle et sécurisation de l'espace administrateur.
- [ ] Codes d'accès individuels utilisables.
- [ ] Stockage serveur partagé pour les membres, objets, photos et emprunts.

## v0.4.0 — Notifications

- [ ] Rappels de retour.
- [ ] Notifications de réservation.

## v0.5.0 — Statistiques

- [ ] Tableau de bord des objets, disponibilités et emprunts.
- [ ] Historique des activités.

## v0.6.0 — Expérience mobile

- [ ] Interface mobile améliorée.
- [ ] Installation comme application PWA.

## v1.0.0 — Version familiale stable

- [ ] Tests fonctionnels et de sécurité.
- [ ] Sauvegardes et restauration des données.
- [ ] Déploiement stable après validation.

## Règles de suivi

Une tâche n'est cochée que lorsqu'elle est implémentée et vérifiée. Les appels externes doivent encore être testés en production. Une mise à jour du code ne signifie pas automatiquement que la version est déjà disponible sur le site de production.
