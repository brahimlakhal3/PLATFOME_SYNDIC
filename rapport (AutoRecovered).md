

<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

# **RAPPORT DE STAGE** 

**_Ingénierie des logiciels et Intelligence Artificielle_** 

**_Département d’Informatique_** 



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

## **Remerciements** 

Avant d’entamer ce rapport, je tiens à exprimer ma profonde gratitude et mes sincères remerciements à toutes les personnes qui ont contribué au bon déroulement de mon stage et à l'élaboration de ce travail. Je remercie tout d'abord **Mr. Nizar Benharbet** , Directeur de **CAD Digital Agency** , pour m'avoir ouvert les portes de l'entreprise et m'avoir offert l'opportunité d'intégrer une équipe aussi innovante. Mes remerciements s'adressent tout particulièrement à mon responsable de stage, **Mr. XXXXX XXXXX** , pour sa confiance, son encadrement et ses précieux conseils techniques. Travailler sur des projets complexes utilisant **Next JS** et **Prisma** sous sa supervision a été une expérience extrêmement formatrice, notamment pour apprendre à intégrer un projet en cours de développement. Je tiens également à exprimer ma reconnaissance envers le corps professoral de **l'ENSA Fès** , et plus spécifiquement mon formateur, **Mr. XXXXX XXXXX** , pour son soutien pédagogique et les compétences fondamentales en **Ingénierie des logiciels** qu'il m'a transmis. Enfin, je remercie l'ensemble des collaborateurs de CAD Digital Agency pour leur accueil chaleureux, leur aide technique et l'esprit d'équipe stimulant qui règne au sein de l'agence. 



---

## 📑 **TABLE DES MATIÈRES**

