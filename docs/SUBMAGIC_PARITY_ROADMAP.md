# JUSTEVIVO V6 — feuille de route de parité fonctionnelle avec Submagic

> Objectif : construire un éditeur IA original, fiable et compétitif. Cette feuille de route décrit les capacités à vérifier et à développer ; elle ne prétend pas que les fonctions marquées « à construire » sont déjà disponibles.

## 1. Capacités déjà présentes dans le dépôt (à retester en navigateur)

- Transcription IA avec segments et horodatages.
- Correction linguistique des segments côté serveur, avec repli sur le texte ASR brut si le fournisseur IA échoue.
- Traduction des sous-titres en plusieurs langues en conservant les horodatages.
- Édition du texte, styles animés, couleurs, typographies, mots-clés et emojis.
- Titre d'accroche configurable.
- Détection/lecture avec saut des silences et compression des temps de sortie.
- Zooms automatiques simples.
- Musique, volume voix/musique, ducking, effets sonores et recherche audio Openverse.
- Export vidéo via navigateur, export SRT/VTT.
- Sauvegarde, recherche, ouverture, renommage et suppression de projets.
- Comptes, quotas et abonnements côté serveur.

## 2. Fonctionnalités de parité à développer

### Priorité P0 — fiabilité et qualité de production
- Pipeline d'export déterministe : synchronisation audio/vidéo/sous-titres, gestion des erreurs, annulation, progression, reprise et nettoyage mémoire.
- Préservation du ratio, de la résolution, de la cadence et du cadrage source ; profils d'export 720p/1080p/2K/4K et 30/60 FPS lorsque le navigateur et le matériel le permettent.
- Prévisualisation identique au rendu exporté.
- Historique d'annulation/rétablissement et autosauvegarde.
- Édition des sous-titres par lot, correction mot à mot, dictionnaire personnalisé et gestion des intervenants.
- Tests de non-régression sur les formats vidéo/audio courants et les vidéos longues.

### Priorité P1 — montage IA automatisé
- Auto Edit en un clic : analyser la transcription, proposer un rythme, appliquer un modèle, générer les sous-titres et assembler les éléments visuels/sonores.
- Smart Trim : détecter et couper silences, hésitations, mots de remplissage, reprises et prises ratées ; toujours permettre de revoir les coupes avant validation.
- B-roll contextuels : proposer des plans liés au sens de chaque segment, depuis les médias importés et une bibliothèque sous licence.
- Zooms intelligents basés sur les moments importants, avec styles et points modifiables.
- Transitions entre plans, médias et changements de séquence.
- Génération de hooks, titres, descriptions, hashtags et suggestions de couverture.

### Priorité P2 — audio et présence caméra
- Nettoyage vocal (bruit de fond et amélioration de l'intelligibilité).
- Détection des pics, normalisation du volume et mixage voix/musique/effets.
- Correction du contact visuel, uniquement via un fournisseur vidéo compatible et après validation du rendu.
- Sous-titres multi-intervenants avec attribution et styles par intervenant.

### Priorité P3 — réutilisation et diffusion
- Magic Clips : analyser une longue vidéo et proposer plusieurs extraits courts avec leurs propres sous-titres/hooks.
- Recadrage intelligent vertical, carré, paysage et 4:5, avec suivi du sujet si disponible.
- Kits de marque : polices, couleurs, logo, templates réutilisables.
- Exports par plateforme, préréglages, couvertures et sous-titres séparés.
- Collaboration, partage de projets et publication sociale/API, sous réserve d'intégrations autorisées.

## 3. Architecture et dépendances

- Garder le navigateur pour l'aperçu et les opérations légères ; déplacer les traitements lourds vers une file de jobs serveur.
- Stocker les médias temporaires dans un stockage objet avec expiration ; ne pas dépendre du disque éphémère du serveur.
- Séparer les adaptateurs IA (transcription, LLM, audio, vision, B-roll) afin de pouvoir changer de fournisseur.
- Utiliser des tâches asynchrones avec état, progression, tentatives limitées, idempotence et reprise après erreur.
- Ajouter quotas et estimation de consommation avant les fonctions coûteuses.
- N'utiliser que des médias dont la licence autorise l'usage prévu ; conserver les crédits.
- Ne jamais exposer les clés fournisseurs dans le frontend.

## 4. Conditions de validation

Une fonctionnalité n'est considérée comme livrée qu'après :
1. Tests unitaires et tests d'intégration pertinents.
2. Vérification de l'interface et du parcours utilisateur dans un vrai navigateur.
3. Comparaison aperçu/export sur le même fichier.
4. Tests de fichiers courts, longs, portrait, paysage, audio mono/stéréo et cas d'erreur.
5. Vérification des quotas, droits d'accès et nettoyage des fichiers temporaires.
6. Validation sur la branche de travail avant toute mise en production.

## 5. Contraintes connues

- Le plafond d'import demandé est de 200 Mo.
- Les formules JUSTEVIVO Starter/Pro/Business sont actuellement affichées à 10/15/25 USD par mois ; les prix backend sont configurés en XOF.
- Les fonctionnalités de débruitage avancé, correction du regard, génération vidéo/B-roll et rendu serveur peuvent nécessiter des fournisseurs externes, des clés API, du stockage et/ou des ressources de calcul. Elles ne doivent pas être simulées par de simples boutons.
- Aucun déploiement en production ni fusion vers main sans autorisation explicite.
