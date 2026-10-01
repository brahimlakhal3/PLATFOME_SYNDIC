-- ================================================================
--  SCRIPT DE SEED — APPLICATION CADSYNDIC
--  Mot de passe pour TOUS les utilisateurs : password
-- ================================================================

-- Nettoyage complet dans le bon ordre (FK)
TRUNCATE TABLE "VoteResponse" CASCADE;
TRUNCATE TABLE "Vote"         CASCADE;
TRUNCATE TABLE "GroupMessage" CASCADE;
TRUNCATE TABLE "Message"      CASCADE;
TRUNCATE TABLE "Paiement"     CASCADE;
TRUNCATE TABLE "Depense"      CASCADE;
TRUNCATE TABLE "Charge"       CASCADE;
TRUNCATE TABLE "Bureau"       CASCADE;
TRUNCATE TABLE "User"         CASCADE;

-- ================================================================
-- 1. UTILISATEURS
--    1 syndic + 5 copropriétaires
--    mot de passe bcrypt de "password"
-- ================================================================
INSERT INTO "User" (id, nom, prenom, password, adresse, telephone, role, "syndicId", "createdAt", "updatedAt") VALUES

-- Syndic
('user_syndic_1',
 'Benali', 'Ahmed',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 '15 Rue des Lilas, Hydra, Alger',
 '0555100001', 'syndic', NULL,
 '2026-01-01 08:00:00', '2026-01-01 08:00:00'),

-- Copropriétaire 1
('user_copro_1',
 'Meziane', 'Karim',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 '3 Rue Didouche Mourad, Alger Centre',
 '0555200001', 'coproprietaire', 'user_syndic_1',
 '2026-01-05 09:00:00', '2026-01-05 09:00:00'),

-- Copropriétaire 2
('user_copro_2',
 'Boukhelifa', 'Sara',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 '7 Cité les Pins, Bir Mourad Rais, Alger',
 '0555200002', 'coproprietaire', 'user_syndic_1',
 '2026-01-06 10:00:00', '2026-01-06 10:00:00'),

-- Copropriétaire 3
('user_copro_3',
 'Hamidi', 'Youcef',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 '12 Avenue Souidani Boudjemaa, Alger',
 '0555200003', 'coproprietaire', 'user_syndic_1',
 '2026-01-07 11:00:00', '2026-01-07 11:00:00'),

-- Copropriétaire 4
('user_copro_4',
 'Cherif', 'Nadia',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 '5 Rue Pasteur, Kouba, Alger',
 '0555200004', 'coproprietaire', 'user_syndic_1',
 '2026-01-08 12:00:00', '2026-01-08 12:00:00'),

-- Copropriétaire 5
('user_copro_5',
 'Tlemcani', 'Omar',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 '22 Rue Larbi Ben Mhidi, Alger Centre',
 '0555200005', 'coproprietaire', 'user_syndic_1',
 '2026-01-09 13:00:00', '2026-01-09 13:00:00');


-- ================================================================
-- 2. BUREAUX
--    6 bureaux répartis sur 3 étages
--    Bureau C302 est vacant (pas de userId)
-- ================================================================
-- Calcul des parts effectives (privée + communes×0.5) :
--   A101 : 150 + 40  = 190
--   A102 : 120 + 30  = 150
--   B201 : 180 + 50  = 230
--   B202 : 160 + 45  = 205
--   C301 : 200 + 60  = 260
--   C302 : 140 + 35  = 175   Total = 1210
INSERT INTO "Bureau" (id, "numeroBureau", nom, etage, "titreFoncier",
                      "quotePartPrivee", "quotePartCommunes",
                      "userId", "syndicId", "createdAt", "updatedAt") VALUES
