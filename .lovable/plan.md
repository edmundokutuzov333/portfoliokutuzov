# Invoicing 2.0 — sistema de faturação profissional (fase única)

Transformar a faturação atual (1 linha, valor único, PDF simples) num módulo completo de faturação com itens, impostos, depósitos, PDF de altíssima qualidade descarregável de imediato, portal do cliente e um painel de gestão com KPIs.

## 1. Modelo de dados (nova migração)

- `invoice_line_items` — itens por briefing: `description`, `qty`, `unit_price`, `unit` (dia/projeto/un.), `discount_pct`, `sort_order`. RLS: leitura/escrita apenas admin, `GRANT` para `authenticated` + `service_role`.
- Novas colunas em `briefing_submissions`: `invoice_subtotal`, `invoice_discount_pct`, `invoice_tax_label` (ex. IVA 16%), `invoice_tax_pct`, `invoice_tax_amount`, `invoice_total`, `invoice_deposit_pct`, `invoice_deposit_amount`, `invoice_issue_date`, `invoice_terms`, `invoice_reminder_count`, `invoice_last_reminder_at`, `invoice_payment_proof_path`, `invoice_payment_ref`.
- `invoice_counters` — numeração sequencial real e à prova de duplicados (`EK-2026-0007`), via função `next_invoice_number()` (security definer, incremento atómico por ano).
- Bucket privado `invoice-proofs` para comprovativos enviados pelo cliente (upload assinado, sem leitura pública).

## 2. Motor de PDF v2 — direção de arte

Reescrita completa do gerador (`pdf-lib`, dentro do worker):

- Grelha tipográfica editorial: banda de cor com o logo, número grande em display, blocos "Emitido / Vencimento / Referência".
- Tabela de itens paginada (multi-página com cabeçalho repetido e "página X de Y"), zebra sutil, alinhamento decimal.
- Bloco de totais: subtotal, desconto, imposto, **TOTAL**, e "Depósito a pagar agora" destacado em cor de marca.
- **QR code** vetorial (gerado em JS puro, sem dependências nativas) que abre o portal do cliente / referência de pagamento.
- Selo diagonal `PAID` quando liquidada, e `VOID` quando anulada.
- Rodapé com dados bancários, M-Pesa, termos, texto legal e nota de proforma.
- Metadados PDF corretos (título, autor, assunto) e cores derivadas da `brand_color` do estúdio.

## 3. Download imediato e de alta qualidade

- Nova função `renderInvoicePdf` devolve o PDF (base64) para download instantâneo no admin — sem precisar de gerar e guardar primeiro ("baixar PDF de primeira").
- Botão **Descarregar PDF** sempre ativo: pré-visualiza o estado atual do formulário (itens, impostos, depósito).
- Depois de "Gerar", o PDF fica no bucket privado e é servido por URL assinado (7 dias), com botão de re-emissão.

## 4. Funções de servidor (todas admin-only, RLS respeitada)

- `saveInvoiceDraft` — grava itens + impostos + depósito e recalcula totais no servidor (fonte única de verdade).
- `renderInvoicePdf` — PDF on-the-fly para download/preview.
- `generateBriefingInvoice` — numeração sequencial, PDF final, snapshot dos itens, evento no histórico.
- `sendBriefingInvoice` — email HTML redesenhado com resumo dos itens, total, depósito e CTA para o portal.
- `sendInvoiceReminder` — lembrete de cobrança (tom cordial, conta lembretes enviados).
- `duplicateInvoice` — clona itens/condições para novo trabalho do mesmo cliente.
- `markInvoicePaid` — data, referência e método de pagamento; regista evento.
- `listInvoices` — lista global com filtros (estado, cliente, período) e KPIs.
- `exportInvoicesCsv` — exportação contabilística.
- `getPublicInvoice` (público) — passa a devolver itens, totais, depósito e QR.
- `submitPaymentProof` (público, token) — cliente envia referência/comprovativo; muda estado para "em verificação" e notifica o estúdio.

## 5. Admin — workspace de faturação

- Novo separador **Invoicing** no control room: KPIs (a receber, vencidas, pago este mês, ticket médio), lista com estados coloridos, busca, filtros e ações rápidas (PDF, link do cliente, lembrete, marcar pago).
- `InvoicePanel` reconstruído: editor de itens (adicionar/remover/reordenar, qty × preço), desconto, imposto, depósito, termos, cálculo em tempo real, condições rápidas ("50% adiantamento", "Net 15/30"), pré-visualização de email, timeline de eventos e alertas de vencimento.
- Todo o cálculo mostrado no ecrã é revalidado no servidor antes de gerar.

## 6. Portal do cliente (`/i/:token`)

- Layout mobile-first com marca do estúdio, itens detalhados, totais, depósito, QR de pagamento, dados bancários/M-Pesa com copiar-num-toque.
- Estados claros: a pagar, vencida (contagem de dias), em verificação, paga (com agradecimento).
- Formulário "Já paguei" com referência + upload de comprovativo, e download do PDF.
- Registo de visualizações e ações no histórico do invoice.

## Notas técnicas

- Compatível com Cloudflare Workers: apenas `pdf-lib` + QR em JS puro; nada de binários nativos, `fs` ou `sharp`.
- Totais calculados exclusivamente no servidor com arredondamento a 2 casas; o cliente nunca decide valores.
- Uploads de comprovativo por URL assinado com limite de tamanho e tipo (PDF/PNG/JPG); bucket permanece privado.
- PDFs continuam servidos por URLs assinados de curta duração — sem bucket público.
- Componentes UI com tokens semânticos existentes; sem cores fixas novas.
- QA obrigatório: gerar PDFs de exemplo (1 item, 15 itens/2 páginas, pago, anulado), converter para imagem e inspecionar cada página antes de entregar.
