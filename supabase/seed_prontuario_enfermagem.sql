-- Create template first if it doesn't exist
INSERT INTO anamnesis_templates (id, name, is_active, created_at, updated_at)
SELECT 'e456b9c9-2f5a-4f51-a982-f5e55cd78206', 'Prontuário de Enfermagem', true, now(), now()
WHERE NOT EXISTS (
    SELECT 1 FROM anamnesis_templates WHERE name = 'Prontuário de Enfermagem'
);

-- Then update its fields
UPDATE anamnesis_templates
SET fields = '[
  { "id": "p1a1b1c1-1111-411a-bd2f-fca21147dbb1", "type": "short_text", "label": "Data", "sameLine": true, "isActive": true },
  { "id": "p2a2b2c2-2222-422a-bd2f-fca21147dbb2", "type": "multiple_choice", "label": "Sexo", "options": ["M", "F"], "sameLine": false, "isActive": true },
  {
    "id": "p3a3b3c3-3333-433a-bd2f-fca21147dbb3",
    "type": "modelo_padrao",
    "label": "Dados Pessoais",
    "content": "**Dados Pessoais:** @NomeCliente\n\n**Data de Nascimento:** @DataNascimento | **CPF:** @CPF\n\n**Endereço:** @Endereco | **Número:** @Numero\n\n**Telefone:** @Telefone1\n",
    "sameLine": false,
    "isActive": true
  },
  { "id": "p4a4b4c4-4444-444a-bd2f-fca21147dbb4", "type": "short_text", "label": "Ocupação:", "sameLine": false, "isActive": true },
  { "id": "p5a5b5c5-5555-455a-bd2f-fca21147dbb5", "type": "short_text", "label": "Médico do Paciente: (Se houver)", "sameLine": false, "isActive": true },
  { "id": "p6a6b6c6-6666-466a-bd2f-fca21147dbb6", "type": "multiple_choice", "label": "Limitações:", "options": ["Cognitiva", "Locomoção", "Visão", "Audição"], "sameLine": false, "isActive": true },
  { "id": "p7a7b7c7-7777-477a-bd2f-fca21147dbb7", "type": "short_text", "label": "OUtras:", "sameLine": false, "isActive": true },
  { "id": "p8a8b8c8-8888-488a-bd2f-fca21147dbb8", "type": "multiple_choice", "label": "Esta em uso de alguma Medicação?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "p9a9b9c9-9999-499a-bd2f-fca21147dbb9", "type": "short_text", "label": "se sim, quais?", "sameLine": false, "isActive": true },
  { "id": "p0a0b0c0-0000-400a-bd2f-fca21147dbb0", "type": "multiple_choice", "label": "Realiza Atividades Físicas?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "p1b1c1d1-1111-411b-bd2f-fca21147dbb1", "type": "short_text", "label": "Com que Fequência?", "sameLine": false, "isActive": true },
  { "id": "p2b2c2d2-2222-422b-bd2f-fca21147dbb2", "type": "multiple_choice", "label": "É portador(a) de Alguma Doença?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "p3b3c3d3-3333-433b-bd2f-fca21147dbb3", "type": "short_text", "label": "Qual?", "sameLine": false, "isActive": true },
  { "id": "p4b4c4d4-4444-444b-bd2f-fca21147dbb4", "type": "short_text", "label": "Queixa Principal:", "sameLine": false, "isActive": true },
  { "id": "p5b5c5d5-5555-455b-bd2f-fca21147dbb5", "type": "short_text", "label": "P.A", "sameLine": false, "isActive": true },
  { "id": "p6b6c6d6-6666-466b-bd2f-fca21147dbb6", "type": "short_text", "label": "Peso:", "sameLine": true, "isActive": true },
  { "id": "p7b7c7d7-7777-477b-bd2f-fca21147dbb7", "type": "short_text", "label": "Altura:", "sameLine": true, "isActive": true },
  { "id": "p8b8c8d8-8888-488b-bd2f-fca21147dbb8", "type": "short_text", "label": "IMC:", "sameLine": false, "isActive": true },
  { "id": "p9b9c9d9-9999-499b-bd2f-fca21147dbb9", "type": "multiple_choice", "label": "Alergia a alguma medicação?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "p0b0c0d0-0000-400b-bd2f-fca21147dbb0", "type": "short_text", "label": "Se sim, qual?", "sameLine": false, "isActive": true },
  { "id": "p1c1d1e1-1111-411c-bd2f-fca21147dbb1", "type": "multiple_choice", "label": "Administrar Medicação Conforme Prescrição Médica", "options": ["Curcumina", "Coenzima Q10", "Metilcobalamina-B12", "Vitamina D600,000UI", "Biotina", "Picolinato de Cromo", "Morosil", "Magnésio", "Vitamina A", "Zinco", "Selenio", "ADEK", "Vit. K2 MK7130mcg+ D3 600.000UI", "Carnitina", "Colageno", "Fenilalnina", "Tripofano", "Inositol + Taurina", "PQQ", "Outras"], "sameLine": false, "isActive": true },
  { "id": "p2c2d2e2-2222-422c-bd2f-fca21147dbb2", "type": "short_text", "label": "Outras Medicações", "sameLine": false, "isActive": true },
  { "id": "p3c3d3e3-3333-433c-bd2f-fca21147dbb3", "type": "multiple_choice", "label": "Prescrição de Enfermagem:", "options": ["Aumentar Ingestão hidrica", "Realizar Atividade Física", "Compressa local com água natural"], "sameLine": false, "isActive": true },
  { "id": "p4c4d4e4-4444-444c-bd2f-fca21147dbb4", "type": "short_text", "label": "outras:", "sameLine": true, "isActive": true },
  {
    "id": "p5c5d5e5-5555-455c-bd2f-fca21147dbb5",
    "type": "modelo_padrao",
    "label": "Acompanhamento",
    "content": "Evolução:\n",
    "sameLine": false,
    "isActive": true
  }
]'::jsonb
WHERE name = 'Prontuário de Enfermagem';