('bureau_1', 1, 'Bureau A101', 1, 'TF-ALG-2024-001', 150, 80,  'user_copro_1', 'user_syndic_1', '2026-01-10 08:00:00', '2026-01-10 08:00:00'),
('bureau_2', 2, 'Bureau A102', 1, 'TF-ALG-2024-002', 120, 60,  'user_copro_2', 'user_syndic_1', '2026-01-10 08:30:00', '2026-01-10 08:30:00'),
('bureau_3', 3, 'Bureau B201', 2, 'TF-ALG-2024-003', 180, 100, 'user_copro_3', 'user_syndic_1', '2026-01-10 09:00:00', '2026-01-10 09:00:00'),
('bureau_4', 4, 'Bureau B202', 2, 'TF-ALG-2024-004', 160, 90,  'user_copro_4', 'user_syndic_1', '2026-01-10 09:30:00', '2026-01-10 09:30:00'),
('bureau_5', 5, 'Bureau C301', 3, 'TF-ALG-2024-005', 200, 120, 'user_copro_5', 'user_syndic_1', '2026-01-10 10:00:00', '2026-01-10 10:00:00'),
('bureau_6', 6, 'Bureau C302', 3, 'TF-ALG-2024-006', 140, 70,  NULL,          'user_syndic_1', '2026-01-10 10:30:00', '2026-01-10 10:30:00');


-- ================================================================
-- 3. CHARGES PRÉVISIONNELLES 2026
--    Total : 360 000 DA/an — 30 000 DA/mois
-- ================================================================
INSERT INTO "Charge" (id, libelle, description, "montantAnnuel", "montantMensuel",
                      "typeFixe", "imageUrl", annee, "syndicId", "createdAt", "updatedAt") VALUES
('charge_1', 'Assurance immeuble',
 'Assurance multirisque habitation pour l''ensemble de l''immeuble',
 120000, 10000, true, NULL, 2026, 'user_syndic_1',
 '2026-01-15 08:00:00', '2026-01-15 08:00:00'),

('charge_2', 'Entretien ascenseur',
 'Contrat de maintenance mensuelle et révision annuelle de l''ascenseur',
 72000, 6000, true, NULL, 2026, 'user_syndic_1',
 '2026-01-15 08:30:00', '2026-01-15 08:30:00'),

('charge_3', 'Gardiennage',
 'Salaire du gardien responsable de la sécurité et du nettoyage',
 96000, 8000, true, NULL, 2026, 'user_syndic_1',
 '2026-01-15 09:00:00', '2026-01-15 09:00:00'),

('charge_4', 'Nettoyage parties communes',
 'Prestation de nettoyage hebdomadaire des couloirs, escaliers et hall d''entrée',
 48000, 4000, true, NULL, 2026, 'user_syndic_1',
 '2026-01-15 09:30:00', '2026-01-15 09:30:00'),

('charge_5', 'Consommation eau parties communes',
 'Facture eau pour arrosage jardin, nettoyage, sanitaires communs',
 24000, 2000, false, NULL, 2026, 'user_syndic_1',
 '2026-01-15 10:00:00', '2026-01-15 10:00:00');


-- ================================================================
-- 4. PAIEMENTS 2026
--    72 lignes : 6 bureaux × 12 mois
--    Mensualités :
--      A101 : 4 710.74 DA   A102 : 3 719.01 DA
--      B201 : 5 702.48 DA   B202 : 5 082.64 DA
--      C301 : 6 446.28 DA   C302 : 4 338.84 DA
--
--    Comportements :
--      A101 (Meziane)    — payé jan→aoû, impayé sep→déc
--      A102 (Boukhelifa) — payé jan→juil, impayé aoû→déc
--      B201 (Hamidi)     — payé jan→aoû, impayé sep→déc
--      B202 (Cherif)     — payé jan→juin, impayé juil→déc (retardataire)
--      C301 (Tlemcani)   — payé jan→aoû, impayé sep→déc
--      C302 (vacant)     — payé jan→mai, impayé juin→déc
-- ================================================================