1. [PAGE DE GARDE ET REMERCIEMENTS](#remerciements)
2. [RÉSUMÉ ET ABSTRACT (FRANÇAIS & ANGLAIS)](#résumé-global)
3. [CHAPITRE 1 : L'ENTREPRISE D'ACCUEIL ET LE CONTEXTE DU PROJET](#chapitre-1)
   - 1.1 Présentation de l'Entreprise d'Accueil (CAD Digital Agency)
     - 1.1.1 Présentation Générale — M. Nizar Benharbit Alami, fondateur
     - 1.1.2 Domaines d'Activité (Digital, Formation, Immobilier, Construction)
     - 1.1.3 Organisation Administrative — Mme Imane Idrissi
     - 1.1.4 Fiche Signalétique (Tableau récapitulatif)
   - 1.2 Contexte et Problématique du Projet
     - 1.2.1 Contexte Général de la Copropriété au Maroc
     - 1.2.2 Problématique et Obstacles Métiers
     - 1.2.3 Nécessité d'une Solution Digitale
   - 1.3 Objectifs de la Plateforme SyndicApp et Rôle du Stagiaire
     - 1.3.1 Objectif Général de la Plateforme
     - 1.3.2 Rôle et Responsabilités du Stagiaire
4. [CHAPITRE 2 : ANALYSE DES BESOINS ET CAHIER DES CHARGES](#chapitre-2)
   - 2.1 Analyse de l'Existant et Opportunité du Projet
     - 2.1.1 Diagnostic de la Gestion Traditionnelle
     - 2.1.2 Opportunité et Valeur Ajoutée de SyndicApp
   - 2.2 Spécification des Besoins Fonctionnels (Cas d'Utilisation CU-01 à CU-17)
     - Module 1 : Authentification et Gestion des Rôles
     - Module 2 : Gestion de la Copropriété et des Lots
     - Module 3 : Pilotage Financier et Gestion Budgétaire
     - Module 4 : Recouvrement des Cotisations et Édition de Reçus
     - Module 5 : Sondages et Consultations Obligatoires
     - Module 6 : Communication et Messagerie
   - 2.3 Spécification des Besoins Non-Fonctionnels
     - 2.3.1 Sécurité et Confidentialité des Données
     - 2.3.2 Performance et Scalabilité (Neon Postgres Serverless)
     - 2.3.3 Maintenabilité et Qualité du Code (TypeScript)
     - 2.3.4 Ergonomie et Adaptabilité (Responsive Design)
5. [CHAPITRE 3 : ARCHITECTURE LOGICIELLE ET CONCEPTION](#chapitre-3)
   - 3.1 Acteurs du Système (Syndic, Copropriétaire, Visiteur)
   - 3.2 Diagramme Global des Cas d'Utilisation
   - 3.3 Stack Technologique et Architecture Cloud (Next.js 16, Prisma ORM 7.8, Neon Postgres, Cloudflare Edge)
   - 3.4 Modèle Logique de Données (MLD / ERD Prisma & Dictionnaire des Tables)
6. [CHAPITRE 4 : RÉALISATION TECHNIQUE ET FONCTIONNALITÉS PAR MODULES](#chapitre-4--réalisation-technique-et-fonctionnalités-par-modules)
   - Module 1 : Site Vitrine & Authentification (Page Vitrine, Login, Signup)
   - Module 2 : Administration et Gestion des Ressources (Tableau de Bord Syndic, Bureaux, Copropriétaires)
   - Module 3 : Gestion Financière et Comptabilité (Budget Prévisionnel, Dépenses Exceptionnelles, Suivi des Paiements & Reçus)
   - Module 4 : Prise de Décision et Communication (Sondages, Modale Bloquante, Mur d'Annonces, Messagerie Directe)
   - Module 5 : Portail et Espace Copropriétaire (Mes Lots, Quotes-Parts, Paiements Récents)
7. [CHAPITRE 5 : CONCLUSION ET PERSPECTIVES D'ÉVOLUTION](#chapitre-5--conclusion-et-perspectives-dévolution)
   - 5.1 Bilan Général du Projet & Apports du Stage
   - 5.2 Perspectives d'Évolution Fonctionnelles & Métiers (Paiement CMI, IA Prédictive, OCR Factures)
   - 5.3 Perspectives d'Évolution Techniques & Architecturales (App Mobile Native, WhatsApp API, IoT)
   - 5.4 Feuille de Route & Roadmap d'Évolution (Tableau Récapitulatif)
8. [RÉSUMÉ GLOBAL & GLOBAL SUMMARY](#résumé-global)
9. [LISTE DES ABRÉVIATIONS ET DÉFINITIONS MÉTIER](#list-des-abréviations)
10. [CADRE JURIDIQUE : LOI N° 18.00 ET LOI N° 106-12 SUR LA COPROPRIÉTÉ AU MAROC](#loi-n-1800--relative-au-statut-de-la-copropriété-des-immeubles-bâtis)

---

### **CHAPITRE 1** 

### **L’ENTREPRISE D’ACCUEIL** 

### **CAD DIGITAL AGENCY** 

**PRÉSENTATION DE L'ENTREPRISE D'ACCUEIL** 

###### **Présentation Générale — M. Nizar Benharbit Alami, fondateur** 

CAD Digital Agency est une entreprise marocaine fondée et dirigée par M. Nizar Benharbit Alami, Fondateur et Directeur Général. L'entreprise développe ses activités dans plusieurs domaines, notamment le digital, la communication, la formation professionnelle, l'immobilier ainsi que la commercialisation de matériaux de construction. 

La création de CAD Digital Agency est le fruit de l'expérience professionnelle de son fondateur, qui dispose de plus de 20 ans d'expérience dans les domaines du bâtiment, de la construction et de l'aménagement. Cette expérience, associée à son intérêt pour le domaine du digital et aux évolutions technologiques, a contribué à la création de l'entreprise et au développement de ses différentes activités. 

###### **Domaines d'Activité** 

- Dans le domaine du digital, CAD Digital Agency accompagne les entreprises et les professionnels dans le développement de leur présence numérique, notamment à travers : 

   - La communication digitale et la création de contenu 

   - Le marketing digital 

   - La conception de solutions web 

   - L'accompagnement des projets digitaux 

- L'entreprise développe également des activités de formation professionnelle, avec des formations orientées vers différents métiers et compétences répondant aux besoins et aux évolutions du marché de l'emploi. 

- Par ailleurs, CAD Digital Agency développe des activités dans le secteur de l'immobilier. En complément, l'entreprise assure également la 



<!-- Start of picture text -->
Dens*<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
CAD<br>aO= ee<br>A A Ae oy Dares Slget healer<br>- Fas<br>| a Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

commercialisation de produits et matériaux de construction, une activité qui s'inscrit dans la continuité de l'expérience de son fondateur dans le domaine du bâtiment et de l'aménagement. 

###### **Organisation Administrative** 

Sur le plan administratif, Mme Imane Idrissi, Responsable Administrative, assure notamment le suivi des opérations administratives, des documents et contrats, des communications ainsi que l'organisation et le suivi administratif de l'entreprise. 

###### **Fiche Signalétique — Tableau récapitulatif** 

|**Élément**|**Détail**|
|---|---|
|Raison sociale|CAD Digital Agency|
|Fondateur, Directeur général|M. Nizar Benharbit Alami|
|Responsable Administrative|Mme Imane Idrissi|
|Secteurs d'activité|Digital Communication Formation Immobilier|
|Localisation|Fès : Rue Al Hoceima, Quartier Atlas|



Ainsi, CAD Digital Agency se caractérise par une diversification de ses activités, avec une volonté de développer des services complémentaires et de s'adapter aux besoins du marché. 

##### **CONTEXTE ET PROBLÉMATIQUE DU PROJET** 

##### **Contexte Général de la Copropriété au Maroc** 

Au Maroc, l'urbanisation rapide et le développement des complexes résidentiels et tertiaires ont entraîné une augmentation significative du nombre d'immeubles régis par le régime de la copropriété : encadré par la Loi 18-00 modifiée par la Loi 106-12. La gestion des parties communes et des finances de l'immeuble est traditionnellement confiée à un Syndic de copropriété bénévole ou professionnel. Cependant, la majorité des syndics utilisent encore des méthodes traditionnelles : cahiers papier, tableaux Excel disjoints, 



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

encaissements informels, qui montrent aujourd'hui leurs limites face aux exigences modernes de gestion. 

##### **Problématique et Obstacles Métiers** 

L'analyse de l'écosystème de gestion de copropriété fait ressortir quatre problématiques majeures : 

- **Manque de Transparence Financière et Défiance :** Les copropriétaires manquent de visibilité sur l'utilisation réelle de leurs cotisations. L'absence de bilans comptables clairs, de justificatifs numérisés et de reçus systématiques génère de la défiance et freine la dynamique de paiement. 

- **Taux d'Impayés Élevé et Recouvrement Inefficace :** En l'absence d'outils automatisés de relance et de suivi en temps réel des échéanciers mensuels, le syndic accumule des retards de paiement considérables, compromettant le règlement des charges courantes : électricité des communs, gardiennage, ascenseur. 

- **Lourdeur Administrative et Erreurs de Calcul :** La répartition manuelle des dépenses imprévues : travaux urgents, réparations, au prorata des quote-part privatives et communes tantièmes de chaque lot est une tâche complexe et sujette aux erreurs de calcul. 

- **Blocage des Prises de Décision :** La faible participation physique des copropriétaires aux Assemblées Générales ralentit l'adoption de résolutions cruciales pour la maintenance et la rénovation des bâtiments. 

##### **Nécessité d'une Solution Digitale** 

Pour surmonter ces contraintes, l'adoption d'une plateforme Web moderne, accessible 24/7 sur tout type d'appareil, s'impose comme une nécessité stratégique pour moderniser la relation Syndic-Copropriétaires. 

##### **OBJECTIFS ET DE LA PLATEFORME ET MA MISSION** 

La plateforme Syndic App a été conçue pour apporter une réponse technologique complète et intuitive aux problématiques identifiées. 



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

##### **Objectif général de la plateforme Syndic App** 

Centraliser l'ensemble des données administratives et financières de la copropriété au sein d'une base de données unique et sécurisée dans le Cloud. 

Offrir deux interfaces étanches et adaptées aux rôles de l'utilisateur : un espace d'administration pour le Syndic et un espace de consultation/interaction pour le copropriétaire. 

##### **Rôle et Responsabilités du Stagiaire** 

En tant que stagiaire développeur full-stack au sein du pôle ingénierie logicielle de CAD Digital Agency, mon rôle a couvert l'ensemble des phases du projet : 

- **Analyse et Conception :** Rédaction des spécifications fonctionnelles, modélisation des diagrammes UML et conception du modèle de données sous Prisma ORM. 

- **Développement Frontend :** Création des composants UI réactifs et accessibles avec Next.js App Router, React et Tailwind CSS. 

- **Développement Backend :** Implémentation des routes API serverless, gestion de l'authentification sécurisée (RBAC, JWT, bcryptJS) et intégration avec la base Neon PostgreSQL. 

- **Qualité et Recette :** Réalisation des tests d'intégration, vérification du typage strict TypeScript et rédaction de la documentation technique. 



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

#### **_CHAPITRE 2_** 

#### **_ANALYSE DES BESOINS ET CAHIER DES CHARGES_** 

##### **2.1 ANALYSE DE L'EXISTANT ET OPPORTUNITÉ DU PROJET** 

###### **2.1.1 Diagnostic de la Gestion Traditionnelle** 

Au Maroc, la gestion des immeubles et complexes administratifs repose encore largement sur des méthodes traditionnelles et manuelles. Cette organisation génère plusieurs faiblesses majeures : 

- Lourdeur Administrative et Risque d'Erreurs 

- Manque de Transparence et Conflits de Copropriété 

- Taux d'Impayés Élevé et Déficit de Trésorerie 

- Lenteur des Prises de Décision 

###### **2.1.2 Opportunité et Valeur Ajoutée de Syndic App** 

L'introduction de la plateforme Syndic App répond directement à cette problématique en digitalisant l'ensemble de la chaîne de gestion : 

- **Centralisation sur le Cloud :** Une plateforme unique accessible 24h/24 et 7j/7 depuis n'importe quel équipement (PC, tablette, smartphone). 

- **Calcul Automatisé des Quotes-Parts :** Ventilation exacte et équitable des charges selon les tantièmes juridiques de chaque lot. 

- **Transparence Financière :** Consultation en temps réel des soldes, historique des règlements et téléchargement de reçus certifiés. 

- **Démocratie Participative :** Mise en place d'un système de sondages électroniques obligatoires favorisant la prise de décision rapide. 

##### **2.2 SPÉCIFICATION DES BESOINS FONCTIONNELS** 

Les besoins fonctionnels décrivent l'ensemble des services et interactions offerts par l'application aux différents utilisateurs : 



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

###### **Module 1 : Authentification et Gestion des Rôles** 

**CU-01 -** Connexion Sécurisée : Accès par identifiant et mot de passe chiffré, avec redirection automatique selon le rôle, Dashboard Syndic ou Copropriétaire. 

**CU-02 -** Inscription des Syndics : Création d'un compte administrateur avec saisie des informations initiales de la résidence. 

**CU-03 -** Gestion des Identifiants : Réinitialisation des paramètres d'accès 

###### **Module 2 : Gestion de la Copropriété et des Lots** 

**CU-04 -** Administration des Bureaux/Lots : Création, modification et suppression des unités physiques : numéro de lot, étage, titre foncier, surface. 

**CU-05 -** Attribution des Quote-Part : Définition de la quote-part privative et de la quote-part commune servant de clé de calcul budgétaire. 

**CU-06 -** Gestion des Résidents & Vacances : Association d'un copropriétaire à un ou plusieurs lots, avec prise en charge des unités vacantes. 

###### **Module 3 : Pilotage Financier et Gestion Budgétaire** 

**CU-07 -** Établissement du Budget Prévisionnel : Définition des charges récurrentes annuelles et mensuelles, avec distinction entre Charges fixes et Charges Variables. 

**CU-08 -** Joindre des Justificatifs : Attachement de fichiers ou de devis numériques pour documenter la préparation du budget. 

**CU-09 -** Enregistrement des Dépenses Exceptionnelles : Saisie des factures de travaux imprévus et calcul de la ventilation automatique au prorata des quotepart communes. 

###### **Module 4 : Recouvrement des Cotisations et Édition de Reçus** 

**CU-10 -** Génération Automatique des Échéanciers : Création automatique des 12 échéances mensuelles de paiement par bureau pour l'année en cours. 

**CU-11 -** Suivi des Règlements : Visualisation des statuts de paiement et enregistrement des montants réellement perçus par le syndic. 



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

**CU-12 -** Impression des Reçus de Caisse : Génération et impression automatique de reçus officiels valant pièces justificatives pour les résidents. 

###### **Module 5 : Sondages et Consultations Obligatoires** 

**CU-13 -** Création & Clôture par le Syndic : Lancement d'une consultation électronique et possibilité pour le syndic de fermer le vote via un bouton de clôture dédié. 

**CU-14 -** Fenêtre Modale Prioritaire : Détection automatique des votes non répondus lors de la connexion du copropriétaire. 

**CU-15 -** Votes Successifs Enchaînés : Affichage progressif des sondages actifs un par un, permettant au copropriétaire de traiter toutes les consultations en attente. 

###### **Module 6 : Communication et Messagerie** 

**CU-16 -** Mur d'Annonces Communautaire : Publication d'alertes ou de notes officielles par le syndic, avec possibilité pour les résidents d'émettre des commentaires. 

**CU-17 -** Messagerie Privée Directe : Canal de discussion confidentiel et direct entre le syndic et chaque copropriétaire. 

##### **2.3 SPÉCIFICATION DES BESOINS NON-FONCTIONNELS** 

Les besoins non-fonctionnels garantissent la qualité technique, la sécurité et l'ergonomie globale de l'application : 

###### **2.3.1 Sécurité et Confidentialité des Données** 

- **Hachage des Mots de Passe :** Chiffrement des mots de passe en base de données avec l'algorithme fort bcryptJS. 

- **Isolation des Données :** Cloisonnement strict des accès empêchant un copropriétaire de visualiser la situation financière d'un autre lot. 

- **Protection des Sessions :** Gestion des token d'authentification transmis via des cookies sécurisés pour prévenir les attaques XSS et CSRF. 

###### **2.3.2 Performance et Scalabilité** 



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

- **Temps de Réponse Optimisés :** Exécution des requêtes API sous la barre des 200 ms grâce à l’auto-génération optimisée du client Prisma ORM. 

- **Base de données Serverless :** Exploitation des capacités d'auto-scaling 

   - et de Connection Pooling de Neon Postgres pour absorber les pics de trafic lors des appels de fonds mensuels. 

###### **2.3.3 Maintenabilité et Qualité du Code** 

- **Typage Statique Fort :** Utilisation du langage TypeScript sur 100% du code source pour détecter les erreurs dès la phase de compilation. 

- **Architecture Modulaire :** Organisation en composants réutilisables sous Next.js App Router facilitant l'ajout de futurs modules. 

###### **2.3.4 Ergonomie et Adaptabilité (Responsive Design)** 

- **Compatibilité Multi-Écrans :** Interface développée avec Tailwind CSS, s'adaptant parfaitement aux écrans d'ordinateurs et des smartphones. 

- **Design Professionnel :** Suppression des émojis au profit d'icônes vectorielles SVG élégantes, garantissant une esthétique sobre et adaptée au domaine de l'immobilier. 



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

## **_CHAPITRE 3_** 

## **_ARCHITECTURE LOGICIELLE ET CONCEPTION_** 

##### **3.1 ACTEURS DU SYSTÈME** 

L'analyse des cas d'utilisation repose sur quatre acteurs clés qui interagissent avec l'application : 

###### **Le Syndic (Administrateur / Gestionnaire) :** 

Utilisateur à privilèges d'administration. Il est responsable de la gestion globale de l'immeuble, de l'annuaire des copropriétaires, du suivi financier (budget prévisionnel, dépenses, relances d'impayés) et de l'organisation des sondages. 

###### **Le Copropriétaire (Utilisateur Résident) :** 

Propriétaire ou locataire titulaire d'un ou plusieurs lots (bureaux/locaux). Il dispose d'un espace privé pour consulter ses quotes-parts, suivre l'historique de ses cotisations, répondre aux sondages obligatoires et échanger avec le syndic. 

###### **Le Visiteur (Utilisateur Non Authentifié) :** 

Toute personne physique accédant au site web sans session ouverte. Il peut consulter la page vitrine publique, s'inscrire en tant que nouveau Syndic ou accéder à la page de connexion. 

##### **3.2 DIAGRAMME GLOBAL DES CAS D'UTILISATION** 

Le diagramme de cas d’utilisation modélise les interactions entre les acteurs du système et les fonctionnalités offertes par la plateforme Syndic App. Deux acteurs principaux sont identifiés : Syndic, qui dispose d’un accès complet au système, et le copropriétaire, qui bénéficie d’un accès en lecture seule. 



<!-- Start of picture text -->
= = TNO AD Ane op Aare Spot4 Maralor<br>DENS<br>| oe Université Sidi Mohamed Ben Abdellah - Fés<br><!-- End of picture text -->



<!-- Start of picture text -->
ENSA<br>5<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
soprepreacs ajouter/modifier/<br>Creaction de Budget<br>prévisionnel visualiser dashbord<br>Gérer les dépenses ajouter / supprimer Visualiser les les<br>bureau<br>Enregister les ‘marquer payer / - -<br>paiement impayer a<br>paiement:<br>Creaction des<br>sondages Voté les sondages<br>messages a messages<br>visualiser dashbord<br>telecharger le<br>rapport<br><!-- End of picture text -->

##### **3.3 STACK TECHNOLOGIQUE ET ARCHITECTURE CLOUD** 

L'architecture applicative de Syndic App s'appuie sur une infrastructure modernisée à trois piliers : un Framework full stack réactif (Next.js / React), un réseau d'hébergement global sécurisé (Cloudflare), et une base de données cloud de dernière génération (Neon PostgreSQL via Prisma ORM). 

###### **3.2.1 Framework applicatif & Interface (Next.js 16, React & TypeScript)** 

- **Next.js 16 :** Assure le rendu côté serveur SSR et héberge les Routes API Serverless, évitant d'avoir à maintenir un serveur Node.js indépendant. 

- **TypeScript :** Garantit un typage statique rigoureux du code source, prévenant les erreurs lors de la manipulation des données financières ou des statuts de paiement. 

- **Tailwind CSS :** Permet la création d'une interface responsive et épurée 

###### **3.2.2 Persistance & Base de Données Cloud (Prisma ORM & Neon)** 

Le stockage et la gestion des données reposent sur le couple Prisma ORM et Neon PostgreSQL (neon.tech) : 



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

###### **Prisma ORM (Version 7.8) :** 

Génère automatiquement le client TypeScript à partir du fichier schema.prisma, et assure la gestion des migrations de base de données versionnées et reproductibles. 

###### **Neon Serverless PostgreSQL :** 

- **Database Branching :** Duplication instantanée de la base de données de production sous forme de branches pour tester les migrations Prisma sans aucun risque. 

- **Auto-Scaling & Scale-to-Zero :** Ajustement dynamique des ressources CPU/RAM lors des pics d'accès et mise en veille automatique pendant les heures d'inactivité. 

- **Connection Pooling Native :** Gestion intégrée du pool de connexions (Prisma Connection Pooler) pour garantir la stabilité des requêtes Serverless. 

- **Point-In-Time Restore (PITR) :** Sauvegardes continues permettant la restauration de la base à n'importe quelle seconde. 

###### **3.2.3 Hébergement & Réseau Edge (Cloudflare)** 

L'application est déployée et sécurisée via la plateforme Cloudflare, apportant plusieurs garanties d'infrastructure : 

- **Déploiement Edge & CDN Global :** Distribution ultra-rapide des actifs statiques et pages web au plus près des utilisateurs grâce au réseau mondial de Cloudflare. 

- **Sécurité & Protection Anti-DDoS :** Protection native contre les attaques de déni de service, pare-feu applicatif (WAF) et gestion automatique des certificats SSL/TLS. 

- **Résolution DNS & Caching :** Temps de résolution DNS optimisé et mise en cache intelligente des ressources pour soulager le serveur. 



<!-- Start of picture text -->
ENSA<br>5<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
tS AN Dee oy Dares Sree Aralor<br>=9= ;<br>DENS<br>|} eae Université Sidi Mohamed Ben Abdellah - Fés<br><!-- End of picture text -->

##### **3.4 MODÈLE LOGIQUE DE DONNÉES ET ANALYSE DES TABLES** 

Le Modèle Logique de Données ci-dessous représente la structure logique de la base de données de l’application **Syndic App** . Il présente les principales tables du système ainsi que les relations entre elles à travers les clés primaires et étrangères. Ce modèle permet d’organiser les données relatives aux utilisateurs, bureaux, paiements, charges, dépenses, messages et votes, tout en assurant la cohérence et l’intégrité des informations. 



<!-- Start of picture text -->
bureau_id depense_id message_id<br>user_id syndic_id sender_id<br>syndic_id |__) receiver_id<br>(weer)<br>paiement_id user_id syndic_id<br>bureau_id syndic_id vote_id<br>- groupemessage_id vote_response_id<br>syndic id sender_id user_id<br><!-- End of picture text -->

###### **1. Table User (Gestion des Utilisateurs)** 

La table User centralise l'annuaire des utilisateurs du système. Elle gère les profils administrateurs syndics et copropriétaires résidents via un modèle d'auto-référence assurant un contrôle d'accès sécurisé. 

|**Attribut**|**Description**|
|---|---|
|ID|Identifiant unique et primaire du compte utilisateur|
|Nom|Nom de famille officiel de l'utilisateur|
|Prénom|Prénom de l'utilisateur|
|Password|Mot depasse chiffré de manière sécurisée avec bcryptJS|





<!-- Start of picture text -->
ar a<br>.<br>Fes<br>2"<br><!-- End of picture text -->



<!-- Start of picture text -->
ld = i dus darve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>ros a<br>ow Université Sidi Mohamed Ben Abdellah - Fés<br><!-- End of picture text -->

|Adresse|Adresse de résidence ou de contact de l'utilisateur|
|---|---|
|Téléphone|Numéro de téléphone portable servant aussi d'identifiant|
|Rôle|Profil d'accès attribué ("syndic" ou "copropriétaire")|
|Syndic ID|Clé étrangère reliant le copropriétaire à son syndic référent|



###### **2. Table Bureau (Lots de la Copropriété)** 

La table Bureau représente l'ensemble des lots privatifs du bâtiment. Elle associe chaque unité physique à son propriétaire, enregistre son titre foncier et calcule les quote-part de charges communes. 

|**Attribut**|**Description**|
|---|---|
|ID|Identifiant unique du lot ou bureau|
|Num Bureau|Numéro d'identification du bureau dans l'immeuble|
|Nom|Libellé commercial ou nom attribué au local|
|Étage|Numéro de l'étage où se situe le bien immobilier|
|Titre Foncier|Numéro d'immatriculation légal auprès de la<br>conservation foncière|
|Quotepart Privée|Superficie utile exclusive du bureau exprimée|
|Quotepart<br>Communes|Fraction d'ownership des espaces communs|
|User ID|Clé étrangère du propriétaire|
|Syndic ID|Clé étrangère du syndic gérant l'immeuble|



###### **3. Table Charge (Budget Prévisionnel Annuel)** 

La table Charge définit le budget prévisionnel annuel de la copropriété. Elle catégorise les dépenses prévues en charges fixes ou variables et permet l'attachement de devis justificatifs d'administration. 



<!-- Start of picture text -->
= A ae oy dare gee hale<br>- Fas<br>oe Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->



<!-- Start of picture text -->
a<br>Pes<br><!-- End of picture text -->

|**Attribut**|**Description**|
|---|---|
|ID|Identifiant unique de la charge budgétaire|
|Libelle|Intitulé de la dépense récurrente|
|Description|Explications complémentaires sur le poste de dépense|
|Montant Annuel|Estimation du montant total prévisionnel sur l'année|
|Montant Mensuel|Déclinaison du montant à payer chaque mois en DH|
|Type Fixe|Type de charge (true = charge fixe, false = charge variable)|
|Image Url|Lien vers la pièce justificative numérisée du devis|
|Année|Année budgétaire de rattachement de la charge|
|Syndic ID|Clé étrangère du syndic créateur du budget|



###### **4. Table Dépense (Frais Réels Exceptionnels)** 

La table Dépense enregistre les factures réelles des travaux exceptionnels imprévus. Elle permet de ventiler automatiquement le montant total des interventions sur les copropriétaires selon leurs quote-part communes réelles associées. 

|**Attribut**|**Description**|
|---|---|
|ID|Identifiant unique de la dépense d'urgence|
|Libelle|Nature des travaux ou des réparations exécutées|
|Montant|Somme totale réglée pour l'intervention en DH|
|Mois Départ|Mois d'exécution et de comptabilisation des travaux|
|Année|Exercice annuel d'enregistrement de la facture|
|Image Url|Lien vers la copie numérisée de la facture acquittée|
|Syndic ID|Clé étrangère du syndic ayant saisi la dépense|



###### **5. Table Paiement (Échéancier Mensuel & Cotisations)** 



<!-- Start of picture text -->
2 a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
ro= ao<br>NS = AYSidiaeMohamed oy Dares SogeeBen Abdellah healer- Fas<br>| oe Université<br><!-- End of picture text -->

La table Paiement assure le suivi mensuel des cotisations de chaque lot. Générée automatiquement par exercice annuel, elle enregistre les versements réels et applique une contrainte d'unicité anti-doublons. 

|**Attribut**|**Description**|
|---|---|
|ID|Identifiant unique de la ligne de paiement|
|Mois|Mois concerné par l'appel de fonds|
|Année|Année de l'exercice financier d'appel des fonds|
|Montant|Somme théorique exigée calculée au prorata du lot en DH|
|Montant Réel|Montant réellement encaissé par le syndic en DH|
|Statut|État du règlement : payé impayé partiel|
|Bureau ID|Clé étrangère du bureau redevable du paiement|



###### **6. Table Vote (Sondages & Consultations)** 

La table Vote gère les consultations et scrutins électroniques créés par le syndic. Elle stocke l'état actif du sondage, ses objectifs descriptifs et permet d'organiser la décision collective. 

|**Attribut**|**Description**|
|---|---|
|ID|Identifiant unique de la consultation|
|Titre|Intitulé ou sujet soumis au vote des copropriétaires|
|Description|Explication détaillée des enjeux et objectifs du vote|
|Actif|Statut du scrutin : true = ouvert aux votes, false = clôturé|
|Syndic ID|Clé étrangère du syndic organisateur du sondage|



###### **7. Table Vote Response (Suffrages Exprimés)** 



<!-- Start of picture text -->
= A ae oy dare gee hale<br>—O— oe<br>SidiMohamed Ben Abdellah- Fés<br>| oe Université<br><!-- End of picture text -->



<!-- Start of picture text -->
4<br>a<br>a<br>Fes<br><!-- End of picture text -->

La table Vote Response enregistre les suffrages individuels exprimés par les copropriétaires. Elle garantit l'unicité de la participation par votant et calcule la répartition des voix pour chaque résolution proposée. 

|**Attribut**|**Description**|
|---|---|
|ID|Identifiant unique de la réponse exprimée|
|Vote ID|Clé étrangère du sondage auquel répond l'utilisateur|
|User ID|Clé étrangère du copropriétaire ayant voté|
|Choix|Vote exprimé par l'utilisateur : pour contre neutre|



###### **8. Table Group Message (Mur d'Annonces Communautaire)** 

La table Group Message sert de mur d'annonces communautaire pour la copropriété. Elle permet la publication de notes officielles par le syndic et l'émission d'observations publiques ou anonymes. 

|**Attribut**|**Description**|
|---|---|
|ID|Identifiant unique de la publication|
|Content|Contenu textuel de la note ou de la remarque sur le mur|
|Sender ID|Clé étrangère de l'auteur du message|
|Syndic ID|Clé étrangère de la copropriété destinataire|
|Is Anonymous|Option d'anonymat : true = nom de l'auteur masqué|



###### **9. Table Message (Messagerie Privée Directe)** 

La table Message assure le service de messagerie privée directe et confidentielle. Elle enregistre les échanges individuels entre le syndic et les copropriétaires, tout en assurant un suivi de lecture. 

|**Attribut**|**Description**|
|---|---|
|ID|Identifiant unique du message privé|
|Content|Texte confidentiel transmis dans la discussion|





<!-- Start of picture text -->
Cd= A Ae op daresSe Karr<br>amQaine Or +@AULt2 OLAL CIACC.ABiomeOl AGAMLD - HO<br>v. .y Université Sidi Mohamed Ben Abdellah - Fés<br><!-- End of picture text -->



<!-- Start of picture text -->
ENSAae a0<br><!-- End of picture text -->

|Lu|Indicateur de lecture : true = message lu, false = non lu|
|---|---|
|Sender ID|Clé étrangère de l'expéditeur du message|
|Receiver ID|Clé étrangère du destinataire du message|





<!-- Start of picture text -->
ENSA<br><!-- End of picture text -->



<!-- Start of picture text -->
A = AN Ae oy Dares Sige Laraler<br>ODoe +@AULove OLACccs CLACCAsana Olos ACAMLDnonmo - 1.0-e<br>v Y Université Sidi Mohamed Ben Abdeliah - Fés<br><!-- End of picture text -->

#### **_CHAPITRE 4 : RÉALISATION TECHNIQUE ET FONCTIONNALITÉS PAR MODULES_** 

**MODULE 1 : SITE VITRINE & AUTHENTIFICATION** 

###### **Page Vitrine Publique** 

Vitrine commerciale d'accueil présentant les atouts de la solution de copropriété. Elle valorise l'ensemble des modules (budget prévisionnel, gestion des lots, paiements automatisés, messagerie et consultations de vote) et propose des accès directs vers les formulaires de connexion et d'inscription. 



<!-- Start of picture text -->
©) caasyndic Fonctionnalités  Conformité Kigale Comment a marche «Se. connecter<br>Gérez votre copropriete en<br>toute zimplicité<br>CadSyndic vous offre une plateforme complete pour gérer vos lots,<br>copropriétaires, charges, paiements et communications — le tout dans<br>un espace centralisé et sécurisé.<br><!-- End of picture text -->

###### **Page de Connexion** 

Interface d'authentification sécurisée permettant aux administrateurs et aux résidents de saisir leurs identifiants de connexion et mot de passe. Le système valide les accès de manière cryptée et redirige l'utilisateur vers son espace dédié selon ses privilèges d'accès. 



<!-- Start of picture text -->
TD AD Ane op Aarree Signet Maralor<br>RS<br>5 -@) S @AUE OLA CLACCA Ol ABATED - 1.0<br>ve ea Université Sidi Mohamed Ben Abdellah - Fés<br><!-- End of picture text -->



<!-- Start of picture text -->
ENS mK<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
Espace de connexion " igs .<br>Acer & vote compte pour ger vs lots, cotsations et Simplifiez la gestion de vos<br>sonmsons immeubles au quotidien.<br>NUMERO DE TELEPHONE Suivi des charges prévisionnelles, automatisation des échéances<br>08 XX XX XX HK de paiement, ventilation des dépenses et consuttations<br>interactives.<br>® (o)<br>somata<br><!-- End of picture text -->

###### **Page d'Inscription Syndic** 

Formulaire de création de compte dédié aux nouveaux syndics administrateurs. Il permet d'enregistrer les coordonnées du gestionnaire ainsi que les caractéristiques de la résidence sous sa responsabilité. 



<!-- Start of picture text -->
Créer un compte syndic<br>copropricnes Une gestion moderne et<br>now PRENOM sereine pour vos<br>Et Arran Yousset copropriétés.<br>noma De TELEPHONE<br>Rejoignez des centaines de syndics qui simplifient la comptabilité,<br>06 XX XX XX XX le suivi des cotisations et la communication avec leurs<br>copropriétaires.<br>mor oe Asse a ic}<br>seveeeee Mutt-Immeubles Installation Rapide<br><!-- End of picture text -->

**MODULE 3 : ADMINISTRATION ET GESTION DES RESSOURCES** 

###### **Tableau de Bord d'Administration (Syndic)** 

Centre de commande principal du syndic. Il affiche les indicateurs clés de performance en temps réel (total des encaissements, cumul des impayés, nombre de copropriétaires inscrits, votes en cours), des graphiques de trésorerie et le journal des dernières activités de l'immeuble. 

Partie 1 : Cartes d'Indicateurs Clés (KPIs Généraux & Financiers) 



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

Description (40 mots) : 

Présente un ensemble de cartes synthétiques affichant le nombre de bureaux, de copropriétaires, le budget total attendu, les montants encaissés, le reste à recouvrer, le résultat net ainsi que le taux de recouvrement global de l'immeuble pour l'exercice financier sélectionné. 

Partie 2 : Grille de Suivi Mensuel & Export PDF (Vue Annuelle) 

Description (40 mots) : 

Affiche l'évolution financière sur les douze mois de l'année avec le détail des cotisations payées et impayées. Cette section comprend un sélecteur d'année et un bouton permettant de générer automatiquement un rapport comptable annuel téléchargeable au format officiel document PDF. 

Partie 3 : Modale de Détail des Opérations Mensuelles (Analyse Approfondie) Description (40 mots) : 

S'ouvre au clic sur un mois spécifique pour afficher la liste nominative des règlements par copropriétaire et le détail des dépenses effectuées. Elle permet au syndic d'analyser en profondeur les flux financiers et d'effectuer un suivi rigoureux de la copropriété. 

###### **Interface de Gestion des Bureaux et Lots** 

Page d'administration de l'inventaire des locaux professionnels et appartements. Le syndic peut créer, modifier ou supprimer des fiches de lots, renseigner le numéro d'étage, le titre foncier, définir la quote-part privative en mètres carrés, la quote-part commune en tantièmes, et gérer la vacance des locaux. 



<!-- Start of picture text -->
: S serene Shai ,<br>3 2:5 ea AP HOAUEUniversité OLALSidi MohamedCIACCA  BenOl  AbdellahAGAMLD -1.0- Fés<br><!-- End of picture text -->



<!-- Start of picture text -->
Fes.<br>»L<br><!-- End of picture text -->



<!-- Start of picture text -->
EY9 coasyncic Bureaux<br>Tableau © BureauB203 TEMAR-266 130 70 Rahmani Merlem Mosier Super<br>de bord<br>® Budget prévisionnelles 5 BureauB202 2° TF-MAR-265 160 20 Benall Ahmed ect Speier<br>k= 4 Bureaue201 2° TEMAR-264 180 ‘00 Hamidi Youcet Moar Spear<br>3 Bueauaws ot TEMAR263 110 55 Bethadj Reda Moder Super<br>Bo 2 Bureauawoz = TE-MAR-262 120 60 Meziane Karim eater (Supine<br>£3 iene 1 Bureauaior ot TEMAR-261 150 80 Cert Nadia Moder Spear<br>B communication<br>Messages<br>850 m? 455 m? 1305 m?<br><!-- End of picture text -->

###### **Interface de Gestion des Copropriétaires** 

Annuaire et gestion des comptes des résidents. Le gestionnaire y crée de nouveaux profils copropriétaires, met à jour leurs informations de contact, leur associe leurs lots respectifs et réinitialise leurs accès en cas d'oubli. 



<!-- Start of picture text -->
FYa») cassynaic" Copropriétaires<br>beatin ata pntnow om reutevone aonesse oe uneaux nenows<br>Toba Ranmani ——Merlem 0555200010 ——meknes veawstenns ° scant) (ae) (Sea<br>de bord<br>© duogetprvstonnetos Mansouri Khaled_-—-—-0555200009—_—taoujdat cerivexss g scar MOP Sapir<br>LE bxreoux Bethag) Reda (0555200007 si kacem aevaesorm ° soaner (ae) siprinr<br>Boe Bensaad ——Amina_—«=—=—0555200008 —meknes eer ° Moar MP Sapper<br>5 Pum Tiemeani Omar 0555200005 —_-meknes. concerts ° sotter oP siprinr<br>— Hamiai Youcet 0555200003 tes recente ° scares (ie) (ipa?<br>(icmeneen cherit Nadia (0800000005 agai eaeste 6 soatar MOP sippinr<br>Svea Boukhelfa Sara (0600000004 sid bouzide shuns ° Mostar MOP appre<br>Meziane Karim (0600000003 —_tetovan ar segoe ° soarar oP print<br>Bena ‘Ahmed 0800000002 fes earn ° seater M8 Sapna<br><!-- End of picture text -->

**MODULE 4 : GESTION FINANCIÈRE ET COMPTABILITÉ** 



<!-- Start of picture text -->
ENS w<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
TD AD Ane op Aarree Signet Maralor<br>RS<br>e Os SF @AsUEt OLE CHACEA Ol AGAILD -0<br>Ss ea Université Sidi Mohamed Ben Abdellah - Fés<br><!-- End of picture text -->

###### **Page du Budget Prévisionnel (Charges)** 

Interface de planification du budget annuel de l'immeuble. Le syndic y configure les charges récurrentes fixes (gardiennage, entretien) et variables (consommation d'eau, électricité), ajoute des images de devis justificatifs et obtient la synthèse automatique du budget prévisionnel global. 



<!-- Start of picture text -->
9 cassyncic Budget prévisionnel<br>brahim aka<br>one 2026<br>Gardiennage& Sécurité — r= 84,000 0H 7,000 0H = eer<br>HD bureaux Nettoyage & Entretien = roe 72,000 DH 6,000 DH = spine<br>28 coproprictares Electricité des Communs wits $4,000 DH 4,500 DH = superar<br>Ej epenses Maintenance Ascenseur = 78,000 DH 6500 DH s sweeemer<br>© Paiements: Eau des Communs - Variabie 42,000 DH 3,500 DH - ‘Supprimer<br>© sondages<br>B communication<br>234,000 DH 96,000 DH 330,000 DH<br><!-- End of picture text -->

###### **Page des Dépenses Exceptionnelles** 

Page de saisie des factures d'intervention réelles et imprévues (réparations d'urgence, travaux). Le système intègre un calculateur automatique qui ventile le coût total de la dépense sur chaque lot au prorata de sa quote-part commune. 



<!-- Start of picture text -->
ZX<br>g -@) AP HOAUE OLAL CIACCA Ol AGAMLD -1.0<br>A 3 ea Université Sidi Mohamed Ben Abdellah- Fés<br><!-- End of picture text -->



<!-- Start of picture text -->
Fés<br><!-- End of picture text -->



<!-- Start of picture text -->
a Dépenses mensuelles<br>brahim aka<br>2026 septembre» Choose<br>Tableau de bord Fin Noe chosen<br>® ‘Budget prévisonneles 2026 160,500 DH<br>EI] Bureaux<br>aieiiai23 Copropristaires Réparation Fuite Plomberie Principale 35,000 DH Janvier - “Supprimer<br>&_ Dopenses<br> Patements<br>Changement Serrure Porte Entrée 12,000 DH Mars - supper<br>© sondages Révision Annuelte Extincteurs 25,000 04 rt = supper<br>® Communication Peinture Couloir 2eme Etage 45,000 DH Juin - ‘Supprimer<br>& Messages Réparation Moteur Grile Parking 28,500 DH Septembre - supper<br><!-- End of picture text -->

###### **Page de Suivi des Paiements et Reçus** 

Outil de contrôle financier et de recouvrement. Il permet d'initialiser l'échéancier annuel des cotisations mensuelles, de suivre les statuts de règlement (Payé, Impayé, Partiel), de saisir les montants réellement encaissés et d'imprimer des reçus de caisse certifiés valant justificatifs officiels. 



<!-- Start of picture text -->
99EY coasynsic Paiements,<br>brain aha Bureau: | Tous Mois: | sanwier +) Stott: Tous») Année: 2028 +<br>Tableau de bord 12,569.61 DH 317,430.51DH 330,000.12 DH +0DH<br>© Budget prévisionnetios<br>Ey bureaux<br>BureauAatos 19750 ceinad) Resa Janvier 35090H 9,500.280H pa<br>&i28 Copropristaires: BureauB203 10500 RahmaniMeriem — danwer 42H azn ED<br>Dépenses Bureau ator 190.00 Ccherit Nadia Janvier 484904 48491904 oo<br>© Sondages Bureau A102 150.00 Meziane Karim Janvier 3828DH 36288 ome EES<br>Bureaus202 20500 BenallAhmed ——anvier-—«$2320H-—_sz5202 ~~ CED<br>3<br>Sulossages Bureaus201 23000 Mamidl Youcet——Janvier_-—«S8700H ——_se7007 ~~ C=<br><!-- End of picture text -->

