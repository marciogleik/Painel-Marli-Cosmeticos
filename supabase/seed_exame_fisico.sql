-- Create template first if it doesn't exist
INSERT INTO anamnesis_templates (id, name, is_active, created_at, updated_at)
SELECT 'c234a9c9-2f5a-4f51-a982-f5e55cd78204', 'Exame Físico', true, now(), now()
WHERE NOT EXISTS (
    SELECT 1 FROM anamnesis_templates WHERE name = 'Exame Físico'
);

-- Then update its fields
UPDATE anamnesis_templates
SET fields = '[
  { "id": "f1a1b1c1-1111-411a-bd2f-fca21147dbb1", "type": "number", "label": "Altura ( cm )", "sameLine": true, "isActive": true },
  { "id": "f2a2b2c2-2222-422a-bd2f-fca21147dbb2", "type": "number", "label": "Busto ( Cm )", "sameLine": false, "isActive": true },
  { "id": "f3a3b3c3-3333-433a-bd2f-fca21147dbb3", "type": "number", "label": "Braço Esquerdo ( )", "sameLine": true, "isActive": true },
  { "id": "f4a4b4c4-4444-444a-bd2f-fca21147dbb4", "type": "number", "label": "Braço Direito ( cm )", "sameLine": false, "isActive": true },
  { "id": "f5a5b5c5-5555-455a-bd2f-fca21147dbb5", "type": "number", "label": "Abdomem ( cm )", "sameLine": true, "isActive": true },
  { "id": "f6a6b6c6-6666-466a-bd2f-fca21147dbb6", "type": "number", "label": "Cintura ( cm )", "sameLine": true, "isActive": true },
  { "id": "f7a7b7c7-7777-477a-bd2f-fca21147dbb7", "type": "number", "label": "Quadril ( cm )", "sameLine": false, "isActive": true },
  { "id": "f8a8b8c8-8888-488a-bd2f-fca21147dbb8", "type": "number", "label": "culote ( cm )", "sameLine": false, "isActive": true },
  { "id": "f9a9b9c9-9999-499a-bd2f-fca21147dbb9", "type": "number", "label": "Coxa Esquerda ( cm )", "sameLine": false, "isActive": true },
  { "id": "f0a0b0c0-0000-400a-bd2f-fca21147dbb0", "type": "number", "label": "Panturilha Direita ( cm )", "sameLine": false, "isActive": true },
  { "id": "f1b1c1d1-1111-411b-bd2f-fca21147dbb1", "type": "number", "label": "Panturilha Esquerda ( cm )", "sameLine": false, "isActive": true },
  { "id": "f2b2c2d2-2222-422b-bd2f-fca21147dbb2", "type": "number", "label": "Peso ( kg )", "sameLine": false, "isActive": true },
  { "id": "f3b3c3d3-3333-433b-bd2f-fca21147dbb3", "type": "number", "label": "Coxa Direita ( cm )", "sameLine": false, "isActive": true },
  {
    "id": "f4b4c4d4-4444-444b-bd2f-fca21147dbb4",
    "type": "modelo_padrao",
    "label": "Bio",
    "content": "data | | | | | | | |\n---|---|---|---|---|---|---|---\nIMC | | | | | | | |\nGordura Corporal | | | | | | | |\nTaxa Muscular | | | | | | | |\nMassa Livre de Gordura | | | | | | | |\nGordura Subcutanea | | | | | | | |\nGordura Visceral | | | | | | | |\nAgua | | | | | | | |\nIdade Metabolica | | | | | | | |\n",
    "sameLine": false,
    "isActive": true
  }
]'::jsonb
WHERE name = 'Exame Físico';
