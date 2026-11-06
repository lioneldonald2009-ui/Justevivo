# Supabase — conservation des données

Aucune migration destructive n'est fournie dans ce pack.
Ne supprimez et ne recréez aucune table existante.
Avant d'ajouter une table de tâches persistantes, il faut exporter le schéma actuel (profiles, usage, projects, etc.), vérifier les clés étrangères et politiques RLS, puis appliquer une migration additive testée.
Les clés SUPABASE_SERVICE_KEY restent exclusivement dans Render.
