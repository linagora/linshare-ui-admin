# Definition des urls des services REST de LinshareNG.

## Introduction
### PUT vs POST:

Quelques articles :
- http://jcalcote.wordpress.com/2008/10/16/put-or-post-the-rest-of-the-story/
- http://restcookbook.com/HTTP%20Methods/put-vs-post/
- http://www.artima.com/lejava/articles/why_put_and_delete.html 


## Partages

GET     shares                  - liste des partages
GET     shares/{uuid}           - les informations sur un partage
POST    shares                  - créer un/des partage(s)
POST    shares/{uuid}/import    - importer un document d’un partage (recopie dans l’espace personnel)
DELETE  shares/{uuid}           - supprimer un partage 

## Documents

GET     documents                         - liste des documents 
GET     documents/{uuid}                  - les informations sur un document 
GET     documents/{uuid}/thumbnail        - le thumbnail du document
GET     documents/{uuid}/download         - télécharger un document
POST    documents                         - créer un nouveau document (documentEntry)
POST    documents/{uuid}/cipher           - chiffrer un document
POST    documents/{uuid}/sign             - signer un document
PUT     documents/{uuid}                  - mise à jour du titre et du commentaire
DELETE  documents/{uuid}                  - supprimer un document


## Utilisateurs

GET     users                             - liste des utilisateurs
GET     users/authorized                  - connexion des utilisateurs
GET     users/{uuid}                      - les informations sur un compte
GET     users/{pattern}                   - cherche un utilisateur grâce à un pattern
PUT     users/{uuid}                      - créer ou modifier un compte invité
DELETE  users/{uuid}                      - supprimer un compte


## Threads

GET     threads                           - liste des threads 
GET     threads/{uuid}                    - les informations sur un thread
GET     threads/{uuid}/entries            - liste les thread entries un thread
GET     threads/{uuid}/members            - liste des membres d’un thread
POST    threads                           - créer un thread
POST    threads/{uuid}/entries            - créer une thread entry
POST    threads/{uuid}/members            - créer un thread member
PUT     threads/{uuid}                    - modifier un thread 
DELETE  threads/{uuid}                    - supprimer un thread

## Thread entries 

GET     thread_entries/{uuid}             - les informations sur une thread entry
PUT     thread_entries/{uuid}             - modifier une thread entry (nom & commentaire)
DELETE  thread_entries/{uuid}             - supprimer une thread entry 

## Thread members

GET     thread_members/{uuid}             - les informations sur un thread member
PUT     thread_members/{uuid}             - modifier un thread member
DELETE  thread_members/{uuid}             - supprimer un thread member


## Administration

GET     admin/authorized                                      - connexion des admins

### Domains

GET     admin/domains                                         - arbre des domaines
GET     admin/domains/{uuid}/subdomains                       - liste des sous domaines
GET     admin/domains/{uuid}/guestdomain                      - les informations du sous domaine invité
GET     admin/domains/{uuid}/functionnalities                 - liste les fonctionnalités du domaines
GET     admin/domains/{uuid}/functionnalities/{uuid}          - les informations d’une fonctionnalité particulière
POST    admin/domains                                         - créer un domaine
POST    admin/domains/{uuid}/subdomains                       - créer sous domaine
POST    admin/domains/{uuid}/guestdomain                      - créer sous domaine invité
PUT     admin/domains/{uuid}                                  - modifier un domaine
PUT     admin/domains/{uuid}/subdomains/{uuid}                - modifier un sous domaine
PUT     admin/domains/{uuid}/guestdomain/{uuid}               - modifier un sous domaine invité
DELETE  admin/domains/{uuid}                                  - supprimer un domaine
DELETE  admin/domains/{uuid}/subdomains/{uuid}                - supprimer un sous domaine
DELETE  admin/domains/{uuid}/guestdomain/{uuid}               - supprimer un sous domaine invité


### LDAP connections

GET     admin/ldap_connections            - liste les connexions LDAP
POST    admin/ldap_connections            - créer une connexion LDAP
PUT     admin/ldap_connections/{uuid}     - modifier une connexion LDAP
DELETE  admin/ldap_connections/{uuid}     - supprimer une connexion LDAP


### Domain patterns

GET     admin/domain_patterns            - liste les domain patterns
POST    admin/domain_patterns            - créer un domain pattern
PUT     admin/domain_patterns/{uuid}     - modifier un domain pattern
DELETE  admin/domain_patterns/{uuid}     - supprimer un domain pattern


### Fonctionnalités

GET     admin/functionnalities                          - liste les fonctionnalités
GET     admin/functionnalities/{uuid}                   - les informations sur une fonctionnalité
PUT     admin/functionnalities/{uuid}                   - modifier les paramètres d’une fonctionnalité
PUT     admin/functionnalities/{uuid}/configuration     - modifier une politique de configuration d’une fonctionnalité
PUT     admin/functionnalities/{uuid}/activation        - modifier une politique d’activation d’une fonctionnalité

### Threads

GET     admin/threads                           - liste des threads 
GET     admin/threads/{uuid}                    - les informations sur un thread
GET     admin/threads/{uuid}/members            - liste des membres d’un thread
POST    admin/threads/{uuid}/members            - créer un thread member
PUT     admin/threads/{uuid}                    - modifier un thread 
DELETE  admin/threads/{uuid}                    - supprimer un thread


### Thread members

GET     admin/thread_members/{uuid}             - les informations sur un thread member
PUT     admin/thread_members/{uuid}             - modifier un thread member
DELETE  admin/thread_members/{uuid}             - supprimer un thread member

