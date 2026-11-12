# CleanRoom Seal — NEAR Hackathon plan

Chosen by Imran 2026-11-13 ~03:24 Dhaka (option "#1 CleanRoom Seal shuru koro").
Track: `privacy` (primary), also fits `realworld`, `open`.
Deadline: 2026-11-14T23:59:00Z = 2026-11-15 05:59 Dhaka.

## Product
Paste a sensitive document → NEAR AI Cloud (TEE) redacts it → the page verifies,
in the browser, the response signature + attestation evidence → only SHA-256
hashes are sealed on NEAR (testnet) as a chain-of-custody record.

## Verified API facts (checked live 2026-11-12 ~21:24 UTC by Milo)
- POST https://cloud-api.near.ai/v1/chat/completions — OpenAI-compatible, Bearer key.
  CORS: allow-origin reflects caller origin; allow-headers includes
  authorization, content-type, x-no-aliasing → direct browser calls work, no proxy.
- GET https://cloud-api.near.ai/v1/attestation/report — API key OPTIONAL.
  Returns gateway_attestation (ed25519 signing_address, Intel quote) + model attestations.
- GET https://cloud-api.near.ai/v1/signature/<CHAT_ID>?signing_algo=ed25519 — Bearer key required.
  Returns text, signature, signing_address, signature_kind.
- Verify per docs.near.ai/cloud/verification/cloud-api/response-signatures:
  request_hash = SHA-256(exact request body bytes), response_hash = SHA-256(exact response body bytes).
  provider_tee expected text = `<MODEL_ID>:<request_hash>:<response_hash>`;
  gateway expected text = `<request_hash>:<response_hash>`.
  ed25519: verify UTF-8 bytes of `text` with signing_address as public key (hex).
  Send header `x-no-aliasing: true` + canonical model ID so provider_tee can apply.
  A `gateway` signature binds to the gateway, NOT the model TEE — never over-claim.
- Public Verification Center: https://cloud.near.ai/verify?model=<urlencoded model id>
- Default model: z-ai/glm-5.3-flash (verified in /v1/models list 2026-11-12).
- $10 free NEAR AI credits: claim at nearbuilders.org/dashboard (SEPARATE key,
  HACKATHON.md Q-000 — does not appear in cloud.near.ai dashboard).

## Gates
- Gate 1 (Hour 0-1): CORS + first live chat call from browser — CORS PRE-PASSED 2026-11-13.
- Gate 2 (Hour ~7): attestation + signature verification shows real PASS in-page.
  If verification cannot pass, ship honestly-labelled attestation-only version — never fake green.
- Gate 3 (Hour ~38): if seal() contract still broken, ship without it and say so in README.

## Human-only tasks (Imran)
1. NEAR mainnet wallet (payout address) + testnet wallet — seed phrase offline, never in chat.
   NOTE 2026-11-13: MyNearWallet is in limited mode and no longer creates accounts;
   its own page directs new users to **Meteor Wallet** — use wallet.meteorwallet.app.
2. Claim $10 Builders key at nearbuilders.org/dashboard; paste it ONLY into the demo page locally.
3. Approve seal() tx in wallet when we reach Phase 2.
4. Demo uses a FICTIONAL document — no real personal data.
5. Post X demo himself (@NEARProtocol + #NEARHackathon, video), confirm exact submission payload before submit.
   Submission form: `website` field stays EMPTY (spam trap).

## Build phases
- Phase 1 (now): static page — paste/sample → TEE redact → hashes → verify panel → seal payload preview.
- Phase 2: tiny near-sdk-js seal(hash, chatId) contract on testnet (GitHub Codespaces) + wallet connect.
- Phase 3: README (do X → see Y), 90s video, X post, submission.
