# 📊 GUIDE MASTER DE SOUTENANCE DE STAGE (30 MINUTES) — SYNDICAPP

**Établissement** : ENSA Fès — Département Informatique  
**Diplôme** : Ingénierie des Logiciels et Intelligence Artificielle (ILIA)  
**Intitulé du Projet** : SyndicApp — Plateforme SaaS Cloud de Digitalisation et Gestion de Copropriété  
**Entreprise d'Accueil** : CAD Digital Agency  
**Encadrant Entreprise** : M. Nizar Benharbit Alami (Fondateur & Directeur Général)  

---

## ⏱️ PROGRAMME DE LA PRESENTATION (30 MINUTES CHRONO)

| Chrono | Axe & Phase | Contenu & Objectifs Métiers |
|---|---|---|
| **00:00 - 03:00** (3 min) | **Axe 1 : Introduction & Entreprise** | Accroche, présentation de **CAD Digital Agency** & cadre général. |
| **03:00 - 06:00** (3 min) | **Axe 2 : Cadre Légal & Problématique** | Loi 18-00/106-12 au Maroc, opacité financière, impayés & tantièmes. |
| **06:00 - 09:00** (3 min) | **Axe 3 : Benchmark & Solution** | Étude comparative de l'existant vs la valeur ajoutée de **SyndicApp**. |
| **09:00 - 13:00** (4 min) | **Axe 4 : Architecture & Algorithmes** | Stack Next.js/Prisma/Neon, sécurité RBAC, formules mathématiques. |
| **13:00 - 23:00** (10 min) | **Axe 5 : 🎬 DÉMONSTRATION LIVE** | Démo en direct du site Web (Espace Syndic & Espace Copropriétaire). |
| **23:00 - 26:00** (3 min) | **Axe 6 : Qualité & Gestion Agile** | Planning Gantt en 5 phases, typage TypeScript (0 erreur) & tests. |
| **26:00 - 30:00** (4 min) | **Axe 7 : Conclusion & Perspectives** | Bilan global, évolutions futures (Paiement CMI, App Mobile Native). |

---

## 🏛️ AXE 1 : CADRE GÉNÉRAL ET ENTREPRISE D'ACCUEIL

### 📌 Slide 1 : Titre et Ouverture
- **Visuel** : Logos ENSA Fès & CAD Digital Agency, Titre du projet "SyndicApp", Nom de l'étudiant (Brahim), Filière ILIA.
- **Discours à l'oral** :
  > "Bonjour Monsieur le Professeur, mesdames et messieurs les membres du jury. Je suis honoré de vous présenter aujourd'hui le résultat de mon travail de fin d'études portant sur la conception et le développement de **SyndicApp**, une plateforme SaaS Cloud dédiée à la digitalisation et à la gestion transparente des copropriétés. Ce projet a été réalisé au sein du pôle ingénierie logicielle de **CAD Digital Agency**."

### 📌 Slide 2 : Présentation de l'Entreprise d'Accueil — CAD Digital Agency
- **Visuel** :
  - Fondateur & Directeur Général : **M. Nizar Benharbit Alami** (+20 ans d'expérience dans le bâtiment, la construction et l'aménagement).
  - Responsable Administrative : **Mme Imane Idrissi**.
  - Pôles d'activités : *Digital & Communication, Formation Professionnelle, Immobilier & Matériaux de Construction*.
- **Discours à l'oral** :
  > "**CAD Digital Agency** est une entreprise marocaine caractérisée par une forte diversification de ses activités. Fondée et dirigée par **M. Nizar Benharbit Alami**, fort de plus de 20 ans d'expertise dans le secteur du bâtiment et des technologies, l'agence accompagne les professionnels dans la transformation numérique. C'est dans ce cadre d'innovation que s'inscrit le projet SyndicApp."

---

## ⚖️ AXE 2 : CADRE LÉGAL (LOI 18-00 / 106-12) ET PROBLÉMATIQUE MÉTIER

