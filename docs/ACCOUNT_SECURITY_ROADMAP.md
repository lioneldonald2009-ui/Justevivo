# JUSTEVIVO — feuille de route sécurité des comptes

## Modifications de code isolées déjà ajoutées sur les branches de travail

- Ajout d'un parcours de récupération du mot de passe par lien email à usage limité.
- Le formulaire de nouveau mot de passe n'apparaît qu'après réception du jeton de récupération dans le lien.
- Double saisie du nouveau mot de passe et contrôle de longueur minimale.
- Les formulaires Paramètres ne changent plus directement le mot de passe : ils demandent l'envoi du lien de vérification.
- Le frontend refuse l'accès si le profil retourné par Supabase ne contient pas de date de confirmation email.
- Le backend vérifie aussi `email_confirmed_at` avant d'autoriser l'accès aux routes protégées.

Ces modifications sont dans des branches séparées et ne sont pas encore déployées en production.

## Configuration Supabase requise avant activation réelle

1. Activer **Email Confirmations** dans Authentication > Providers.
2. Vérifier les URL de redirection autorisées et ajouter l'URL exacte de JUSTEVIVO.
3. Vérifier le modèle d'email de confirmation et le modèle de récupération.
4. Régler la durée de validité des liens/OTP à une durée courte (1 heure ou moins).
5. Configurer un SMTP fiable avant ouverture publique afin d'améliorer la délivrabilité.
6. Vérifier que les emails de confirmation et de récupération arrivent dans Gmail et les autres fournisseurs, y compris les spams.

Le code frontend ne peut pas activer à lui seul ces paramètres de projet.

## Protection anti-robot (intégration préparée, activation en attente)

Le frontend intègre désormais le widget Cloudflare Turnstile de façon optionnelle. Lorsque la clé publique est fournie par la configuration backend, le jeton CAPTCHA est demandé et transmis aux endpoints Supabase d'inscription, de connexion et de récupération. Le bouton de récupération depuis Paramètres ouvre ce même parcours pour éviter de contourner le contrôle.

Le backend expose uniquement la clé publique via `SUPABASE_CAPTCHA_SITE_KEY`. Aucun secret CAPTCHA n'est exposé au navigateur.

L'intégration reste inactive tant que les clés et la protection Supabase ne sont pas configurées.

Configuration nécessaire :
- Créer un widget Turnstile ou hCaptcha.
- Récupérer la clé publique (site key) et la clé secrète.
- Activer le fournisseur et la protection CAPTCHA dans les paramètres Auth de Supabase.
- Ajouter le composant CAPTCHA dans les formulaires concernés.
- Envoyer le jeton CAPTCHA à Supabase pour chaque opération protégée.
- Réinitialiser le défi après chaque tentative.
- Tester les cas succès, échec, expiration, absence de jeton et limitation de débit.

Aucune clé fictive ne doit être ajoutée au dépôt. La clé secrète ne doit jamais apparaître dans le frontend ou dans GitHub.

## Contrôles complémentaires

- Limitation de débit sur connexion, inscription, récupération et envoi d'emails.
- Messages d'erreur qui ne révèlent pas si une adresse email est inscrite.
- Sessions courtes et renouvellement contrôlé.
- Déconnexion de toutes les sessions après changement de mot de passe, selon la politique retenue.
- MFA facultative pour les comptes sensibles.
- Protection XSS et revue du stockage des jetons côté navigateur.
- Journalisation des événements de sécurité sans mots de passe ni jetons.
- Tests d'accès API avec compte non confirmé, session expirée et jeton invalide.

## Tests avant mise en production

- Inscription avec adresse valide : email reçu, compte non utilisable avant confirmation.
- Inscription avec adresse invalide ou déjà utilisée.
- Connexion avant confirmation : refus.
- Confirmation depuis le lien email : compte activé.
- Demande de récupération : lien reçu.
- Lien expiré ou déjà utilisé : refus.
- Changement du mot de passe sans lien : impossible.
- Changement avec lien valide : autorisé.
- Accès aux API privées avec compte non confirmé : HTTP 403.
- CAPTCHA manquant ou invalide : opération refusée.

## État non livré

La configuration du projet Supabase et le fournisseur CAPTCHA ne sont pas encore activés/vérifiés. Le parcours de récupération est écrit dans le frontend, mais doit encore être testé avec les emails réels et la configuration Auth de production avant toute fusion ou publication.
