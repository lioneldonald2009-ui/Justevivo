# Configurer les mises à jour Android signées de JUSTEVIVO

Le pipeline de publication Android est prêt, mais il ne peut pas signer un APK tant que les secrets de signature ne sont pas configurés.

## 1. Vérifier la clé de signature existante

Une mise à jour Android doit être signée avec le même certificat que l'application déjà installée. Si l'APK actuellement distribué a été signé avec une autre clé, Android refusera la mise à jour par-dessus l'installation existante.

Ne créez pas une nouvelle clé avant d'avoir vérifié la signature de l'APK actuellement distribué. Conservez une sauvegarde hors ligne de la clé et de ses mots de passe. La perte de cette clé peut empêcher les mises à jour de l'application installée.

## 2. Ajouter les secrets GitHub

Dans le dépôt JUSTEVIVO : Settings → Secrets and variables → Actions → New repository secret.

Créer les quatre secrets suivants :

- `ANDROID_KEYSTORE_BASE64` : contenu Base64 du fichier keystore de signature.
- `ANDROID_KEYSTORE_PASSWORD` : mot de passe du keystore.
- `ANDROID_KEY_ALIAS` : alias de la clé.
- `ANDROID_KEY_PASSWORD` : mot de passe de la clé.

Ne jamais placer ces valeurs dans le code source, les issues ou les conversations.

Pour encoder un keystore local en Base64 :
```bash
base64 -w 0 justevivo-release.keystore
```
Sur macOS :
```bash
base64 < justevivo-release.keystore | tr -d '\n'
```

## 3. Publier la première version signée

Après avoir ajouté les quatre secrets, ouvrir Actions → Build and publish signed JUSTEVIVO Android update → Run workflow.

Le pipeline :
1. construit l'application Android ;
2. fixe le numéro de version Android ;
3. aligne et signe l'APK ;
4. vérifie la signature ;
5. publie l'APK dans une GitHub Release ;
6. publie l'URL stable de téléchargement dans le manifeste central.

Les versions suivantes déclenchent automatiquement le processus après l'incrémentation de version.

## 4. Limite Android

L'installation d'un APK téléchargé depuis le web demande toujours la confirmation du système Android et, selon l'appareil, l'autorisation d'installer des applications depuis cette source. JUSTEVIVO ne peut pas contourner cette protection système. Le blocage de l'ancienne version ne doit être activé qu'après publication vérifiée d'un APK compatible et signé.