### 📌 Slide 3 : Contexte Réglementaire et Problématique au Maroc
- **Visuel** : Cadre légal de la copropriété au Maroc (Loi 18-00 modifiée par la Loi 106-12) & 4 fléaux majeurs :
  1. ❌ **Opacité financière & Défiance** : Manque de visibilité sur l'utilisation des cotisations et absence de reçus certifiés.
  2. ❌ **Taux d'impayés élevé** : Absence d'outils automatisés de relance et d'échéanciers mensuels.
  3. ❌ **Lourdeur des calculs manuels** : Complexité de la répartition des dépenses imprévues au prorata des quote-parts/tantièmes.
  4. ❌ **Blocage des prises de décision** : Faible participation aux Assemblées Générales (AG) bloquant l'entretien des bâtiments.
- **Discours à l'oral** :
  > "Au Maroc, le régime de la copropriété est encadré par la Loi 18-00 modifiée par la Loi 106-12. Cependant, la majorité des syndics utilisent encore des méthodes traditionnelles sur papier ou Excel. Cela génère quatre blocages majeurs : une défiance des copropriétaires faute de transparence, des retards de paiement de cotisations, des erreurs lors du calcul des tantièmes pour les travaux imprévus, et un absentéisme généralisé qui paralyse les votes."

---

## 📊 AXE 3 : ÉTUDE COMPARATIVE ET VALEUR AJOUTÉE (BENCHMARK)

### 📌 Slide 4 : Analyse Comparative de l'Existant vs SyndicApp
- **Visuel** : Tableau comparatif :

| Critère de Comparaison | Gestion Traditionnelle (Papier/Excel) | Logiciels Classiques | **SyndicApp (Notre Solution)** |
|---|---|---|---|
| **Accessibilité** | Physique / Locale | Installation lourde PC | **100% Web Cloud 24/7 (SaaS)** |
| **Transparence Financière** | Faible (Cahier manuscrit) | Rapports complexes | **Tableau de bord interactif + PDF** |
| **Ventilation des Urgences** | Calcul manuel sujet aux erreurs | Saisie manuelle | **Calculateur automatique par tantièmes** |
| **Recouvrement & Reçus** | Reçus papier informels | Impression manuelle | **Génération automatique de reçus PDF** |
| **Prise de Décision** | Présence physique obligatoire | E-mails non suivis | **Sondages obligatoires à modale bloquante** |
| **Communication** | Appel téléphonique / Groupe WhatsApp | Aucun canal | **Mur d'annonces anonyme & Chat privé** |

- **Discours à l'oral** :
  > "Pour apporter une valeur ajoutée concrète, nous avons réalisé une étude comparative. Contrairement aux méthodes traditionnelles ou aux logiciels lourds, **SyndicApp** centralise l'ensemble des besoins sur le Cloud avec deux garanties majeures : l'automatisation comptable complète et un système exclusif de sondages obligatoires bloquants pour stimuler la démocratie participative."

---

## 📐 AXE 4 : ARCHITECTURE TECHNIQUE, ALGORITHMES & SÉCURITÉ RBAC

### 📌 Slide 5 : Stack Technologique & Architecture Cloud 3-Tiers
- **Visuel** :
  - **Frontend / Backend Serverless** : **Next.js App Router** (React 19, TypeScript), Tailwind CSS.
  - **ORM & Persistance** : **Prisma ORM 7.8** & **Neon Serverless PostgreSQL** (Cloud DB).
  - **Réseau Edge** : Cloudflare Edge CDN & Security.
- **Discours à l'oral** :
  > "Sur le plan architectural, nous avons retenu une stack Full-Stack moderne. **Next.js App Router** en **TypeScript** garantit la rapidité et la robustesse du code. La persistance repose sur le couple **Prisma ORM 7.8** et la base de données Serverless Cloud **Neon PostgreSQL**, assurant une mise à l'échelle automatique (auto-scaling) et une résilience élevée."

### 📌 Slide 6 : Algorithmes Métiers & Formules Mathématiques
- **Visuel** :

1. **Formule de Ventilation Automatique des Dépenses Imprévues** :
   $$\text{Part du lot } i = \text{Montant Dépense} \times \left( \frac{\text{QuotePartCommune}_i}{\sum \text{QuotePartCommune}} \right)$$

2. **Formule du Taux de Recouvrement (%)** :
   $$\text{Taux Recouvrement} = \left( \frac{\text{Total Encaissé}}{\text{Budget Attendu}} \right) \times 100$$

