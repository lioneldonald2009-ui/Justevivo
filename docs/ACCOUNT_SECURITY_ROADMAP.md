# JUSTEVIVO V6 — sécurité et parcours de compte

## État vérifié dans le code actuel
- L'inscription appelle Supabase Auth `signup`.
- Si Supabase ne renvoie pas de session, l'interface demande déjà à la personne de confirmer son adresse e-mail avant connexion.
- Le backend valide les jetons Supabase auprès de Auth pour les routes protégées.
- La session est actuellement conservée dans localStorage ; une migration vers cookies HttpOnly via un backend/BFF est recommandée pour réduire l'exposition aux scripts injectés.
- Aucun parcours de réinitialisation du mot de passe ni CAPTCHA visible n'a été trouvé dans le fichier app5.js inspecté.

## Exigences à implémenter et valider
1. Confirmation d'adresse obligatoire : activer « Confirm email » dans Supabase Auth, configurer les URL de redirection autorisées et tester le lien reçu (boîte principale et spam).
2. Anti-robot : intégrer Cloudflare Turnstile ou hCaptcha côté interface et activer le fournisseur CAPTCHA dans Supabase Auth. Le jeton doit être transmis à l'inscription et vérifié côté Supabase. Le secret CAPTCHA doit rester dans la configuration Supabase, jamais dans le dépôt ou le navigateur.
3. Réinitialisation du mot de passe : déclencher l'e-mail de récupération Supabase, limiter les URL de redirection, exiger un lien/token de récupération valide et récent, puis autoriser le nouveau mot de passe uniquement après validation du jeton.
4. Changement depuis un compte connecté : exiger une réauthentification ou une vérification e-mail récente avant la mise à jour du mot de passe.
5. Anti-abus : rate limiting distribué pour inscription, connexion, récupération et vérification ; messages non révélateurs de l'existence d'un compte ; journalisation sans jetons ni mots de passe.
6. Mot de passe : politique configurable (longueur minimale robuste, vérification des mots de passe compromis si disponible), confirmation de saisie et bouton afficher/masquer accessible.
7. Sessions : déconnexion globale après changement de mot de passe, rotation/expiration des refresh tokens, protection CSRF si cookies, CSP et échappement strict des données utilisateur.
8. Pages et navigation : routes distinctes pour connexion, inscription, confirmation en attente, récupération, réinitialisation, tableau de bord, projets, studio, paramètres et facturation. Chaque route doit supporter rechargement, retour navigateur et accès direct sans contourner l'authentification.

## Configuration externe nécessaire
- Supabase Dashboard > Authentication : confirmation d'e-mail, modèles d'e-mail, Site URL et Redirect URLs.
- Supabase Dashboard > Authentication > Bot and Abuse Protection : activation CAPTCHA et secret du fournisseur.
- Fournisseur e-mail : vérifier délivrabilité, SPF, DKIM et DMARC du domaine d'envoi si domaine personnalisé.
- Les secrets de fournisseur ne doivent être ajoutés que dans les variables d'environnement sécurisées du service concerné.

## Critères d'acceptation obligatoires
- Inscription non confirmée refusée à la connexion.
- CAPTCHA absent/invalide refusé si protection activée.
- Lien de récupération expiré, réutilisé ou redirigé vers un domaine non autorisé refusé.
- Mot de passe non modifiable avant vérification e-mail/jeton valide.
- Tests de limitation de débit et de sessions révoquées.
- Parcours complet testé sur navigateur réel, mobile et desktop.
