# JUSTEVIVO Ultimate — audit technique et plan de livraison

Date de l'audit : 16 novembre 2026

## État vérifié dans les dépôts

### Déjà présents (à tester de bout en bout)
- Montage vidéo avec transcription et sous-titres.
- Traitements FFmpeg : suppression des silences, coupes d'intervalles, amélioration audio, rendu d'extraits et composition.
- Magic Clips : analyse Whisper, propositions d'extraits, traduction des segments et export.
- Génération de scripts et storyboards B-roll via Groq.
- Préécoute vocale via SpeechSynthesis du navigateur/appareil.
- Bibliothèque de musiques avec filtre de licences.
- Brand Kit local au navigateur (pas encore synchronisé entre appareils).
- Authentification Supabase et paiement Dodo avec webhook.

### Problèmes confirmés
1. Les routes vidéo IA répondaient systématiquement HTTP 410 malgré une implémentation fournisseur présente derrière ces retours anticipés.
2. Les plans avaient tous zéro crédit vidéo IA et le code imposait une ancienne formule All-in-One.
3. Le statut frontend pouvait présenter un générateur sans distinguer l'absence de fournisseur de l'absence de crédits.
4. La synthèse vocale actuelle est une préécoute locale : elle ne produit pas un fichier audio exportable et n'est pas une voix IA serveur.
5. Le Brand Kit est stocké localement et n'est pas synchronisé entre appareils.

### Fonctions validées mais non encore livrées
- Repurpose IA : déclinaisons cohérentes d'un contenu source par réseau, format, accroche, légende et CTA.
- Voix IA exportable : fournisseur serveur, génération audio réelle, téléchargement et insertion dans la timeline.
- Avatar IA : génération vidéo avec avatar parlant, gestion des consentements et fournisseur externe.
- Synchronisation cloud des projets et du Brand Kit.

## Changements déjà poussés dans cette phase
- Les retours HTTP 410 ont été retirés des routes de configuration, génération, suivi et assemblage vidéo IA.
- L'accès dépend maintenant d'un fournisseur configuré et d'un solde de crédits strictement positif (ou du compte administrateur).
- Les crédits IA mensuels sont configurables par formule côté serveur et restent à zéro par défaut.
- La réponse de configuration distingue « Non configuré » d'un moteur connecté sans crédits.
- L'interface désactive le bouton de génération tant que le moteur et les crédits ne sont pas disponibles.
- Aucun secret fournisseur ni quota payant n'a été inventé ou ajouté.

## Décision de périmètre — 16 novembre 2026
- La génération de vidéo IA (création de séquences par LTX/Runway) est retirée du périmètre produit et ne fait plus partie de la finalisation Ultimate.
- Ne pas configurer de clés LTX/Runway, de crédits vidéo IA ou de tarification dédiée.
- Ne pas confondre cette décision avec le montage vidéo classique : import de médias, timeline, coupes, sous-titres, Magic Clips, composition et export restent dans le périmètre et doivent être préservés.
- Le code historique de génération vidéo IA est laissé intact dans cette étape afin d'éviter une suppression risquée de routes ou de dépendances partagées. Il devra rester inaccessible depuis le parcours utilisateur et pourra être retiré séparément après vérification des dépendances.

## Prochaines étapes obligatoires (périmètre actualisé)
1. Vérifier et tester Magic Clips de bout en bout : analyse, sélection, rendu, export et erreurs.
2. Finaliser Voice : génération audio réellement exportable et insertion dans la timeline ; la préécoute SpeechSynthesis seule ne suffit pas.
3. Construire Repurpose IA : déclinaisons par plateforme, accroches, légendes, CTA et formats, avec validation humaine avant publication.
4. Évaluer Avatar : intégration réelle d'un fournisseur externe uniquement après validation du coût, de la sécurité et des consentements ; ne pas simuler une génération.
5. Synchroniser projets et Brand Kit via Supabase avec politiques d'accès par utilisateur.
6. Tests de non-régression PC, Android, iOS, mobile web, paiements et mises à jour natives.

## Critère de mise en production
Aucune fonction ne doit être marquée « prête » sur la seule base de son interface. Chaque parcours doit être exécuté sur un compte de test, un vrai fichier média et un appareil réel, avec vérification des erreurs, des quotas, de la facturation et de l'export.
