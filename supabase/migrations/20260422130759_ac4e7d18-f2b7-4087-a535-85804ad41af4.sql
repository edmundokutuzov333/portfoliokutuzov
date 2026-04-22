
-- Fix: set search_path on set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Restrict listing on public bucket: only allow listing top-level files (not buckets/folders enumeration via API).
-- Drop broad SELECT and replace with one that only matches paths used by the site (logos/, projects/).
DROP POLICY IF EXISTS "public read site-assets" ON storage.objects;
CREATE POLICY "public read site-assets files" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'site-assets'
    AND (storage.foldername(name))[1] IN ('logos','projects','gallery','misc')
  );

-- ============ SEED admin user ============
-- Cria utilizador na auth.users com password 'edmundo2'
DO $$
DECLARE
  v_user_id uuid;
  v_email text := 'edmundokutuzov.mz@gmail.com';
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, crypt('edmundo2', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_users (user_id, email, role)
  VALUES (v_user_id, v_email, 'admin')
  ON CONFLICT (user_id) DO NOTHING;
END $$;

-- ============ SEED site_settings ============
INSERT INTO public.site_settings (key, value) VALUES
('hero', '{
  "eyebrow":"BRAND IDENTITY / ART DIRECTION / DIGITAL SYSTEMS",
  "title_1":"Design systems for brands that",
  "title_accent":"move",
  "title_2":"with precision.",
  "subtitle":"Identidades visuais, direção de arte e experiências digitais construídas com clareza estratégica, tensão visual e precisão técnica.",
  "cta_primary":"Ver portfolio",
  "cta_secondary":"Enviar briefing",
  "status":"Available for selected projects",
  "location":"MAPUTO · SÃO PAULO · REMOTE",
  "volume":"VOL. XII / 2026"
}'::jsonb),
('manifesto', '{
  "title":"A marca não precisa gritar. Ela precisa ficar na memória.",
  "col1":"Sistemas visuais nascem do cruzamento entre estratégia, forma e contraste. Cada decisão tipográfica, cromática e compositiva é uma resposta a uma pergunta de negócio — não um gesto decorativo.",
  "col2":"Trabalho com ritmo editorial, hierarquia precisa e tensão visual controlada para construir marcas que se reconhecem em silêncio. O resultado é uma presença consistente, escalável e impossível de confundir."
}'::jsonb),
('cta_home', '{
  "title":"Vamos desenhar uma presença visual impossível de ignorar.",
  "button":"Começar conversa"
}'::jsonb),
('footer', '{
  "studio":"Edmundo Studio",
  "tagline":"Design systems & art direction · Built with precision.",
  "email":"edmundo@studio.com"
}'::jsonb),
('navbar', '{
  "monogram":"ED.",
  "cta":"Iniciar projeto"
}'::jsonb),
('contact', '{
  "title":"Vamos construir algo que ninguém esquece.",
  "subtitle":"Conta-me sobre o teu projeto — identidade, sistema visual, direção de arte, lançamento digital.",
  "email":"edmundo@studio.com",
  "project_types":["Identidade visual","Direção de arte","Editorial & print","Design digital","Campanha","Outro"],
  "budgets":["< 5k","5k–15k","15k–40k","40k+"]
}'::jsonb),
('social', '{
  "instagram":"https://instagram.com",
  "behance":"https://behance.net",
  "dribbble":"https://dribbble.com",
  "linkedin":"https://linkedin.com"
}'::jsonb),
('about', '{
  "title":"Entre precisão estratégica e acidente visual controlado.",
  "intro":"Edmundo é designer gráfico e art director, focado em identidades visuais, sistemas editoriais e direção de arte digital para marcas que querem deixar de parecer template.",
  "bio":"Há mais de uma década que construo marcas, sistemas e experiências visuais para empresas em três continentes. O meu trabalho cruza rigor editorial, tensão tipográfica e clareza estratégica.",
  "values":["Precisão","Tensão visual","Sistema","Memória"]
}'::jsonb);

-- ============ SEED clients ============
INSERT INTO public.clients (name, sort_order) VALUES
('NOVA',1),('KORA',2),('ALMA',3),('VOLT',4),('NEXUS',5),('AURORA',6),
('MINT',7),('ORBIT',8),('LUME',9),('ATLAS',10),('NOIR',11),('BRAVA',12);

-- ============ SEED projects ============
INSERT INTO public.projects (title, subtitle, category, year, description, palette, span, sort_order, tags) VALUES
('NEXUS','Identity System','Branding','2026','Sistema de identidade visual para uma marca tecnológica com linguagem modular, tipografia proprietária e aplicações digitais.','from-blue-500 via-blue-900 to-slate-950','tall',1,'["identity","tech","system"]'::jsonb),
('AURORA','Editorial Series','Editorial','2025','Série editorial com grelhas rígidas, fotografia tratada e ritmo tipográfico de alto contraste.','from-cyan-300 via-blue-800 to-slate-950','normal',2,'["editorial","print"]'::jsonb),
('VOLT','Campaign Language','Campaign','2025','Direção visual para campanha com energia cromática controlada, motion language e peças social-first.','from-sky-400 via-blue-700 to-slate-950','wide',3,'["campaign","motion"]'::jsonb),
('CHRONOS','Poster System','Experimental','2024','Sistema experimental de cartazes explorando tipografia variável, ruído e composições assimétricas.','from-slate-300 via-blue-800 to-slate-950','normal',4,'["poster","type"]'::jsonb),
('LUME','Digital Launch','Digital','2026','Lançamento digital com microinterações, sistema de motion e arquitetura de marca para escala.','from-cyan-300 via-blue-700 to-slate-950','tall',5,'["digital","launch"]'::jsonb),
('NOIR','Visual Identity','Branding','2024','Identidade minimalista azul escuro sobre cinza, com foco em silêncio visual, peso tipográfico e ritmo.','from-slate-200 via-slate-700 to-slate-950','normal',6,'["identity","minimal"]'::jsonb),
('ATLAS','Brand Architecture','Branding','2025','Arquitetura de marca para um grupo multi-vertical com submarcas, tokens e governance visual.','from-blue-300 via-sky-800 to-slate-950','wide',7,'["architecture","system"]'::jsonb),
('BRAVA','Social Campaign','Campaign','2026','Campanha social com linguagem técnica, contraste cromático e formatos verticais nativos.','from-sky-400 via-blue-800 to-slate-950','normal',8,'["social","campaign"]'::jsonb);

-- ============ SEED services ============
INSERT INTO public.services (number, title, description, icon, sort_order) VALUES
('01','Identidade Visual','Sistemas de marca completos: nome, símbolo, tipografia proprietária, paleta, voz e aplicação.','Hexagon',1),
('02','Direção de Arte','Linguagem visual transversal a campanhas, editorial, motion e digital com consistência cinematográfica.','Aperture',2),
('03','Editorial & Print','Revistas, livros, cartazes e relatórios com ritmo tipográfico, grelha rígida e contraste calculado.','BookOpen',3),
('04','Design Digital','Websites, sistemas de produto e experiências digitais com microinterações precisas.','MonitorDot',4);

-- ============ SEED stats ============
INSERT INTO public.stats (value, label, sort_order) VALUES
('08','YEARS',1),('120+','PROJECTS',2),('16','SECTORS',3),('03','CONTINENTS',4);

-- ============ SEED about_method ============
INSERT INTO public.about_method (number, title, description, sort_order) VALUES
('01','Diagnóstico','Auditoria visual, análise estratégica e mapeamento da territorialidade da marca.',1),
('02','Sistema','Construção de tokens, tipografia, grelha, voz e princípios de aplicação.',2),
('03','Direção','Direção de arte sobre todas as peças, do editorial ao digital, garantindo coesão.',3),
('04','Entrega','Manuais, kits, ficheiros mestres e governance para escalar sem perder identidade.',4);