- **Discours à l'oral** :
  > "L'intelligence de la plateforme repose sur des algorithmes comptables précis. Lorsqu'une dépense d'urgence est enregistrée par le syndic, l'application répercute automatiquement sa valeur sur chaque lot au prorata exact de ses tantièmes de parties communes, mettant à jour instantanément les montants exigibles dans l'échéancier des résidents."

### 📌 Slide 7 : Sécurité Applicative, Isolation RBAC & Hachage
- **Visuel** : Schéma d'isolation RBAC & Cookies HttpOnly.
  - *Authentification* : Jetons JWT signés avec l'algorithme `HS256`.
  - *Protection des sessions* : Stockage exclusif dans des cookies sécurisés `HttpOnly`, `SameSite=Lax`.
  - *Protection des données* : Hachage fort des mots de passe avec **bcryptJS** (salt rounds = 10).
- **Discours à l'oral** :
  > "La sécurité et la confidentialité sont au cœur du système. L'accès repose sur l'architecture **RBAC** (Role-Based Access Control) isolant strictement l'espace Syndic du portail Copropriétaire. Les jetons de session sont encapsulés dans des cookies `HttpOnly` inaccessibles en JavaScript, protégeant l'application contre les attaques XSS et CSRF."

---

## 🎬 AXE 5 : DÉMONSTRATION EN DIRECT DU SITE WEB (10 MINUTES)

*(Basculez votre écran vers le navigateur Web et suivez ce scénario de démonstration)*

### 1. Démo Espace Syndic (5 minutes) :
1. **Tableau de Bord** : Présentez les KPIs (Budget attendu, Total encaissé, Impayés, Résultat net, Baromètre de recouvrement %).
2. **Impression du Rapport PDF** : Cliquez sur *"Télécharger le rapport PDF"* et montrez le document certifié généré par `jsPDF`.
3. **Gestion des Bureaux & Tantièmes** : Montrez la grille des lots avec superficies privatives, communes et titres fonciers.
4. **Comptabilité & Dépenses** : Montrez le budget prévisionnel (charges fixes/variables) et enregistrez une dépense d'urgence pour prouver le fonctionnement du calculateur de ventilation automatique.

### 2. Démo Espace Copropriétaire (5 minutes) :
1. **Modale de Sondage Bloquant** : Connectez-vous en copropriétaire. Montrez que la présence d'un vote actif déclenche une modale prioritaire bloquante imposant le vote (Pour, Contre, Neutre) avant d'accéder au dashboard.
2. **Section "Mes Lots"** : Montrez la grille des lots et le récapitulatif des superficies en $m^2$.
3. **Paiements Récents & Reçus** : Montrez l'historique des quittances.
4. **Mur d'Annonces & Communication** : Rédigez un message en cochant l'option *"Publier anonymement"* pour prouver le masquage de l'identité.

---

## 📈 AXE 6 : QUALITÉ DU CODE, GESTION AGILE & DIFFICULTÉS

### 📌 Slide 8 : Méthodologie Agile Scrum & Planning Gantt
- **Visuel** : Diagramme de Gantt Mermaid (5 phases de réalisation).
- **Discours à l'oral** :
  > "Le développement a été conduit selon la méthodologie **Agile Scrum** découpée en sprints de deux semaines. De la modélisation UML/Prisma initiale au déploiement Cloud en passant par la gestion comptable et les modules d'interaction, le planning prévisionnel a été scrupuleusement respecté."

### 📌 Slide 9 : Assurance Qualité & Défi Techniques Surmontés
- **Visuel** :
  - **Typage Strict** : 100% du code rédigé en **TypeScript** avec validation via `npx tsc --noEmit` (**0 erreur de compilation**).
  - **Optimisation Serverless** : Gestion du Connection Pooling Neon Postgres via `@prisma/adapter-pg` (< 200 ms).
  - **Refonte UX/UI** : Interface épurée, moderne et professionnelle sous **Tailwind CSS** sans icônes superflues.
- **Discours à l'oral** :
  > "En termes de qualité logicielle, nous avons imposé un typage strict en **TypeScript** validé avec zéro erreur. Nous avons également surmonté l'optimisation des requêtes sur la base de données Serverless Cloud Neon tout en proposant une interface utilisateur moderne et épurée."