-- ---------- Bureau A101 — Meziane Karim (4710.74 DA/mois) ----------
INSERT INTO "Paiement" (id, mois, annee, montant, "montantReel", statut, "bureauId", "createdAt", "updatedAt") VALUES
('p_b1_m01',  1, 2026, 4710.74, 4710.74, 'payé',   'bureau_1', '2026-01-31 10:00:00', '2026-02-04 14:00:00'),
('p_b1_m02',  2, 2026, 4710.74, 4710.74, 'payé',   'bureau_1', '2026-02-28 10:00:00', '2026-03-05 11:00:00'),
('p_b1_m03',  3, 2026, 4710.74, 4710.74, 'payé',   'bureau_1', '2026-03-31 10:00:00', '2026-04-03 09:00:00'),
('p_b1_m04',  4, 2026, 4710.74, 4800.00, 'payé',   'bureau_1', '2026-04-30 10:00:00', '2026-05-02 16:00:00'),
('p_b1_m05',  5, 2026, 4710.74, 4710.74, 'payé',   'bureau_1', '2026-05-31 10:00:00', '2026-06-01 10:00:00'),
('p_b1_m06',  6, 2026, 4710.74, 4710.74, 'payé',   'bureau_1', '2026-06-30 10:00:00', '2026-07-04 14:00:00'),
('p_b1_m07',  7, 2026, 4710.74, 4710.74, 'payé',   'bureau_1', '2026-07-31 10:00:00', '2026-08-02 11:00:00'),
('p_b1_m08',  8, 2026, 4710.74, 4710.74, 'payé',   'bureau_1', '2026-08-31 10:00:00', '2026-09-01 09:00:00'),
('p_b1_m09',  9, 2026, 4710.74, NULL,    'impayé', 'bureau_1', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b1_m10', 10, 2026, 4710.74, NULL,    'impayé', 'bureau_1', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b1_m11', 11, 2026, 4710.74, NULL,    'impayé', 'bureau_1', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b1_m12', 12, 2026, 4710.74, NULL,    'impayé', 'bureau_1', '2026-09-07 08:00:00', '2026-09-07 08:00:00');

-- ---------- Bureau A102 — Boukhelifa Sara (3719.01 DA/mois) ----------
INSERT INTO "Paiement" (id, mois, annee, montant, "montantReel", statut, "bureauId", "createdAt", "updatedAt") VALUES
('p_b2_m01',  1, 2026, 3719.01, 3719.01, 'payé',   'bureau_2', '2026-01-31 10:00:00', '2026-02-06 10:00:00'),
('p_b2_m02',  2, 2026, 3719.01, 3719.01, 'payé',   'bureau_2', '2026-02-28 10:00:00', '2026-03-07 10:00:00'),
('p_b2_m03',  3, 2026, 3719.01, 3719.01, 'payé',   'bureau_2', '2026-03-31 10:00:00', '2026-04-05 10:00:00'),
('p_b2_m04',  4, 2026, 3719.01, 3719.01, 'payé',   'bureau_2', '2026-04-30 10:00:00', '2026-05-04 10:00:00'),
('p_b2_m05',  5, 2026, 3719.01, 3700.00, 'payé',   'bureau_2', '2026-05-31 10:00:00', '2026-06-03 10:00:00'),
('p_b2_m06',  6, 2026, 3719.01, 3719.01, 'payé',   'bureau_2', '2026-06-30 10:00:00', '2026-07-06 10:00:00'),
('p_b2_m07',  7, 2026, 3719.01, 3719.01, 'payé',   'bureau_2', '2026-07-31 10:00:00', '2026-08-05 10:00:00'),
('p_b2_m08',  8, 2026, 3719.01, NULL,    'impayé', 'bureau_2', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b2_m09',  9, 2026, 3719.01, NULL,    'impayé', 'bureau_2', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b2_m10', 10, 2026, 3719.01, NULL,    'impayé', 'bureau_2', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b2_m11', 11, 2026, 3719.01, NULL,    'impayé', 'bureau_2', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b2_m12', 12, 2026, 3719.01, NULL,    'impayé', 'bureau_2', '2026-09-07 08:00:00', '2026-09-07 08:00:00');

-- ---------- Bureau B201 — Hamidi Youcef (5702.48 DA/mois) ----------
INSERT INTO "Paiement" (id, mois, annee, montant, "montantReel", statut, "bureauId", "createdAt", "updatedAt") VALUES
('p_b3_m01',  1, 2026, 5702.48, 5702.48, 'payé',   'bureau_3', '2026-01-31 10:00:00', '2026-02-03 10:00:00'),
('p_b3_m02',  2, 2026, 5702.48, 5702.48, 'payé',   'bureau_3', '2026-02-28 10:00:00', '2026-03-04 10:00:00'),
('p_b3_m03',  3, 2026, 5702.48, 5702.48, 'payé',   'bureau_3', '2026-03-31 10:00:00', '2026-04-02 10:00:00'),
('p_b3_m04',  4, 2026, 5702.48, 5702.48, 'payé',   'bureau_3', '2026-04-30 10:00:00', '2026-05-01 10:00:00'),
('p_b3_m05',  5, 2026, 5702.48, 5702.48, 'payé',   'bureau_3', '2026-05-31 10:00:00', '2026-06-02 10:00:00'),
('p_b3_m06',  6, 2026, 5702.48, 5800.00, 'payé',   'bureau_3', '2026-06-30 10:00:00', '2026-07-03 10:00:00'),
('p_b3_m07',  7, 2026, 5702.48, 5702.48, 'payé',   'bureau_3', '2026-07-31 10:00:00', '2026-08-01 10:00:00'),
('p_b3_m08',  8, 2026, 5702.48, 5702.48, 'payé',   'bureau_3', '2026-08-31 10:00:00', '2026-09-02 10:00:00'),
('p_b3_m09',  9, 2026, 5702.48, NULL,    'impayé', 'bureau_3', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b3_m10', 10, 2026, 5702.48, NULL,    'impayé', 'bureau_3', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b3_m11', 11, 2026, 5702.48, NULL,    'impayé', 'bureau_3', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b3_m12', 12, 2026, 5702.48, NULL,    'impayé', 'bureau_3', '2026-09-07 08:00:00', '2026-09-07 08:00:00');

-- ---------- Bureau B202 — Cherif Nadia (5082.64 DA/mois — retardataire) ----------
INSERT INTO "Paiement" (id, mois, annee, montant, "montantReel", statut, "bureauId", "createdAt", "updatedAt") VALUES
('p_b4_m01',  1, 2026, 5082.64, 5082.64, 'payé',   'bureau_4', '2026-01-31 10:00:00', '2026-02-10 10:00:00'),
('p_b4_m02',  2, 2026, 5082.64, 5082.64, 'payé',   'bureau_4', '2026-02-28 10:00:00', '2026-03-12 10:00:00'),
('p_b4_m03',  3, 2026, 5082.64, 5082.64, 'payé',   'bureau_4', '2026-03-31 10:00:00', '2026-04-15 10:00:00'),
('p_b4_m04',  4, 2026, 5082.64, 5082.64, 'payé',   'bureau_4', '2026-04-30 10:00:00', '2026-05-18 10:00:00'),
('p_b4_m05',  5, 2026, 5082.64, 5082.64, 'payé',   'bureau_4', '2026-05-31 10:00:00', '2026-06-20 10:00:00'),
('p_b4_m06',  6, 2026, 5082.64, 5082.64, 'payé',   'bureau_4', '2026-06-30 10:00:00', '2026-07-22 10:00:00'),
('p_b4_m07',  7, 2026, 5082.64, NULL,    'impayé', 'bureau_4', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b4_m08',  8, 2026, 5082.64, NULL,    'impayé', 'bureau_4', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b4_m09',  9, 2026, 5082.64, NULL,    'impayé', 'bureau_4', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b4_m10', 10, 2026, 5082.64, NULL,    'impayé', 'bureau_4', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b4_m11', 11, 2026, 5082.64, NULL,    'impayé', 'bureau_4', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b4_m12', 12, 2026, 5082.64, NULL,    'impayé', 'bureau_4', '2026-09-07 08:00:00', '2026-09-07 08:00:00');

-- ---------- Bureau C301 — Tlemcani Omar (6446.28 DA/mois) ----------
INSERT INTO "Paiement" (id, mois, annee, montant, "montantReel", statut, "bureauId", "createdAt", "updatedAt") VALUES
('p_b5_m01',  1, 2026, 6446.28, 6446.28, 'payé',   'bureau_5', '2026-01-31 10:00:00', '2026-02-02 10:00:00'),
('p_b5_m02',  2, 2026, 6446.28, 6446.28, 'payé',   'bureau_5', '2026-02-28 10:00:00', '2026-03-01 10:00:00'),
('p_b5_m03',  3, 2026, 6446.28, 6446.28, 'payé',   'bureau_5', '2026-03-31 10:00:00', '2026-04-01 10:00:00'),
('p_b5_m04',  4, 2026, 6446.28, 6446.28, 'payé',   'bureau_5', '2026-04-30 10:00:00', '2026-05-01 10:00:00'),
('p_b5_m05',  5, 2026, 6446.28, 6446.28, 'payé',   'bureau_5', '2026-05-31 10:00:00', '2026-06-01 10:00:00'),
('p_b5_m06',  6, 2026, 6446.28, 6446.28, 'payé',   'bureau_5', '2026-06-30 10:00:00', '2026-07-01 10:00:00'),
('p_b5_m07',  7, 2026, 6446.28, 6446.28, 'payé',   'bureau_5', '2026-07-31 10:00:00', '2026-08-01 10:00:00'),
('p_b5_m08',  8, 2026, 6446.28, 6500.00, 'payé',   'bureau_5', '2026-08-31 10:00:00', '2026-09-01 10:00:00'),
('p_b5_m09',  9, 2026, 6446.28, NULL,    'impayé', 'bureau_5', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b5_m10', 10, 2026, 6446.28, NULL,    'impayé', 'bureau_5', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b5_m11', 11, 2026, 6446.28, NULL,    'impayé', 'bureau_5', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b5_m12', 12, 2026, 6446.28, NULL,    'impayé', 'bureau_5', '2026-09-07 08:00:00', '2026-09-07 08:00:00');

-- ---------- Bureau C302 — Vacant (4338.84 DA/mois) ----------
INSERT INTO "Paiement" (id, mois, annee, montant, "montantReel", statut, "bureauId", "createdAt", "updatedAt") VALUES
('p_b6_m01',  1, 2026, 4338.84, 4338.84, 'payé',   'bureau_6', '2026-01-31 10:00:00', '2026-02-08 10:00:00'),
('p_b6_m02',  2, 2026, 4338.84, 4338.84, 'payé',   'bureau_6', '2026-02-28 10:00:00', '2026-03-09 10:00:00'),
('p_b6_m03',  3, 2026, 4338.84, 4338.84, 'payé',   'bureau_6', '2026-03-31 10:00:00', '2026-04-10 10:00:00'),
('p_b6_m04',  4, 2026, 4338.84, 4338.84, 'payé',   'bureau_6', '2026-04-30 10:00:00', '2026-05-08 10:00:00'),
('p_b6_m05',  5, 2026, 4338.84, 4338.84, 'payé',   'bureau_6', '2026-05-31 10:00:00', '2026-06-07 10:00:00'),
('p_b6_m06',  6, 2026, 4338.84, NULL,    'impayé', 'bureau_6', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b6_m07',  7, 2026, 4338.84, NULL,    'impayé', 'bureau_6', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b6_m08',  8, 2026, 4338.84, NULL,    'impayé', 'bureau_6', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b6_m09',  9, 2026, 4338.84, NULL,    'impayé', 'bureau_6', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b6_m10', 10, 2026, 4338.84, NULL,    'impayé', 'bureau_6', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b6_m11', 11, 2026, 4338.84, NULL,    'impayé', 'bureau_6', '2026-09-07 08:00:00', '2026-09-07 08:00:00'),
('p_b6_m12', 12, 2026, 4338.84, NULL,    'impayé', 'bureau_6', '2026-09-07 08:00:00', '2026-09-07 08:00:00');


-- ================================================================
-- 5. DÉPENSES RÉELLES 2026
--    Total dépenses : 62 500 DA
-- ================================================================
INSERT INTO "Depense" (id, libelle, montant, "moisDepart", annee, "imageUrl", "syndicId", "createdAt", "updatedAt") VALUES
('depense_1', 'Réparation ascenseur — panne moteur',          15000, 1, 2026, NULL, 'user_syndic_1', '2026-01-20 10:00:00', '2026-01-20 10:00:00'),
('depense_2', 'Achat produits de nettoyage',                   3500, 2, 2026, NULL, 'user_syndic_1', '2026-02-10 10:00:00', '2026-02-10 10:00:00'),
('depense_3', 'Peinture couloirs rez-de-chaussée',             8000, 3, 2026, NULL, 'user_syndic_1', '2026-03-15 10:00:00', '2026-03-15 10:00:00'),
('depense_4', 'Réparation pompe à eau de la citerne',         12000, 4, 2026, NULL, 'user_syndic_1', '2026-04-08 10:00:00', '2026-04-08 10:00:00'),
('depense_5', 'Remplacement éclairage LED parties communes',   5000, 5, 2026, NULL, 'user_syndic_1', '2026-05-22 10:00:00', '2026-05-22 10:00:00'),
('depense_6', 'Entretien climatisation hall d''entrée',        9500, 6, 2026, NULL, 'user_syndic_1', '2026-06-12 10:00:00', '2026-06-12 10:00:00'),
('depense_7', 'Réparation porte d''entrée principale',         6000, 7, 2026, NULL, 'user_syndic_1', '2026-07-03 10:00:00', '2026-07-03 10:00:00'),
('depense_8', 'Achat matériel de jardinage et bacs à fleurs',  3500, 8, 2026, NULL, 'user_syndic_1', '2026-08-18 10:00:00', '2026-08-18 10:00:00');


-- ================================================================
-- 6. MESSAGES PRIVÉS
-- ================================================================
INSERT INTO "Message" (id, content, lu, "senderId", "receiverId", "createdAt", "updatedAt") VALUES

-- Karim → Syndic
('msg_1',
 'Bonjour M. Benali, je voulais signaler une fuite d''eau dans le couloir du 1er étage.',
 true, 'user_copro_1', 'user_syndic_1',
 '2026-03-10 09:30:00', '2026-03-10 09:30:00'),

-- Syndic → Karim
('msg_2',
 'Bonjour M. Meziane, merci pour le signalement. Un plombier interviendra demain matin.',
 true, 'user_syndic_1', 'user_copro_1',
 '2026-03-10 11:00:00', '2026-03-10 11:00:00'),

-- Karim → Syndic
('msg_3',
 'Parfait, merci beaucoup pour la réactivité.',
 true, 'user_copro_1', 'user_syndic_1',
 '2026-03-10 11:30:00', '2026-03-10 11:30:00'),

-- Sara → Syndic
('msg_4',
 'Bonsoir M. Benali, pouvez-vous me communiquer le relevé de paiements pour le mois de mai ?',
 true, 'user_copro_2', 'user_syndic_1',
 '2026-06-02 18:00:00', '2026-06-02 18:00:00'),

-- Syndic → Sara
('msg_5',
 'Bonsoir Mme Boukhelifa, vous pouvez consulter votre espace personnel, toutes les informations y sont disponibles.',
 true, 'user_syndic_1', 'user_copro_2',
 '2026-06-02 19:00:00', '2026-06-02 19:00:00'),

-- Nadia → Syndic (non lu)
('msg_6',
 'Bonjour, j''ai du mal à payer ce mois-ci, est-ce qu''on peut discuter d''un arrangement ?',
 false, 'user_copro_4', 'user_syndic_1',
 '2026-09-05 10:00:00', '2026-09-05 10:00:00'),

-- Omar → Syndic (non lu)
('msg_7',
 'Bonjour M. Benali, l''ampoule du couloir du 3ème étage est grillée depuis 3 jours.',
 false, 'user_copro_5', 'user_syndic_1',
 '2026-09-06 08:45:00', '2026-09-06 08:45:00');


-- ================================================================
-- 7. MESSAGES DE GROUPE
-- ================================================================
INSERT INTO "GroupMessage" (id, content, "senderId", "syndicId", "isAnonymous", "createdAt", "updatedAt") VALUES

('grpmsg_1',
 'Bonjour à tous, nous vous informons que les travaux de peinture des couloirs débuteront lundi 16 mars. Merci de votre compréhension.',
 'user_syndic_1', 'user_syndic_1', false,
 '2026-03-13 10:00:00', '2026-03-13 10:00:00'),

('grpmsg_2',
 'Rappel : la réunion annuelle de copropriété se tiendra le samedi 20 juin à 10h dans le hall d''entrée. Votre présence est souhaitée.',
 'user_syndic_1', 'user_syndic_1', false,
 '2026-06-10 09:00:00', '2026-06-10 09:00:00'),

('grpmsg_3',
 'Le gardien sera absent du 1er au 10 août. Merci de veiller à la propreté des parties communes durant cette période.',
 'user_syndic_1', 'user_syndic_1', false,
 '2026-07-28 10:00:00', '2026-07-28 10:00:00'),

-- Message anonyme d'un copropriétaire
('grpmsg_4',
 'Peut-on envisager l''installation d''un interphone vidéo à l''entrée ? Ce serait plus sécurisé.',
 'user_copro_3', 'user_syndic_1', true,
 '2026-08-05 15:00:00', '2026-08-05 15:00:00'),

('grpmsg_5',
 'Bonne nouvelle : le devis pour le remplacement de l''ascenseur a été validé. Les travaux commenceront en octobre.',
 'user_syndic_1', 'user_syndic_1', false,
 '2026-09-01 11:00:00', '2026-09-01 11:00:00');


-- ================================================================
-- 8. VOTES
-- ================================================================
INSERT INTO "Vote" (id, title, description, actif, "syndicId", "createdAt", "updatedAt") VALUES

('vote_1',
 'Remplacement complet de l''ascenseur',
 'L''ascenseur actuel date de 2005 et nécessite des réparations fréquentes. Le devis de remplacement complet s''élève à 850 000 DA répartis sur 3 ans. Êtes-vous pour ce remplacement ?',
 false, 'user_syndic_1',
 '2026-06-15 10:00:00', '2026-08-01 10:00:00'),

('vote_2',
 'Installation de caméras de surveillance',
 'Suite à plusieurs incidents dans le parking, il est proposé d''installer 4 caméras de surveillance (entrée, parking, couloirs). Coût estimé : 120 000 DA. Êtes-vous favorable à cette installation ?',
 true, 'user_syndic_1',
 '2026-09-01 10:00:00', '2026-09-01 10:00:00');


-- ================================================================
-- 9. RÉPONSES AUX VOTES
-- ================================================================

-- Vote 1 (fermé) — tous les 5 copropriétaires ont répondu
INSERT INTO "VoteResponse" (id, "voteId", "userId", choix, "createdAt") VALUES
('vr_v1_c1', 'vote_1', 'user_copro_1', 'pour',        '2026-06-16 10:00:00'),
('vr_v1_c2', 'vote_1', 'user_copro_2', 'pour',        '2026-06-17 11:00:00'),
('vr_v1_c3', 'vote_1', 'user_copro_3', 'contre',      '2026-06-18 09:00:00'),
('vr_v1_c4', 'vote_1', 'user_copro_4', 'abstention',  '2026-06-20 14:00:00'),
('vr_v1_c5', 'vote_1', 'user_copro_5', 'pour',        '2026-06-22 16:00:00');

-- Vote 2 (ouvert) — 3 copropriétaires ont déjà répondu, 2 restants
INSERT INTO "VoteResponse" (id, "voteId", "userId", choix, "createdAt") VALUES
('vr_v2_c1', 'vote_2', 'user_copro_1', 'pour',   '2026-09-02 10:00:00'),
('vr_v2_c2', 'vote_2', 'user_copro_2', 'contre', '2026-09-03 11:00:00'),
('vr_v2_c5', 'vote_2', 'user_copro_5', 'pour',   '2026-09-04 09:00:00');


-- ================================================================
-- RÉSUMÉ DES DONNÉES INSÉRÉES
-- ================================================================
-- Utilisateurs      : 6  (1 syndic + 5 copropriétaires)
-- Bureaux           : 6  (5 occupés + 1 vacant)
-- Charges 2026      : 5  → Total 360 000 DA/an
-- Paiements 2026    : 72 (6 bureaux × 12 mois)
-- Dépenses 2026     : 8  → Total 62 500 DA
-- Messages privés   : 7
-- Messages de groupe: 5  (dont 1 anonyme)
-- Votes             : 2  (1 fermé, 1 ouvert)
-- Réponses votes    : 8
--
-- Connexion syndic        : téléphone=0555100001  mot de passe=password
-- Connexion copro Meziane : téléphone=0555200001  mot de passe=password
-- Connexion copro Cherif  : téléphone=0555200004  mot de passe=password
-- ================================================================
