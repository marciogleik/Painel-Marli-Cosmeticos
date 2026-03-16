-- Create template first if it doesn't exist
INSERT INTO anamnesis_templates (id, name, is_active, created_at, updated_at)
SELECT 'b123b9c9-2f5a-4f51-a982-f5e55cd78203', 'Evolução Corporal', true, now(), now()
WHERE NOT EXISTS (
    SELECT 1 FROM anamnesis_templates WHERE name = 'Evolução Corporal'
);

-- Then update its fields
UPDATE anamnesis_templates
SET fields = '[
  {
    "id": "f7852c2e-cc7a-48ad-a3fa-9c21dc7f54f5",
    "type": "modelo_padrao",
    "label": "Acompanhamento",
    "content": "Acompanhamento:\n\nsessão | data | observação\n---|---|---\n | | \n | | \n | | \n | | \n | | \n | | \n | | \n | | \n",
    "sameLine": false,
    "isActive": true
  }
]'::jsonb
WHERE name = 'Evolução Corporal';