---

## 🎯 AXE 7 : CONCLUSION ET PERSPECTIVES D'ÉVOLUTION

### 📌 Slide 10 : Conclusion et Bilan Général du Projet
- **Visuel de la Slide** :
  - **Carte 1 : Bilan Fonctionnel (100% Validé)** :
    - 17 Cas d'Utilisation (**CU-01 à CU-17**) développés et opérationnels.
    - Deux espaces étanches (RBAC) : *Espace Syndic (Admin)* et *Espace Copropriétaire (Résident)*.
    - Sondages obligatoires à modale bloquante & mur d'annonces avec filtre anonyme.
  - **Carte 2 : Bilan Technique & Qualité** :
    - Stack moderne Full-Stack **Next.js App Router (React 19)** + **TypeScript** (0 erreur `npx tsc --noEmit`).
    - Base de données Serverless Cloud **Neon PostgreSQL** (< 200 ms).
    - Édition et génération certifiée de reçus et bilans annuels en **PDF**.
  - **Carte 3 : Bilan Académique & Professionnel** :
    - Mise en application concrète des concepts génie logiciel enseignés à l'**ENSA Fès**.
    - Organisation en Sprints **Agile Scrum** au sein du pôle ingénierie de **CAD Digital Agency**.
- **Discours à l'oral** :
  > "Pour conclure cette présentation, le projet **SyndicApp** constitue une réussite complète tant sur le plan fonctionnel que technique. L'ensemble des 17 cas d'utilisation spécifiés ont été implémentés et validés sous TypeScript avec zéro erreur de compilation. Nous avons livré à CAD Digital Agency une plateforme SaaS Cloud fluide, sécurisée, moderne et immédiatement opérationnelle qui résout concrètement les défis de la copropriété au Maroc."

---

### 📌 Slide 11 : Perspectives d'Évolution & Feuille de Route (Roadmap)
- **Visuel de la Slide** : Matrice tri-dimensionnelle selon l'horizon temporel :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔮 FEUILLE DE ROUTE & PERSPECTIVES D'ÉVOLUTION (ROADMAP)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🟢 COURT TERME (3 Mois)                                                     │
│   • 💳 Passerelle CMI / Stripe : Règlement CB direct & Quittance PDF auto.  │
│   • 💬 API WhatsApp Business : Relances automatiques d'impayés & quittances.│
├─────────────────────────────────────────────────────────────────────────────┤
│ 🟡 MOYEN TERME (6 Mois)                                                     │
│   • 📱 App Mobile Native : Version iOS & Android sous React Native & Push. │
│   • 📷 OCR Factures : Extraction automatique des montants par scan photo.   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🔵 LONG TERME (12 Mois)                                                     │
│   • 🧠 IA Prédictive : Algorithme Machine Learning de scoring des impayés.   │
│   • 🌐 Smart Building IoT : Télé-relevé des compteurs d'eau et électricité.  │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Discours à l'oral** :
  > "Concernant les perspectives d'évolution, nous avons conçu une feuille de route ambitieuse structurée en trois temps : à court terme, l'intégration du paiement en ligne CMI et des relances automatiques par WhatsApp ; à moyen terme, le déploiement d'une application mobile native sous React Native équipée de la reconnaissance optique de factures (OCR) ; et à long terme, l'implémentation d'un module d'IA prédictive pour le scoring des impayés et la connexion aux compteurs IoT du bâtiment. Je vous remercie vivement pour votre attention et je suis désormais disponible pour répondre à toutes vos questions."

---

## ❓ FOIRE AUX QUESTIONS (FAQ) — 10 QUESTIONS TECHNIQUES DU JURY & RÉPONSES

### Q1 : Pourquoi avoir choisi Next.js App Router et Prisma ORM au lieu d'une architecture classique (Laravel/PHP ou Spring Boot) ?
> **Réponse** : *"Next.js App Router offre une architecture unifiée Frontend et Backend Serverless en TypeScript. Cela permet de conserver le même langage sur toute la stack, d'assurer une exécution ultra-rapide grâce au rendu côté serveur (SSR), et de bénéficier de la gestion Server Actions. Prisma ORM garantit quant à lui un typage automatique strict de la base de données, éliminant les erreurs SQL à l'exécution."*

