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
    npm install
    bower install


## Procedure de mise à jour
Pour vérifier si des mises à jour sont présentes:

    bower list

Pour mettre à jour un module via bower:

* Modifier le fichier bower.json avec la version souhaitée
* "bower install" va ensuite retelecharger l'ensemble des plugins du fichier bower.json et vérifier les dépendances

## Lancer l'application
Pour lancer l'application en mode developpement, la commande est:

   grunt serve

Pour lancer l'application en mode production, la commande est:

   grunt serve:dist

Pour packager l'application en mode production, la commande est:

   grunt build

## JavaScript
Un cours sur JavaScript fait par un des créateurs d'AngularJS

* [http://microclub.ch/2012/10/21/javascript-le-langage-de-programmation-le-plus-incompris-du-monde/](http://microclub.ch/2012/10/21/javascript-le-langage-de-programmation-le-plus-incompris-du-monde/)
* [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
* [http://youtu.be/ljNi8nS5TtQ](http://youtu.be/ljNi8nS5TtQ)


## AngularJS
Avant de commencer à développer, veuillez lire les pages suivantes 
pour connaitre AngularJS et les bonnes pratiques:

* [http://docs.angularjs.org/misc/faq](http://docs.angularjs.org/misc/faq)
* [http://docs.angularjs.org/tutorial/](http://docs.angularjs.org/tutorial/)
* [http://docs.angularjs.org/guide/](http://docs.angularjs.org/guide/)
* [https://github.com/angular/angular.js/wiki](https://github.com/angular/angular.js/wiki)
* [http://www.youtube.com/watch?v=ZhfUv0spHCY](http://www.youtube.com/watch?v=ZhfUv0spHCY)
* [http://www.youtube.com/watch?v=P2ErSQj3SN8&list=TLEg-hpGDzoaY](http://www.youtube.com/watch?v=P2ErSQj3SN8&list=TLEg-hpGDzoaY)
* [http://onehungrymind.com/angularjs-sticky-notes-pt-1-architecture/](http://onehungrymind.com/angularjs-sticky-notes-pt-1-architecture/)
* [http://onehungrymind.com/angularjs-sticky-notes-pt-2-isolated-scope/](http://onehungrymind.com/angularjs-sticky-notes-pt-2-isolated-scope/)

Guide de style:

* [https://github.com/mgechev/angularjs-style-guide](https://github.com/mgechev/angularjs-style-guide)

Autre:

* [http://www.frangular.com/](http://www.frangular.com/)
* [http://code.realcrowd.com/on-the-bleeding-edge-advanced-angularjs-form-validation/](http://code.realcrowd.com/on-the-bleeding-edge-advanced-angularjs-form-validation/)
* [http://www.egghead.io/](http://www.egghead.io/)
* [http://weblogs.asp.net/dwahlin/archive/2013/04/12/video-tutorial-angularjs-fundamentals-in-60-ish-minutes.aspx](http://weblogs.asp.net/dwahlin/archive/2013/04/12/video-tutorial-angularjs-fundamentals-in-60-ish-minutes.aspx)
* [http://weblogs.asp.net/dwahlin/archive/2013/05/22/dynamically-loading-controllers-and-views-with-angularjs-and-requirejs.aspx](http://weblogs.asp.net/dwahlin/archive/2013/05/22/dynamically-loading-controllers-and-views-with-angularjs-and-requirejs.aspx)
* [http://www.thinkster.io/pick/GtaQ0oMGIl/](http://www.thinkster.io/pick/GtaQ0oMGIl/)
* [http://eburley.github.io/2013/01/31/angularjs-watch-pub-sub-best-practices.html](http://eburley.github.io/2013/01/31/angularjs-watch-pub-sub-best-practices.html)
* [http://jasonturim.wordpress.com/](http://jasonturim.wordpress.com/)


Vos questions existentielles:

* [http://stackoverflow.com/questions/11873627/angularjs-ng-model-binding-not-updating-with-dynamic-values](http://stackoverflow.com/questions/11873627/angularjs-ng-model-binding-not-updating-with-dynamic-values)
* [http://henriquat.re/directives/advanced-directives-combining-angular-with-existing-components-and-jquery/angularAndJquery.html](http://henriquat.re/directives/advanced-directives-combining-angular-with-existing-components-and-jquery/angularAndJquery.html)
* [http://stackoverflow.com/questions/12546945/difference-between-the-controller-and-link-functions-when-defining-an-angula](http://stackoverflow.com/questions/12546945/difference-between-the-controller-and-link-functions-when-defining-an-angula)
* [http://stackoverflow.com/questions/11605917/this-vs-scope-in-angularjs-controllers/14168699#14168699](http://stackoverflow.com/questions/11605917/this-vs-scope-in-angularjs-controllers/14168699#14168699)
* [https://gist.github.com/Mithrandir0x/3639232](https://gist.github.com/Mithrandir0x/3639232)
* [http://www.unknownerror.org/Problem/index/1192601623/why-use-angularisdefined-and-angularisundefined-closed/](http://www.unknownerror.org/Problem/index/1192601623/why-use-angularisdefined-and-angularisundefined-closed/)

Les exemples fournis par angular

* [https://github.com/angular/angular.js/wiki/JsFiddle-Examples](https://github.com/angular/angular.js/wiki/JsFiddle-Examples)

La documentation spécifique à un plugin est généralement disponible sur le github associé.

Les pros :

* [Miško Hevery](https://github.com/mhevery) [blog](http://misko.hevery.com/)
* [Pete Bacon Darwin](https://github.com/petebacondarwin) [blog](http://www.bacondarwin.com/)
* [Dean Sofer](https://github.com/ProLoser) [blog](http://deansofer.com/)
* [Pawel Kozlowski](https://github.com/pkozlowski-opensource) [blog](http://pkozlowskios.wordpress.com/)
* [Igor Minar](https://github.com/IgorMinar) [blog](http://blog.igorminar.com/)
* [Matias Niemelä](https://github.com/matsko) [blog](http://www.yearofmoo.com/)
* [Vojta Jina](https://github.com/vojtajina)
* [Brian Ford](https://github.com/btford)[blog](http://briantford.com/blog/)

## Outils de dev
L'éditeur de texte Vim est conseillé avec un plugin tel que :
* [https://github.com/maksimr/vim-jsbeautify](https://github.com/maksimr/vim-jsbeautify)
* [https://github.com/joestelmach/lint.vim](https://github.com/joestelmach/lint.vim)

Sinon vous pouvez utiliser sublime text avec le plugin suivant
* [https://github.com/angular-ui/AngularJS-sublime-package](https://github.com/angular-ui/AngularJS-sublime-package)

Pour éviter des fichiers avec trop de colonne, la tabulation avec 2 espaces est recommandée.
Pour l'API rest, le debugger [http://restclient.net/](http://restclient.net/) est conseillé.
Pour débugger AngularJS [https://github.com/angular/angularjs-batarang](https://github.com/angular/angularjs-batarang)

A suivre [http://ternjs.net/](http://ternjs.net/)

## Block de commentaire dans index.html
Ces blocks servent a la minification et au build de l'application.
Les blocks et leur contenu ne doivent pas etre modifier manuellement
sauf exception de module bower non conforme.

## Utilisation du scaffolding
On utilise [https://github.com/yeoman/generator-angular](https://github.com/yeoman/generator-angular) pour effectuer du scaffolding.
Ce dernier est capable de generer les differents composant angular tout en generant les tests et en ajoutant
la resource dans le fichier index.html

AUCUN COMPOSANT NE DOIT ETRE CREE MANUELLEMENT

ATTENTION LE SCAFFOLDING DOIT ETRE FAIT A LA RACINE DU REPERTOIRE GIT

## Détails techniques AngularJS

### Difference entre link et controller, dans une directive
La fonction link ne s'occupe que de la manipulation de la vue (gestion des cliques, des class css etc ...)
La fonction controller s'occupe de la partie métier (récupération des données depuis un service etc ...)

### Utilisation de la syntaxe ['module', function(Module){ }]
Cette syntaxe évite la minification des noms de modules.
Le module npm grunt-ngmin la genere automatiquement pour les elements de premier niveau.
Pour plus d'information [https://github.com/btford/grunt-ngmin](https://github.com/btford/grunt-ngmin)
Les modules AngularJS sont toujours précédés d'un $.
Les modules possèdent une majuscule (en argument de la fonction)
lorsqu'il s'agit d'objet et non d'un ensemble de function.

Note cette syntaxe

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

### Notes de controles
#### Sur le serveur
* Vérifier les champs obligatoires Missing argument exception
* Vérifier l'unicité avant création
* Vérifier que les droits sont respectés
#### Sur le client
* Mettre le champs datepicker required dans le userEditForm 

### Pour la suite
* [http://davej.github.io/angular-classy/](http://davej.github.io/angular-classy/)
* [hint helper](http://kushagragour.in/lab/hint/)
* [email validation online opensource](http://code.realcrowd.com/using-mailguns-email-address-validation-service-with-angularjs/)
* [simple spinner](http://www.designcouch.com/home/why/2013/05/23/dead-simple-pure-css-loading-spinner/)
* Penser a integrer lib [https://github.com/realcrowd/angularjs-utilities/](https://github.com/realcrowd/angularjs-utilities/)
* Acheter le bouquin de [Pawel Kozlowski](https://github.com/pkozlowski-opensource) et [Pete Bacon Darwin](https://github.com/petebacondarwin) sur les bonnes pratiques d'angular.

### Ce qui peut etre interessant d' integrer

* [https://github.com/angular-ui/alias](https://github.com/angular-ui/alias)
* [https://github.com/angular-ui/ui-router](https://github.com/angular-ui/ui-router)
* [http://angular-translate.github.io/](http://angular-translate.github.io/)
* [https://github.com/marcorinck/angular-growl](https://github.com/marcorinck/angular-growl) (Si toujours pas d'evolution) [https://github.com/JanStevens/angular-growl-2/](https://github.com/JanStevens/angular-growl-2/)


### TODO

* Ecrire la doc avec [https://github.com/angular/dgeni](https://github.com/angular/dgeni)
* Tester et integrer [https://github.com/btford/grunt-ngmin](https://github.com/btford/grunt-ngmin)
* Fix le login et logout
* Faire une batterie de test
* Voir si la structure d'angular seed n'evolue pas
* Gestion des tests et des builds
* Hackaton ? Verifier toutes les secu webservices 
* Faire un audit de code ?
* Internationalization complete [http://angular-translate.github.io/](http://angular-translate.github.io/)
* Mettre a jour / Corriger les REST-URL.md
* Verifier la mise a jour de modules / node/ bower etc ...
* Vérifier les messages d'alertes / succes
* Trouver un moyen de savoir dans quelle section on est (breadcrumb ?)
* Responsive design 
* Logger les erreurs cote server [http://www.bennadel.com/blog/2542-Logging-Client-Side-Errors-With-AngularJS-And-Stacktrace-js.htm](http://www.bennadel.com/blog/2542-Logging-Client-Side-Errors-With-AngularJS-And-Stacktrace-js.htm)
