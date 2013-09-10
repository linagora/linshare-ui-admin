# Linshare NG proof of concept

## Installation

### Installer les outils
5 outils sont nécessaire pour installer le projet:
- nodejs
- npm
- grunt
- bower
- yeoman (yo)

#### Installer nodejs & npm
    curl http://nodejs.org/dist/node-latest.tar.gz -o node-latest.tar.gz
    tar xvf node-latest.tar.gz
    cd node-v0.XX.XX
    ./configure
    make
    make install

#### Installer les modules grunt, bower, yo 
    sudo npm install -g yo grunt-cli bower
    sudo npm install -g generator-webapp

#### Checker les modules npm a mettre à jour
    sudo npm outdated -g

#### Mettre a jour nodejs
    sudo npm cache clean -f
    sudo npm install -g n
    sudo n stable

#### Mettre a jour npm & ses modules
    sudo npm update -g

#### Mettre a jour yeoman
    sudo npm cache clean && npm update -g yo

### Installer le projet
* "npm install"
* "bower install"


## Procedure de mise à jour
Pour vérifier si des mises à jour sont présentes:
"bower list"
Pour mettre à jour un module via bower:
* Modifier le fichier component.json avec la version souhaitée
* "bower install" va ensuite retelecharger l'ensemble des plugins et vérifier les dépendances

## Lancer l'application
Pour lancer l'application, la commande est:
* grunt server

