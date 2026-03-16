-- Create template first if it doesn't exist
INSERT INTO anamnesis_templates (id, name, is_active, created_at, updated_at)
SELECT 'd345b9c9-2f5a-4f51-a982-f5e55cd78205', 'Laser', true, now(), now()
WHERE NOT EXISTS (
    SELECT 1 FROM anamnesis_templates WHERE name = 'Laser'
);

-- Then update its fields
UPDATE anamnesis_templates
SET fields = '[
  { "id": "l1a1b1c1-1111-411a-bd2f-fca21147dbb1", "type": "multiple_choice", "label": "Já fez outro tipo de tratamento com Laser?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "l2a2b2c2-2222-422a-bd2f-fca21147dbb2", "type": "short_text", "label": "se sim, qual?", "sameLine": true, "isActive": true },
  { "id": "l3a3b3c3-3333-433a-bd2f-fca21147dbb3", "type": "multiple_choice", "label": "Fumante", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "l4a4b4c4-4444-444a-bd2f-fca21147dbb4", "type": "multiple_choice", "label": "Alguma Alergia?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "l5a5b5c5-5555-455a-bd2f-fca21147dbb5", "type": "short_text", "label": "Se sim, qual?", "sameLine": false, "isActive": true },
  { "id": "l6a6b6c6-6666-466a-bd2f-fca21147dbb6", "type": "multiple_choice", "label": "Já apresentou infecções por herpes virus em alguma parte do corpo?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "l7a7b7c7-7777-477a-bd2f-fca21147dbb7", "type": "multiple_choice", "label": "Algum historico de cancer de Pele?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "l8a8b8c8-8888-488a-bd2f-fca21147dbb8", "type": "multiple_choice", "label": "Tendencia a Queloides?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  {
    "id": "l9b9c9d9-9999-499b-bd2f-fca21147dbb9",
    "type": "modelo_padrao",
    "label": "Laser",
    "content": "Área do Corpo: | Tamanho: | Tempo:\n---|---|---\nMotivo da Remoção: | Cores: | Houve Retoque: ( )sim ( ) não\n\n\nSessão | Data | Parâmetros | Disparos | Observação | Valor\n---|---|---|---|---|---\n | | | | | \n | | | | | \n | | | | | \n | | | | | \n | | | | | \n | | | | | \n | | | | | \n | | | | | \n",
    "sameLine": false,
    "isActive": true
  }
]'::jsonb
WHERE name = 'Laser';