**MODULE 5 : PRISE DE DÉCISION ET COMMUNICATION** 

###### **Page des Votes et Assemblées Générales** 



<!-- Start of picture text -->
ENS w<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
TD AD Ane op Aarree Signet Maralor<br>ZX<br>g -@) SP +.QAcUEt @LAC CIACEA Ol AGAMLD -XO<br>A 3 ea Université Sidi Mohamed Ben Abdellah - Fés<br><!-- End of picture text -->

Interface de création et d'administration des consultations électroniques. Le syndic y rédige les résolutions soumises au vote, suit en temps réel la participation et la répartition des voix (Pour, Contre, Neutre), et dispose d'un bouton de clôture pour arrêter les scrutins. 



<!-- Start of picture text -->
FYap) caasynaic” Sondages<br>Tableau de bord<br>© Budget prévisionnelies couRemplacementemplacement du motsdu Moteurusagépar d’Ascenseurun modele moderneit & basse consommation EREDos voune(oa tone<br>LE] bureaux ———Contreeda 3 votats (50%)<br>wotan (172%<br>2 conropristares Noute 1<br>i épenses<br>& Patements Installation de Caméras de Surveillance cw saa<br>Pour Svotats (63%<br>()© cemenrtcatinMesseces eeConteNeutre___———— ————_—_ — _—_—_ _____ 2 voants1wotat (25% (12%)<br><!-- End of picture text -->

Dès qu'un copropriétaire se connecte à son espace privé, le système vérifie s'il existe des sondages actifs auxquels il n'a pas encore répondu. 

Si un ou plusieurs sondages sont en attente, une interface moderne et épurée s'affiche avant d'accéder au reste du système afin d'assurer un taux de participation maximal. 

Si plusieurs sondages sont actifs simultanément, ils s'affichent un par un à la suite. 



<!-- Start of picture text -->
© Consultation Copropriété<br>Vote & Sondage en cours<br>Votre avis est requis pour enregistrer la décision collective.<br>2 SUJET DU VOTE<br>Remplacement du Moteur d'Ascenseur<br>Remplacement du moteur usagé par un modéle moderne a<br>basse consommation.<br>VY Pour Accepter la proposition<br>X Contre Refuser la proposition<br>—  Neutre / Abstention Sans avis particulier<br><!-- End of picture text -->



<!-- Start of picture text -->
Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
ZX<br>e -@) My HOAUL LAE CACC Gl ABATED - 1.0<br>ay ea Université Sidi Mohamed Ben Abdellah - Fés<br><!-- End of picture text -->

Dès que le copropriétaire valide son vote (Pour, Contre ou Abstention/Neutre), le vote est enregistré et le sondage suivant s'affiche immédiatement. 

###### **Page de Communication et Mur d'Annonces** 

Espace d'information collective de la résidence. Le syndic y publie des notes officielles et des alertes d'immeuble. Les copropriétaires peuvent intervenir et émettre des remarques publiquement ou de manière anonyme. 



<!-- Start of picture text -->
Q “ns om<br>Rappel : Assemblée Générale Ordinaire<br>Chers copropriétaires, nous vous rappelons que Assemblée Générale annuelle aura leu ce samedi 8 16h00<br>dans la salle de réunion au rez-de-chaussée. Ordre du jour : Bilan financier annuel et validation des travaux<br>a'étanchsite<br>Bonjour M. le Syndic, merci pour la mise & jour rapide du systéme d'éclairage dans le couloir du 2éme étage<br>Q “ro<br>Intervention Technique - Ascenseur & Bache & eau<br>Une opération de nettoyage de la bache & eau et de maintenance préventive de l'ascenseur est<br>programmée pour ce mercredl entre 0900 et 12h00.<br>Bonjour & tous, serait-l possible de veiller & ce que la porte d'entrée principale soit bien fermée le soir &<br>partir de 22h ? Merci pour votre vigilance!<br><!-- End of picture text -->

###### **Page de Messagerie Privée Directe** 

Centre de discussion privée et confidentielle en à-un entre l'administration du syndic et chaque copropriétaire. Il intègre des notifications visuelles d'état de lecture pour le suivi des requêtes individuelles. 



<!-- Start of picture text -->
ZR<br>© -@) SS +.@/A.UEt @LAE CIACEA Ol AGAILD -1.0<br>ve ea Université Sidi Mohamed Ben Abdellah - Fés<br><!-- End of picture text -->



<!-- Start of picture text -->
Fes<br><!-- End of picture text -->

##### **MODULE 2 : PORTAIL ET ESPACE COPROPRIÉTAIRE** 

Portail Principal du Copropriétaire 

Espace privé centralisé pour chaque résident. Il rassemble sur une même interface : 

Interface des sondages obligatoires : Fenêtre prioritaire permettant au copropriétaire de répondre de manière enchaînée à tous les votes actifs avant d'accéder au reste des fonctionnalités. 

###### 1. Mes Lots et Quotes-Parts 

La section Mes Lots et Quotes-Parts présente une grille réactive affichant les biens du copropriétaire avec accès aux titres fonciers, tout en calculant le bilan synthétique des superficies privatives exclusives, des parties communes et de la surface globale totale possédée. 



<!-- Start of picture text -->
Bonjour, Rahmani aa<br>Volcl un apercu de votre situation,<br>Mes Lors PAIEMENTS EN ATTENTE TOTAL IMPAYE MESSAGES NON LUS<br>4 46 208,323.73 DH 0<br>'<br>© _ BureauProehainpalementA102 + Janvier aa 2026 3,828.31DH‘Montant a régler<br>Mes lots ‘i © Voir toutes le informations<br>aq Bureau B201 etite yo Bureau A103 etaits yp Bureau A102 etats<br>Récapitulatif quotes-parts<br>QUOTE-PART PRIVATIVE QUOTE-PART COMMUNES SUPERFICIE TOTALE<br>560 m? 295 m? 855 m?<br><!-- End of picture text -->

###### **3. Paiements Récents : Suivi et Historique Financier** 

**Le tableau des paiements récents assure le suivi financier en temps réel des mensualités dues et réglées. Il détaille le bureau concerné, la période mensuelle, le montant exact en Dirhams, ainsi qu'un indicateur visuel précisant le statut et l'historique complet.** 



<!-- Start of picture text -->
ENSA<br>Fe<br>7;<br>es<br><!-- End of picture text -->



<!-- Start of picture text -->
1 = AN Lae oy darer Sg Lara<br>ZX<br>=O= HAUL @LAL CLACEA Ol AGAMLD -1.<br>| as Université Sidi Mohamed Ben Abdellah - Fes<br><!-- End of picture text -->

|Paiements récents||48 autota||
|---|---|---|---|
|BUREAU|PERIODE|MONTANT|stavur|
|Bureau A102|Janvier 2026|3,828.31 DH|impaye|
|Bureau 8201|Janvier 2026|5,870.07 DH|impaye|
|Bureau A101|Janvier 2026|4,849.19 DH|payé|
||Afichagedes3plusrécentssur48|||





<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



## 🪟 **CHAPITRE 5 : CONCLUSION ET PERSPECTIVES D'ÉVOLUTION**

---

### **5.1 Bilan Général du Projet & Apports du Stage**

Le stage effectué au sein du pôle ingénierie logicielle de **CAD Digital Agency** a constitué une opportunité exceptionnelle de mettre en pratique les compétences théoriques et techniques acquises durant mon cursus d'Ingénierie des Logiciels et Intelligence Artificielle à l'**ENSA Fès**.

La plateforme **SyndicApp** développée répond concrètement à la problématique initiale de la gestion de copropriété au Maroc (encadrée par la Loi 18-00 / 106-12). L'ensemble des 17 cas d'utilisation spécifiés (**CU-01 à CU-17**) ont été implémentés avec succès et validés sous **TypeScript** (0 erreur de compilation).

---

### **5.2 Perspectives d'Évolution Fonctionnelles & Métiers**

Pour pérenniser la plateforme et accompagner la croissance des résidences gérées par les syndics au Maroc, plusieurs axes d'évolution fonctionnelle sont envisagés à court et moyen terme :

#### **5.2.1 Intégration du Paiement en Ligne Direct (Passerelle CMI / Stripe / PayPal)**
- Permettre aux copropriétaires de régler leurs cotisations mensuelles directement depuis leur smartphone par carte bancaire marocaine (via la passerelle **CMI - Centre Monétique Interbancaire**) ou internationale.
- Génération et transmission automatique de la quittance de caisse certifiée en PDF dès la validation effective de la transaction bancaire, éliminant toute saisie manuelle par le syndic.

#### **5.2.2 Module d'Intelligence Artificielle & Analyse Prédictive des Impayés**
- Implémentation d'un algorithme de Machine Learning (Scikit-Learn / FastAPI) pour analyser l'historique des règlements et prédire le risque de retard de paiement par lot.
- Génération automatique de recommandations personnalisées pour le syndic (échéanciers de rééchelonnement, relances ciblées).

#### **5.2.3 Numérisation et Reconnaissance Optique des Factures (OCR)**
- Permettre au syndic d'uploader la photo d'une facture de travaux exceptionnels depuis son smartphone.
- Extraction automatique du montant, du nom du fournisseur et de la date par OCR (Optical Character Recognition) afin d'alimenter directement le calculateur de ventilation des dépenses d'urgence.

---

### **5.3 Perspectives d'Évolution Techniques & Architecturales**

#### **5.3.1 Développement d'une Application Mobile Native Cross-Platform (React Native)**
- Déploiement d'une application mobile dédiée sous iOS et Android développée avec **React Native / Expo**.
- Envoi de **Notifications Push** en temps réel pour alerter les copropriétaires lors du lancement d'un sondage obligatoire, de la publication d'un avis d'urgence ou de l'arrivée d'une quittance.

#### **5.3.2 Automates d'Envoi WhatsApp Business & SMS (API Twilio / Meta)**
- Intégration de l'API **WhatsApp Business** pour l'envoi automatique de rappels d'échéances et de notifications de nouveaux messages directement sur le smartphone des résidents.

#### **5.3.3 Intégration IoT & Bâtiment Intelligent (Smart Building)**
- Connexion aux compteurs d'eau et d'électricité des parties communes via des capteurs **IoT** (LoRaWAN / MQTT) pour un suivi automatisé de la consommation et une détection instantanée des fuites.

---

### 📊 **5.4 Feuille de Route & Roadmap d'Évolution**

| Axe d'Évolution | Périmètre & Description | Stack & Technologies Cibles | Horizon Temporel |
|---|---|---|---|
| **Paiement Direct CMI** | Règlement par Carte Bancaire en ligne | CMI Gateway / Stripe Webhooks | Court terme (3 mois) |
| **Notifications WhatsApp** | Relances automatiques d'échéances | API WhatsApp Business / Twilio | Court terme (3 mois) |
| **Application Mobile Native** | Version iOS & Android native | React Native / Expo / Firebase | Moyen terme (6 mois) |
| **OCR Factures & Reçus** | Extraction automatique des données | Tesseract OCR / OpenAI Vision | Moyen terme (6 mois) |
| **IA & Scoring Impayés** | Prédiction des risques de paiement | Python / FastAPI / Scikit-Learn | Long terme (12 mois) |
| **IoT Communs** | Télé-relevé des compteurs d'eau/élec | Capteurs MQTT / LoRaWAN | Long terme (12 mois) |

---

## **Résumé global** 

###### **1. Espace Syndic — Pilotage et gestion de la copropriété** 

Le site propose au syndic une plateforme centralisée permettant de gérer l’ensemble des activités liées à la copropriété. Un tableau de bord financier offre une vision globale du budget, des encaissements, des impayés, des dépenses et du taux de recouvrement. Des graphiques mensuels permettent de suivre l’évolution des recettes et des sommes restantes à payer, avec la possibilité de générer automatiquement un rapport annuel au format PDF. 

La plateforme permet également de gérer les lots et les copropriétaires à travers des fiches détaillées contenant les informations du lot, les quotes-parts privatives et communes ainsi que les propriétaires associés. Les accès des copropriétaires peuvent être créés et réinitialisés facilement. 

La gestion financière comprend la création du budget prévisionnel, avec distinction entre charges fixes et variables, ainsi que l’ajout de pièces justificatives. Les appels de fonds mensuels sont générés automatiquement à partir du budget. Le syndic peut suivre les montants demandés, les paiements réellement reçus et les impayés, tout en disposant de statistiques détaillées par période et par copropriétaire. 

Le système permet aussi d’enregistrer les dépenses réelles et de comparer les prévisions avec les dépenses effectuées. Enfin, des outils de communication facilitent les échanges grâce à un chat général, une messagerie privée et un système de votes et sondages. Les sondages peuvent être configurés avec trois choix : Pour, Contre ou Neutre. Lorsqu’un vote obligatoire est actif, les copropriétaires concernés doivent participer avant de pouvoir accéder à l’application. 

###### **2. Espace Copropriétaire — Suivi personnel et participation** 

L’espace copropriétaire offre une interface simple permettant à chaque utilisateur de consulter ses informations personnelles et de suivre sa situation au sein de la copropriété. La page d’accueil présente des indicateurs en temps réel concernant les lots, les paiements en attente, les impayés et les messages non lus. 



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

La section « Mes lots » permet de consulter les informations des biens détenus, notamment le numéro, l’étage, le titre foncier et les quotes-parts. La rubrique « Mes paiements » présente l’historique des appels de fonds et des règlements, avec des filtres par année ou par lot afin de faciliter le suivi des soldes. 

Les copropriétaires disposent également d’un chat général pour communiquer avec le syndic et les autres résidents, ainsi que d’une messagerie privée pour les échanges individuels. Le système de notifications permet d’identifier rapidement les nouveaux messages. 

**Enfin** , la plateforme favorise la participation aux décisions collectives grâce au système de votes obligatoires. En cas de sondage actif non encore voté, une fenêtre bloquante s’affiche à la connexion et propose les choix Pour, Contre ou Neutre. Le vote est enregistré immédiatement et chaque copropriétaire ne peut voter qu’une seule fois par sondage. 

## **Global Summary** 

###### **1. Property Manager Area — Condominium Management and Administration** 

The website provides the property manager with a centralized platform for managing all activities related to the condominium. A financial dashboard offers an overview of the budget, payments collected, outstanding payments, expenses, and collection rate. Monthly charts allow the manager to monitor the evolution of revenue and outstanding amounts, with the possibility of automatically generating an annual PDF report. 

The platform also enables the management of units and co-owners through detailed records containing unit information, private and common ownership shares, and associated owners. Co-owner accounts can be created, and their access credentials can be easily reset. 

Financial management includes the creation of an annual budget, with a distinction between fixed and variable expenses, as well as the ability to attach supporting documents. Monthly payment requests are automatically generated 



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

based on the budget. The property manager can track requested amounts, actual payments received, and outstanding payments, while accessing detailed statistics by period and by co-owner. 

The system also allows actual expenses to be recorded and compared with the planned budget. In addition, communication tools facilitate interaction through a general chat, private messaging, and a voting and polling system. Polls can offer three options: For, Against, or Neutral. When a mandatory vote is active, the concerned co-owners must participate before they can access the application. 

###### **2. Co-Owner Area — Personal Monitoring and Participation** 

The co-owner area provides a simple interface allowing each user to view their personal information and monitor their situation within the condominium. The home page displays real-time indicators related to their units, pending payments, outstanding balances, and unread messages. 

The “My Units” section allows users to view information about their properties, including unit number, floor, land title, and ownership shares. The “My Payments” section displays the complete history of payment requests and payments, with filters by year or unit to facilitate balance tracking. 

Co-owners also have access to a general chat for communicating with the property manager and other residents, as well as private messaging for individual conversations. The notification system makes it easy to identify new messages. 

**Finally** , the platform encourages participation in collective decisions through its mandatory voting system. When an active poll has not yet been answered, a blocking window appears upon login and offers the options For, Against, or Neutral. The vote is recorded immediately, and each co-owner can vote only once per poll. 

### **List des abréviations** 

###### **1. Syndic de Copropriété** 



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

Le syndic est le mandataire légal désigné pour administrer l'immeuble au quotidien. Il assure la gestion financière, l'entretien des parties communes, la souscription des assurances indispensables et veille au respect du règlement de copropriété par l'ensemble des résidents du bâtiment. 

###### **2. Copropriétaire** 

Un copropriétaire est la personne physique ou morale détenant la propriété exclusive d'un lot privé au sein de l'immeuble. Il détient également une quotepart indivise sur les parties communes et participe financièrement aux charges générales selon ses droits officiels enregistrés. 

###### **3. Bureau / Lot** 

Le bureau ou lot désigne l'unité immobilière privative attribuée à un propriétaire spécifique. Il comprend un numéro d'identification unique, un étage déterminé, une surface exacte et des tantièmes propres permettant d'évaluer précisément sa contribution aux frais collectifs de la résidence. 

###### **4. Titre Foncier** 

Le titre foncier constitue le numéro d'immatriculation juridique officiel délivré par la conservation foncière nationale. Il garantit la propriété inattaquable du lot et atteste de manière incontestable l'identité du propriétaire ainsi que les caractéristiques juridiques complètes du bien immobilier concerné. 

###### **5. Quote-Part Privative** 

La quote-part privative représente le pourcentage de surface exclusive réservé uniquement à l'usage de son propriétaire. Elle permet de mesurer précisément la superficie utile d'un bureau sans prendre en compte les espaces partagés de la structure collective de l'immeuble entier. 

###### **6. Quote-Part Commune** 

La quote-part commune correspond à la fraction indivise des espaces partagés attribuée à chaque lot. Exprimée en millièmes ou tantièmes, elle sert de clé de 



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

répartition pour calculer la part exacte des charges que chaque copropriétaire doit régler pour l'entretien. 

###### **7. Charges Fixes et Variables** 

Les charges fixes englobent les dépenses récurrentes et prévisibles comme le ménage ou l'ascenseur. Les charges variables désignent les coûts fluctuants selon la consommation réelle de l'immeuble. Ensembles, elles constituent le budget prévisionnel annuel voté et géré par le syndic. 

###### **8. Dépenses Exceptionnelles** 

Les dépenses exceptionnelles regroupent les travaux imprévus ou majeurs non inclus dans le budget ordinaire annuel, comme la rénovation globale de toiture. Le montant total est réparti automatiquement entre les copropriétaires au prorata de leur quote-part commune enregistrée dans l'application. 

ENSA. ar a =Qaq ldoS= i dus owesdarve Sd hauler Fes 1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO - Fés | ow Université Sidi Mohamed Ben Abdellah 



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

### **LOI N° 18.00 : RELATIVE AU STATUT DE LA COPROPRIÉTÉ DES IMMEUBLES BÂTIS** 

### **Modifiée et complétée par la Loi n° 106-12** 

**CHAPITRE I – DISPOSITIONS GÉNÉRALES** 

###### **Article 1 – Application de la loi** 

La loi s'applique à la propriété des immeubles bâtis divisés par appartements, étages ou locaux, dont la propriété est répartie par lots comprenant chacun une partie privative et une quote-part des parties communes. Elle s'applique également aux ensembles immobiliers (villas, locaux contigus ou séparés). Elle couvre les immeubles immatriculés, en cours d'immatriculation ou non immatriculés. 

###### **Article 2 – Les parties privatives** 

Ce sont les parties (bâties ou non) appartenant à chaque copropriétaire pour en jouir individuellement et personnellement. Elles constituent la propriété exclusive de chaque copropriétaire. Pour les villas/locaux avec titre foncier unique : le sol et les jardins annexés sont également considérés comme parties privatives. 

###### **Articles 3 et 4 – Les parties communes** 

Sont réputées parties communes : 

- Le sol, les gros œuvres, fondations, murs porteurs 

- Les caves (usage commun), la façade, les toits (usage commun) 

- Les escaliers, passages, corridors, entrées, sous-sols, ascenseurs 



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->

- Les murs et cloisons séparant deux parties privatives 

- Les équipements communs traversant les parties privatives 

- Les lieux de dépôt des ordures ménagères 

- Sauf stipulation contraire : les cours, jardins et locaux à usage commun 

###### **Article 5 – Droits accessoires aux parties communes** 

- Droit de surélévation de l'immeuble 

   - Droit d'édifier de nouvelles constructions dans les cours/jardins/sols 

- Droit d'excavation 

###### **Article 6 – Fixation de la quote-part** 

La quote-part de chaque copropriétaire dans les parties communes est fixée en fonction de l'étendue de sa partie privative par rapport à l'ensemble des parties privatives de l'immeuble. Pour les projets réalisés en étapes, la quote-part peut être fixée provisoirement, puis définitivement à l'achèvement du projet. 

###### **Article 7 – Interdiction de vendre/saisir une partie commune** 

Les parties communes ne peuvent faire l'objet d'aucune répartition, saisie, cession ou vente forcée, indépendamment de la fraction indivise. 

###### **Articles 8 et 9 – Le règlement de copropriété** 

Tout immeuble en copropriété est régi par un règlement de copropriété obligatoire. En son absence, un règlement type s'applique. Il comporte obligatoirement : 

- La destination des parties privatives et communes et conditions d'usage 

- Les règles d'administration des parties communes 

- La répartition des quotes-parts d'indivision 

- Les règles de gestion du syndicat et de l'assemblée générale 

- Les règles de désignation du syndic et de son adjoint 

- La fixation des charges : conservation, entretien, administration, équipements communs 

- La part de chaque propriétaire dans les charges 

###### **Article 10 – Documents annexés** 

Le règlement est accompagné des plans d'architecture, des plans topographiques, et pour les immeubles non immatriculés : permis de construire, procès-verbal de division, etc. 

###### **Article 11 – Enregistrement** 



<!-- Start of picture text -->
=Qaq ldoS= i dus owesdarve Sd hauler<br>1 ONG ry +OAULt OLAL CiACCA Ol AGAMLD -HO<br>- Fés<br>| ow Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->



<!-- Start of picture text -->
ENSA. ar a<br>Fes<br><!-- End of picture text -->

- Immeubles immatriculés : dépôt et enregistrement à la conservation foncière 

- Immeubles non immatriculés : dépôt au secrétariat-greffe du tribunal de première instance 

- Le vendeur doit remettre à l'acquéreur une copie du règlement et des plans. L'acte de vente doit mentionner que l'acquéreur en a pris connaissance. 

###### **Article 12 – Transfert de propriété** 

Tout acte de transfert de copropriété doit être établi par acte authentique ou acte à date certaine dressé par un professionnel agréé (avocat agréé près la Cour de cassation, etc.), sous peine de nullité. Les signatures doivent être légalisées. 

###### **CHAPITRE II – ADMINISTRATION ET GESTION DE LA COPROPRIÉTÉ** 

###### **Article 13 – Le syndicat** 

Tous les copropriétaires sont groupés de plein droit dans un syndicat doté de la personnalité morale et de l'autonomie financière, à compter de la première cession. Le syndicat : 

- Assure la conservation, l'entretien et l'administration des parties communes 

- Peut ester en justice (même contre un copropriétaire) 

   - Est administré par une assemblée générale et géré par un syndic 

- Le syndic est responsable de tout préjudice dû à la négligence dans la gestion 

###### **Article 14 – Obligations du copropriétaire** 

Tout copropriétaire est membre du syndicat. Il participe aux votes. Chaque copropriétaire dispose d'un nombre de voix correspondant à l'importance de ses droits. En cas d'indivision, les copropriétaires désignent un représentant commun. 

###### **Article 14 bis – Ressources du syndicat** 

- Contributions des copropriétaires aux charges 

   - Sommes provenant de la cession/location de biens du syndicat 

- Le syndicat peut acquérir des fractions divises 

###### **Article 15 – Missions** 



<!-- Start of picture text -->
ar<br>-<br>Fes<br><!-- End of picture text -->



<!-- Start of picture text -->
AB = Ai do8 op dare Sent aaer<br>Pe -OAUT OLAL CLACOA Gl AGAMLD - X.0<br>- Fas<br>| a Université Sidi Mohamed Ben Abdellah<br><!-- End of picture text -->

L'assemblée générale gère l'immeuble conformément à la loi et au règlement de copropriété. Ses décisions sont exécutées par le syndic ou son adjoint. 

###### **Article 16 – Désignation du syndic** 

- Désigné à la majorité des 3/4 des voix des copropriétaires 

- Peut-être un copropriétaire ou un tiers : personne physique ou morale 

- À défaut : désigné par le président du tribunal de première instance 

- Mandat de 2 ans renouvelable 

- Révocation à la même majorité : 3/4 

- L'autorité administrative locale est informée de la désignation 

###### **Articles 17, 18 et 19 – Majorités de vote** 

|**Majorité**|**Décisions**|
|---|---|
|Majorité relative|Entretien, sécurité, autorisation de travaux individuels sur<br>parties communes, antennes communes, accessibilité<br>handicapés, concierge|
|Majorité des 3/4|Règlement de copropriété (élaboration/modification),<br>travaux d'amélioration, désignation/révocation du syndic,<br>budget, charges, grands travaux, assurance collective, droit<br>de préférence, démolition partielle|
|Unanimité|Nouveau bâtiment, surélévation, cession d'une partie de<br>l'immeuble, création/aménagement de locaux collectifs,<br>transformations des parties communes|