## JavaScript
Un cours sur JavaScript fait par un des créateurs d'AngularJS
* [http://microclub.ch/2012/10/21/javascript-le-langage-de-programmation-le-plus-incompris-du-monde/](http://microclub.ch/2012/10/21/javascript-le-langage-de-programmation-le-plus-incompris-du-monde/)
* [http://youtu.be/ljNi8nS5TtQ](http://youtu.be/ljNi8nS5TtQ)
* [http://misko.hevery.com/](http://misko.hevery.com/)


## AngularJS
Avant de commencer à développer, veuillez lire les pages suivantes 
pour connaitre AngularJS et les bonnes pratiques:

* [http://docs.angularjs.org/misc/faq](http://docs.angularjs.org/misc/faq)
* [http://docs.angularjs.org/tutorial/](http://docs.angularjs.org/tutorial/)
* [http://docs.angularjs.org/guide/](http://docs.angularjs.org/guide/)
* [https://github.com/angular/angular.js/wiki](https://github.com/angular/angular.js/wiki)
* [http://www.youtube.com/watch?v=ZhfUv0spHCY](http://www.youtube.com/watch?v=ZhfUv0spHCY)
* [http://www.youtube.com/watch?v=P2ErSQj3SN8&list=TLEg-hpGDzoaY](http://www.youtube.com/watch?v=P2ErSQj3SN8&list=TLEg-hpGDzoaY)

Autre:

* [http://www.frangular.com/](http://www.frangular.com/)
* [http://code.realcrowd.com/on-the-bleeding-edge-advanced-angularjs-form-validation/](http://code.realcrowd.com/on-the-bleeding-edge-advanced-angularjs-form-validation/)
* [http://www.egghead.io/](http://www.egghead.io/)
* [http://weblogs.asp.net/dwahlin/archive/2013/04/12/video-tutorial-angularjs-fundamentals-in-60-ish-minutes.aspx](http://weblogs.asp.net/dwahlin/archive/2013/04/12/video-tutorial-angularjs-fundamentals-in-60-ish-minutes.aspx)
* [http://weblogs.asp.net/dwahlin/archive/2013/05/22/dynamically-loading-controllers-and-views-with-angularjs-and-requirejs.aspx](http://weblogs.asp.net/dwahlin/archive/2013/05/22/dynamically-loading-controllers-and-views-with-angularjs-and-requirejs.aspx)


Vos questions existentielles:

* [http://stackoverflow.com/questions/11873627/angularjs-ng-model-binding-not-updating-with-dynamic-values](http://stackoverflow.com/questions/11873627/angularjs-ng-model-binding-not-updating-with-dynamic-values)
* [http://henriquat.re/directives/advanced-directives-combining-angular-with-existing-components-and-jquery/angularAndJquery.html](http://henriquat.re/directives/advanced-directives-combining-angular-with-existing-components-and-jquery/angularAndJquery.html)
* [http://stackoverflow.com/questions/12546945/difference-between-the-controller-and-link-functions-when-defining-an-angula](http://stackoverflow.com/questions/12546945/difference-between-the-controller-and-link-functions-when-defining-an-angula)
* [http://stackoverflow.com/questions/11605917/this-vs-scope-in-angularjs-controllers/14168699#14168699](http://stackoverflow.com/questions/11605917/this-vs-scope-in-angularjs-controllers/14168699#14168699)

Les exemples fournis par angular

* [https://github.com/angular/angular.js/wiki/JsFiddle-Examples](https://github.com/angular/angular.js/wiki/JsFiddle-Examples)

La documentation spécifique à un plugin est généralement disponible sur le github associé.

### Difference entre link et controller, dans une directive
La fonction link ne s'occupe que de la manipulation de la vue (gestion des cliques, des class css etc ...)
La fonction controller s'occupe de la partie métier (récupération des données depuis un service etc ...)

## Outils de dev
L'éditeur de texte Vim est conseillé avec le plugin [https://github.com/maksimr/vim-jsbeautify](https://github.com/maksimr/vim-jsbeautify)
Pour éviter des fichiers avec trop de colonne, la tabulation avec 2 espaces est recommandée.
Pour l'API rest, le debugger [http://restclient.net/](http://restclient.net/) est conseillé.
Pour débugger AngularJS [https://github.com/angular/angularjs-batarang](https://github.com/angular/angularjs-batarang)

## Détails techniques AngularJS

### Utilisation de la syntaxe ['module', function(Module){ }]
Cette syntaxe évite la minification des noms de modules.
Les modules AngularJS sont toujours précédés d'un $.
Les modules possèdent une majuscule (en argument de la fonction)
lorsqu'il s'agit d'objet et non d'un ensemble de function.

cf : [http://docs.angularjs.org/guide/di](http://docs.angularjs.org/guide/di)

### Utilisation de l'internationalization
A la première utilisation de Linshare, la langue par défaut est la langue du navigateur,
ou l'anglais si la resource de langue n'existe pas. Puis si l'utilisateur modifie la langue,
cette dernière est stockée dans un cookie.
Le dictionnaire est chargé au démarrage de l'application puis est stocké dans le rootScope,
on peut donc l'utilisé directement ou en passant par le service de localisation.

### Utilisation du logger
Nous avons wrapper le logger AngularJS dans un service pour pouvoir
gérer des niveaux de logs. 
Le niveau de logs est précisé dans les préférences de l'application
puis est stocké dans un cookie pour pourvoir à terme modifier le niveau de log 
à la volée.
Niveaux de log: 
- TRACE (defaut)
- DEBUG
- INFO
- WARN
- ERROR
- SILENT

### Remarques
* Le rootScope: Il ne doit pas être pollué et est reservé à une utilisation
très spécifique (internationalization, userLogged). Son utilisation
revient à instancier des variables globales à l'application 
(comme chacun le sait c'est une mauvaise pratique de programmation)
* Attention aux appels Restangular dans les directives. 
Les appels de resource seront dupliqués a chaque duplication de la directive

### Notes pour la version AngularJS 1.2.X
* Modifier le module http-auth-interceptor pour modifier les headers sortants.
* Modifier le service Logger pour utiliser la fonction debug() d'AngularJS.
* Vérifier la directive d'animation dans la tree view ainsi que les regles CSS associées.


### Notes de controles
#### Sur le serveur
* Vérifier les champs obligatoires Missing argument exception
* Vérifier l'unicité avant création
#### Sur le client
* Mettre le champs datepicker required dans le userEditForm 

### Pour la suite
* [bootstrap 3.0](http://getbootstrap.com)
* [hint helper](http://kushagragour.in/lab/hint/)
* [coffeescript](http://coffeescript.org/)
* [email validation online opensource](http://code.realcrowd.com/using-mailguns-email-address-validation-service-with-angularjs/)
* [simple spinner](http://www.designcouch.com/home/why/2013/05/23/dead-simple-pure-css-loading-spinner/)
* Vérifier l'evolution de la lib [angular-http-auth](https://github.com/witoldsz/angular-http-auth) et l'eventuel passage a bower
* Acheter le bouquin de [Pawel Kozlowski](https://github.com/pkozlowski-opensource) et [Pete Bacon Darwin](https://github.com/petebacondarwin) sur les bonnes pratiques d'angular, quand il sera sorti