### Q2 : Comment la ventilation des dépenses imprévues est-elle calculée entre les copropriétaires ?
> **Réponse** : *"Chaque bureau possède une quote-part commune (tantièmes) enregistrée en base de données. Lorsqu'une dépense imprévue est saisie par le syndic, le système calcule le montant attribué à chaque lot selon la formule : `(Quote-part commune du lot / Somme totale des quote-parts) × Montant de la dépense`. Le résultat met immédiatement à jour le montant dû dans l'échéancier du bureau."*

### Q3 : Comment garantissez-vous la sécurité des données et l'étanchéité des rôles (RBAC) ?
> **Réponse** : *"La sécurité repose sur l'architecture RBAC. Chaque requête API vérifie le jeton JWT signé avec HS256 et stocké dans un cookie sécurisé HttpOnly. Les routes de l'espace copropriétaire filtrent les requêtes pour ne retourner strictement que les données associées aux lots du résident connecté."*

### Q4 : Pourquoi avoir utilisé une base de données Serverless Cloud comme Neon PostgreSQL ?
> **Réponse** : *"Neon PostgreSQL apporte le concept d'auto-scaling et de scale-to-zero, ajustant automatiquement les ressources CPU et mémoire selon le trafic. Il propose également le 'Database Branching', permettant de dupliquer la base de production instantanément sous forme de branche pour tester les migrations Prisma sans risque."*

### Q5 : Comment fonctionne le mécanisme de sondage obligatoire bloquant pour le copropriétaire ?
> **Réponse** : *"À la connexion d'un copropriétaire, une requête API (`GET /api/votes`) vérifie s'il existe des scrutins actifs non répondus. Si oui, l'application affiche une modale prioritaire bloquant l'accès au reste du portail tant que l'utilisateur n'a pas soumis son vote (Pour, Contre, Neutre). Cela garantit un taux de participation maximal aux décisions de la résidence."*

### Q6 : Comment est généré le reçu de caisse en PDF ?
> **Réponse** : *"Le reçu de caisse est généré côté client à l'aide de la bibliothèque `jsPDF`. Lorsque le syndic valide la perception du montant d'un paiement, l'application génère un document PDF certifié contenant un numéro de recu unique, la date, le nom du copropriétaire, la désignation du bureau et le montant acquitté avec signature officielle."*

### Q7 : Quelle est la différence entre les charges fixes et les charges variables dans le budget prévisionnel ?
> **Réponse** : *"Les charges fixes englobent les contrats d'entretien prévisibles et récurrents (gardiennage, maintenance d'ascenseur, assurance). Les charges variables couvrent les consommations fluctuantes (eau et électricité des communs). Ensembles, elles permettent d'établir le budget prévisionnel annuel duquel sont déduites les 12 échéances mensuelles."*

### Q8 : Comment gérez-vous le mode anonyme sur le mur d'annonces ?
> **Réponse** : *"Lorsqu'un utilisateur publie une remarque en cochant l'option 'Publier anonymement', le champ `isAnonymous` est défini sur `true` dans la table `GroupMessage`. Lors du rendu sur l'interface, le composant `GroupMessagesUI` masque le nom et le prénom de l'auteur et affiche l'expéditeur sous l'étiquette 'Anonyme' avec les initiales '?'."*

### Q9 : Comment avez-vous assuré la qualité du code et l'absence de bugs ?
> **Réponse** : *"La qualité du code a été assurée par un typage strict en TypeScript sur 100% du code source. La commande `npx tsc --noEmit` a été exécutée à chaque étape du développement pour s'assurer qu'aucune erreur de compilation ou de typage n'était présente dans le projet."*

### Q10 : Quelles sont les limites actuelles du projet et comment comptez-vous les faire évoluer ?
> **Réponse** : *"La principale limite actuelle est le règlement manuel des cotisations (saisie du montant perçu par le syndic). La prochaine étape consistera à intégrer la passerelle de paiement en ligne CMI/Stripe pour permettre aux copropriétaires de régler directement par carte bancaire, ainsi que le développement d'une application mobile native sous React Native."*
