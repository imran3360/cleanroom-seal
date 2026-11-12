# Seal contract — deploy plan (Phase 2, runs in GitHub Codespaces)

Why Codespaces: Imran is on Windows; near-sdk-js needs Node + near-cli.
Codespaces gives a Linux box in the browser — nothing to install locally.

## Steps (Milo drives, Imran approves wallet actions)
1. Create the public GitHub repo `cleanroom-seal` and push this project.
2. Open the repo in GitHub Codespaces.
3. In Codespaces terminal:
   - `npm init -y && npm install near-sdk-js near-cli` (versions pinned at build time)
   - Put `seal-contract.js` as the contract source in the template layout
     (`src/contract.ts` style layout per the near-sdk-js quickstart), build → `build/contract.wasm`.
     NOTE: near-sdk-js uses decorators — follow the official template
     (https://github.com/near/create-near-app or near-sdk-js examples) exactly;
     if the template layout differs, adapt imports, do not hand-roll the build.
4. Testnet account via CLI faucet (no separate testnet wallet UI needed):
   `near account create-account sponsor-by-faucet-service <name>.testnet autogenerate-key-pair`
   (near-cli-rs; faucet funds it free). Credentials stay in Codespaces —
   testnet demo account only. Record the account id in README once created.
   (Fallback if faucet route fails: create at testnet.mynearwallet.com.)
5. Deploy to a subaccount: `seal.<imran>.testnet`
   `near deploy seal.<imran>.testnet build/contract.wasm`
6. Smoke test from CLI:
   - `near call seal.<imran>.testnet seal '{"doc_hash":"<64hex>","redacted_hash":"<64hex>","completion_id":"demo","model":"z-ai/glm-5.3-flash"}' --accountId <imran>.testnet`
   - `near view seal.<imran>.testnet seal_count`
   - `near view seal.<imran>.testnet get_seal_by_doc_hash '{"doc_hash":"<64hex>"}'`
7. Wire the page: add NEAR wallet connect (testnet, MyNearWallet via
   @near-wallet-selector or a simple redirect-sign flow) and make Step 4 call
   `seal()` with the payload; show the NearBlocks testnet tx link.
8. Verify on NearBlocks testnet: contract methods list shows `seal`,
   `get_seals`, `seal_count`, `get_seal_by_doc_hash` — and NO method that
   returns or accepts document content.

## Hard rules
- Testnet only for the demo. Mainnet is only Imran's payout address.
- No keys/seeds in the repo, ever.
- If the contract is not deployed + callable by Hour ~38 of the plan,
  ship Phase 1 honestly without it (README already states this).
