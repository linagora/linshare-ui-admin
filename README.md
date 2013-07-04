# Linshare NG proof of concept

## AngularJS
Avant de commencer à développer, veuillez lire les pages suivantes 
pour connaitre angularjs et les bonnes pratiques:

http://docs.angularjs.org/tutorial/
http://docs.angularjs.org/guide/
http://www.youtube.com/watch?v=ZhfUv0spHCY
http://www.youtube.com/watch?v=P2ErSQj3SN8&list=TLEg-hpGDzoaY

La documentation spécifique à un plugin est généralement disponible sur le github associé.

## Détails techniques AngularJS

### Utilisation de la syntaxe ['module', function(Module){ }]
Cette syntaxe évite la minification des noms de modules.
Les modules AngularJS sont toujours précédés d'un $.
Les modules possèdent une majuscule (en argument de la fonction)
lorsqu'il s'agit d'objet et non d'un ensemble de function.

cf : http://docs.angularjs.org/guide/di

### Notes pour la version AngularJS 1.1.X
* Modifier le module http-auth-interceptor pour modifier les headers sortants.
* Modifier le service Logger pour utiliser la fonction debug() d'AngularJS.
* Vérifier la directive d'animation dans la tree view ainsi que les regles CSS associées.



## Outils de dev
L'éditeur de texte vim est conseillé avec le plugin https://github.com/maksimr/vim-jsbeautify
Pour éviter des fichiers avec trop de colonne, la tabulation avec 2 espace est recommandée.

## Utilisation de l'internationalization
A la première utilisation de Linshare, la langue par défaut est la langue du navigateur,
ou l'anglais si la resource de langue n'existe pas. Puis si l'utilisateur modifie la langue,
cette dernière est stockée dans un cookie.
Le dictionnaire est chargé au démarrage de l'application puis est stocké dans le rootScope,
on peut donc l'utilisé directement ou en passant par le service de localisation.

## Utilisation du logger
Nous avons wrapper le logger AngularJS dans un service pour pouvoir
gérer des niveaux de logs. 
Le niveau de logs est précisé dans les préférences de l'application
puis est stocké dans un cookie pour pourvoir à terme modifier le niveau de log 
à la volée.

