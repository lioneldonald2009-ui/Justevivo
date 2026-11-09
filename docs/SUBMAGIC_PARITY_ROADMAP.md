# JUSTEVIVO — feuille de route de parité fonctionnelle Submagic

Référence fonctionnelle consultée le 9 novembre 2026 :
- https://www.submagic.co/features/auto-video-editor
- https://care.submagic.co/en/article/how-to-use-submagic-step-by-step-guide-pafx7o/
- https://submagic.canny.io/changelog

Cette feuille de route distingue les fonctionnalités déjà repérables dans le dépôt des capacités qui exigent encore une implémentation réelle. Une carte ou un bouton d'interface ne constitue pas une fonctionnalité livrée si le moteur vidéo ne réalise pas le traitement.

## Fonctionnalités déjà présentes ou amorcées dans JUSTEVIVO

- Génération de sous-titres IA et édition des textes.
- Traduction des sous-titres.
- Personnalisation de styles, couleurs et typographies.
- Prévisualisation vidéo dans le studio.
- Outils de scènes et d'export déjà organisés dans le panneau de montage.
- Export de sous-titres SRT/VTT repéré dans les outils existants.
- Sauvegarde, chargement et suppression de projets.
- Zoom dynamique des sous-titres en mode karaoké.
- Navigation vers Tableau de bord, Studio, Projets, Styles et Paramètres.

Ces fonctionnalités doivent être testées de bout en bout avant d'être considérées comme validées.

## Fonctionnalités à intégrer au moteur vidéo

| Priorité | Fonctionnalité | Comportement attendu |
|---|---|---|
| P0 | Auto Edit | Pipeline en un clic : transcription, coupes, rythme, sous-titres, effets et export. |
| P0 | Smart Trim | Détection des silences, hésitations, répétitions et mauvaises prises, avec aperçu avant application. |
| P0 | Timeline non destructive | Découpage, déplacement, restauration et annulation des modifications. |
| P1 | B-rolls contextuels | Suggestions liées au transcript, bibliothèque média et import de clips personnels. |
| P1 | Magic Zoom | Détection des moments clés, styles de zoom et réglage manuel des points. |
| P1 | Transitions | Transitions entre séquences avec aperçu et durée réglable. |
| P1 | Audio propre | Réduction du bruit, normalisation et amélioration de la voix, sans écraser l'original. |
| P1 | Musique et effets sonores | Pistes audio séparées, volume, fondu et synchronisation. |
| P1 | Brand Kit | Polices, couleurs, logo, styles de sous-titres, intros/outros et modèles enregistrés. |
| P1 | Hook IA | Titres d'ouverture adaptés au contenu et modifiables. |
| P1 | Descriptions et hashtags | Suggestions par réseau social et langue. |
| P2 | Magic Clips | Analyse d'une longue vidéo, détection des passages forts et création de clips indépendants. |
| P2 | Correction du regard | Traitement de la direction du regard, avec consentement et aperçu avant validation. |
| P2 | Réglages d'image | Luminosité, contraste, saturation et température. |
| P2 | Médias et animations | Images, GIF, emojis animés et effets sonores synchronisés. |
| P2 | Exports avancés | Ratios 9:16, 4:5, 1:1, 16:9 et original ; résolutions selon les capacités réelles du moteur. |
| P2 | Publication sociale | Préparation des exports et connexions officielles aux plateformes, sans simuler une publication. |

## Pages et navigation à livrer

1. Tableau de bord : activité, quota, projets récents, raccourcis et états vides.
2. Mon studio : import, transcription, preview, timeline, scènes et export.
3. Mes projets : recherche, tri, ouverture, duplication, renommage et suppression avec confirmation.
4. Styles de texte : modèles, typographies, couleurs, animations et sauvegarde.
5. Bibliothèque média : vidéos, B-rolls, musiques, effets et imports personnels.
6. Brand Kit : identité par compte ou espace de travail.
7. Paramètres : profil, sécurité, abonnement, langue et préférences.
8. Centre d'aide : tutoriels, FAQ, contact et signalement d'un problème.

Chaque élément de navigation doit ouvrir une vue réelle. Chaque bouton doit avoir un état de chargement, un retour de succès ou d'erreur et une action de retour cohérente.

## Critères d'acceptation

- Aucun bouton factice ni lien sans destination.
- Pas de traitement IA annoncé tant que l'API ou le moteur correspondant n'existe pas.
- Prévisualisation avant les actions destructrices.
- Annuler/rétablir pour les opérations de montage.
- Sauvegarde et reprise d'un projet après rechargement.
- Tests sur fichiers courts et longs, mobile et ordinateur.
- Tests de régression des sous-titres, traductions, projets et exports existants.
