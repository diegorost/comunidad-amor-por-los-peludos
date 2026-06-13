PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE dogs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  photo_url TEXT,
  breed TEXT NOT NULL,
  personality TEXT,
  notes TEXT,
  owner_name TEXT NOT NULL,
  owner_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
, birthdate TEXT);
INSERT INTO "dogs" ("id","name","photo_url","breed","personality","notes","owner_name","owner_id","created_at","birthdate") VALUES('d655972f-884d-4aa5-a12c-fda15f03646d','Lucy','/api/images/c1226c81-268b-4ec3-bff6-0bce5a41ecce.jpg','Golden Retriever','Bipolar, Seria, Comilona','Lucy es la más amigable, excepto cuando hay comida','Diego',NULL,'2026-06-13 04:03:42','2020-04-14');
INSERT INTO "dogs" ("id","name","photo_url","breed","personality","notes","owner_name","owner_id","created_at","birthdate") VALUES('d2c53dc9-d84c-45a6-a2c3-452ea23dfb18','Luka Bjork','/api/images/8b184cce-b51f-4281-92d2-1423f6a9d8d7.jpg','Golden Retriever','Juguetón, Cariñoso Tranquilos amigable','es un perrito muy especial llego a mi vida de 1 año 5 meses y llego un momento muy especial  Y para su hermano tambien llego a cambiarnos la vida lo amamos','Claudia Veliz',NULL,'2026-06-13 05:31:02','2022-06-21');
INSERT INTO "dogs" ("id","name","photo_url","breed","personality","notes","owner_name","owner_id","created_at","birthdate") VALUES('cac94cd8-fbe8-44e3-b576-4157b0a8d377','Ulises','/api/images/1cb599ba-a21a-4637-8b3a-b5e13546c547.jpg','Mestizo','Mal genio, juguetón Se Cree Cabro Chico','Mi Tuty Lo Rescate, Pero El Es Un Perrito Muy Especial, Me Defendía Se Cree Un Bebé Le Encanta Estar En Brazos De Mama Y Muy Regalon Con Su Hermano Y Es Muy Pegado A Mi','Claudia Veliz',NULL,'2026-06-13 05:35:03','2010-09-19');
INSERT INTO "dogs" ("id","name","photo_url","breed","personality","notes","owner_name","owner_id","created_at","birthdate") VALUES('a4baabba-1ff9-407a-afb2-da81c85f48af','Cloe',NULL,'Golden retriever','Ansiosa, juguetona, divertida','Cloe es pura ansiedad en sus paseos y si llegan visitas, pero es lo mas amorasa del mundo','Carolina',NULL,'2026-06-13 15:22:17','2025-06-27');
CREATE TABLE resources (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('tienda', 'clinica', 'veterinario')),
  address TEXT,
  website TEXT,
  phone TEXT,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
, maps_url TEXT);
INSERT INTO "resources" ("id","name","category","address","website","phone","description","created_at","maps_url") VALUES('a472173b-7c0f-49a1-8172-d5e80cd69bf2','Clinica Vets','clinica','Suecia 3580 Of. 100, Ñuñoa.','https://vets.cl/','+56 22 325 1010',NULL,'2026-06-13 04:06:21','https://maps.app.goo.gl/HspLvP4kiVG4p1gk8');
CREATE TABLE community_highlights (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL,
  image_url TEXT,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS "tips" (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL,
  image_url TEXT,
  text TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO "tips" ("id","title","image_url","text","created_at") VALUES('414e5e5b-e35c-41ec-b5b8-639398685bc1','Reglas de Convivencia','/api/images/e9480b67-c043-4c84-b781-caf23a1c5ed8.jpg',NULL,'2026-06-13 04:37:08');
INSERT INTO "tips" ("id","title","image_url","text","created_at") VALUES('42465b2a-0c56-437d-b7f8-4f4cf8f7e55d','Politicas de Ayuda y Transparencia','/api/images/1d46f4b9-55a7-407c-a07d-7c45c99b4db4.jpg',NULL,'2026-06-13 04:37:27');
INSERT INTO "tips" ("id","title","image_url","text","created_at") VALUES('c5265245-7580-4a70-a312-b0364f8af801','Aqui priorizamos la buena onda!','/api/images/8891689d-0716-486c-a27e-74fae550441f.jpg',NULL,'2026-06-13 04:37:47');
INSERT INTO "tips" ("id","title","image_url","text","created_at") VALUES('ce3b1683-778d-4a22-84af-360fdbd3e293','Lo que también deja el paseo','/api/images/abf22845-f4e1-476c-a988-0084268356bf.jpg',NULL,'2026-06-13 04:38:00');
INSERT INTO "tips" ("id","title","image_url","text","created_at") VALUES('28e00990-dc03-42d5-bafc-e85e43a038d4','Concurso Express','/api/images/7e1db6e9-7b04-44b4-8fe8-22cd70371f4c.jpg',NULL,'2026-06-13 04:38:09');
