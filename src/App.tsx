import { useMemo, useState } from "react";
import "./styles.css";
import { BRAND } from "./brand";

// Question schema: { id, topic, level, q, options[], answer (idx), explain }
// Topics: rpc-fundamentals, ankr-api-surface, multichain-evm-solana, scaling-rollups, staking-depin, pricing-plans
// Length parity 0.90–1.10 STRICT across options.

const BANK = [
  // ── BEGINNER (12) ──
  { id:"b1", topic:"ankr-api-surface", level:"beginner",
    q:"What is Ankr primarily known for in the web3 infrastructure market?",
    options:[
      "Multi-chain RPC, Advanced API, Scaling, and Staking services",
      "An EVM Layer 2 rollup chain optimized for low gas transaction fees",
      "A self-custody mobile wallet aimed at retail crypto traders only",
      "A smart-contract security audit and verification firm only",
    ],
    answer:0,
    explain:"Ankr markets itself as a Web3 infrastructure platform anchored by Web3 API (RPC), Advanced API, Scaling Services, and Staking Solutions, all powered by a global DePIN node network." },
  { id:"b2", topic:"multichain-evm-solana", level:"beginner",
    q:"How many blockchains does Ankr publicly advertise support for?",
    options:[
      "Around 70+ chains across Public, Freemium, and Premium plans",
      "Only Ethereum mainnet and a few testnets, no other chains supported",
      "Solana exclusively, with no EVM-compatible chain integrations at all",
      "Bitcoin and Litecoin only, with no support for any smart contracts",
    ],
    answer:0,
    explain:"Ankr advertises 70+ blockchains. Public lists 40+, Freemium 65+, and Premium 80+ chains with full and archive access on tiers." },
  { id:"b3", topic:"rpc-fundamentals", level:"beginner",
    q:"What does an RPC endpoint do, in plain product terms?",
    options:[
      "It is a URL your application calls to read or write blockchain state",
      "It is a mnemonic phrase used to unlock and recover a crypto wallet",
      "It is a smart-contract interface for token transfer methods only",
      "It is a consensus protocol used by validators to finalize blocks",
    ],
    answer:0,
    explain:"An RPC (remote procedure call) endpoint is the URL that an application uses to query chain state or submit transactions. Ankr's Web3 API is one such endpoint." },
  { id:"b4", topic:"ankr-api-surface", level:"beginner",
    q:"What problem does Ankr's Advanced API solve for a typical web3 frontend?",
    options:[
      "It returns indexed token, NFT, and transaction data with one REST call",
      "It produces verifiable zero-knowledge proofs for blockchain privacy",
      "It compiles Solidity smart contracts into deployable EVM bytecode",
      "It runs validator software that proposes and finalizes new blocks",
    ],
    answer:0,
    explain:"Advanced API consolidates portfolio, NFT, transaction history, and contract event data into REST endpoints, replacing dozens of raw RPC calls per query." },
  { id:"b5", topic:"staking-depin", level:"beginner",
    q:"What is ankrETH in Ankr's staking ecosystem?",
    options:[
      "A liquid staking token that represents staked ETH plus accrued rewards",
      "A new chain-level fee market that fully replaces EIP-1559 fee logic",
      "An on-chain governance scheme used by major DAO protocols today",
      "A consensus-layer upgrade that switches Ethereum to proof of stake",
    ],
    answer:0,
    explain:"ankrETH is Ankr's liquid staking derivative for Ethereum. Holders can use it across DeFi while their underlying ETH continues to earn staking rewards." },
  { id:"b6", topic:"ankr-api-surface", level:"beginner",
    q:"Why might a team reach for Ankr's Token API instead of raw RPC calls?",
    options:[
      "It returns balances, metadata, and prices from one consolidated request",
      "It guarantees a fixed lower gas fee for any minting transaction call",
      "It runs a built-in royalty enforcement engine across all marketplaces",
      "It performs visual similarity search on NFT artwork at query time",
    ],
    answer:0,
    explain:"Token API consolidates balances, token metadata, and transfer history, replacing the dozens of eth_call and balanceOf fetches a portfolio app would otherwise need." },
  { id:"b7", topic:"rpc-fundamentals", level:"beginner",
    q:"What does WebSocket support add to an RPC service like Ankr's?",
    options:[
      "Subscriptions that push events when watched data changes on chain",
      "A signed cryptographic attestation about a wallet's complete history",
      "A daily emailed summary for wallets, with no real-time event triggers",
      "An on-chain message that updates contract storage on every transfer",
    ],
    answer:0,
    explain:"Ankr's WSS endpoints support eth_subscribe (and Solana subscription methods) so apps receive pushed events instead of polling, which lowers credit consumption." },
  { id:"b8", topic:"pricing-plans", level:"beginner",
    q:"What is an API Credit in Ankr's pricing model?",
    options:[
      "A weighted unit of cost assigned to each method based on its work",
      "A fixed flat fee charged for every individual API call uniformly",
      "A staking-related token that secures Ankr's infrastructure layer",
      "A short-lived API session token issued to authenticate each request",
    ],
    answer:0,
    explain:"Different RPC methods do different amounts of node work, so Ankr bills in API Credits. For example, Solana methods cost 500 credits and Beacon chain 700 credits each." },
  { id:"b9", topic:"pricing-plans", level:"beginner",
    q:"What does Ankr's Freemium plan include, per their published pricing?",
    options:[
      "200M API credits per month at no cost with public-tier rate limits",
      "Unlimited request volume across every chain Ankr currently supports",
      "A perpetual free Enterprise plan with custom SLAs included always",
      "100 free requests per second across every supported chain at once",
    ],
    answer:0,
    explain:"Ankr publishes Freemium as 200M API credits/month at no charge with Public-tier rate limits. Above that or for private endpoints, users move to Premium." },
  { id:"b10", topic:"rpc-fundamentals", level:"beginner",
    q:"What is 'polling' in the context of building against an RPC endpoint?",
    options:[
      "Calling the same method on a timer to detect new chain state",
      "Subscribing once and receiving server-pushed events on each block",
      "Running validator software to propose blocks for consensus rewards",
      "Submitting a signed write transaction that mutates contract storage",
    ],
    answer:0,
    explain:"Polling repeatedly hits a read method (like eth_getLogs) to check for changes. WebSocket subscriptions and Advanced API are the push and consolidated alternatives." },
  { id:"b11", topic:"scaling-rollups", level:"beginner",
    q:"What is a rollup in modern Ethereum scaling architecture?",
    options:[
      "A Layer 2 chain that batches transactions and posts them to Ethereum",
      "A consensus protocol used by validators to finalize blocks on mainnet",
      "A staking mechanism for delegating ETH to professional node operators",
      "A specific kind of mempool that orders transactions by gas price only",
    ],
    answer:0,
    explain:"A rollup is a Layer 2 that executes transactions off mainnet and posts compressed data and proofs back to Ethereum. Ankr's Scaling Services help teams deploy them." },
  { id:"b12", topic:"staking-depin", level:"beginner",
    q:"What is a DePIN, in the context of Ankr's infrastructure marketing?",
    options:[
      "A decentralized network of bare-metal nodes serving RPC requests globally",
      "A protocol for issuing privacy-preserving credentials on the blockchain",
      "A type of derivative used to hedge against staking reward volatility",
      "A staking pool where participants earn yield on their idle ETH balances",
    ],
    answer:0,
    explain:"DePIN means Decentralized Physical Infrastructure Network. Ankr's DePIN spans 30+ regions and serves 8B daily RPC requests across 760k unique geo locations." },

  // ── INTERMEDIATE (12) ──
  { id:"i1", topic:"ankr-api-surface", level:"intermediate",
    q:"Which Ankr Advanced API endpoint group covers indexed token balances and NFT data?",
    options:[
      "Token API, NFT API, Query API, and Earnings API endpoint groups",
      "A single REST namespace called Bridge API for cross-chain data",
      "A unified GraphQL endpoint identical to The Graph hosted service",
      "Only legacy raw eth_call methods routed through a different host",
    ],
    answer:0,
    explain:"Ankr Advanced API is split into Token API, NFT API, Query API (events and contract calls), and Earnings API (staking/yield), each consolidating dozens of raw RPC calls." },
  { id:"i2", topic:"multichain-evm-solana", level:"intermediate",
    q:"Why do Solana RPC methods carry a higher API credit cost than EVM reads?",
    options:[
      "Solana methods like getProgramAccounts return larger payloads and use more node work",
      "Solana validators charge a fixed surcharge that Ankr passes through to clients",
      "Solana mainnet uses proof of work, which makes every read more expensive to serve",
      "Solana never indexes historical state, so queries always hit cold disk pages",
    ],
    answer:0,
    explain:"Solana RPC methods (especially getProgramAccounts) often return very large account sets and use significant node work. Ankr's pricing reflects 500 credits per Solana method." },
  { id:"i3", topic:"scaling-rollups", level:"intermediate",
    q:"What does Ankr's Scaling Services product line typically include?",
    options:[
      "Rollup-as-a-service, sidechain creation, and end-to-end engineering for chains",
      "A staking dashboard that displays validator performance for major chains only",
      "Only a hosted block explorer for chains already deployed by other teams",
      "An auditing service for smart contracts deployed on Ethereum mainnet only",
    ],
    answer:0,
    explain:"Ankr Scaling Services covers Rollup-as-a-Service, sidechain and appchain creation, and engineering services. Polygon partnership powers 30B monthly RPC requests with this stack." },
  { id:"i4", topic:"ankr-api-surface", level:"intermediate",
    q:"What is the typical credit cost of an Ankr Advanced API REST call?",
    options:[
      "Around 700 credits per call, replacing many raw RPC requests in one query",
      "Always the same 30 credits, identical to a basic eth_call read request",
      "Charged per byte of response, with no per-call fixed credit pricing",
      "Free of credits because Advanced API is bundled at no cost in PAYG",
    ],
    answer:0,
    explain:"Advanced API REST calls cost roughly 700 credits each but typically replace 20 to 40 raw RPC calls per portfolio or NFT query, so the unit economics usually win." },
  { id:"i5", topic:"rpc-fundamentals", level:"intermediate",
    q:"What is archive node access, and why does it matter for trace and debug methods?",
    options:[
      "It retains full historical state needed for trace_block and debug_traceTransaction",
      "It is a separate consensus client used to bootstrap fresh validators on chains",
      "It is a billing add-on that lowers per-call credit cost across read methods only",
      "It is a backup system that only activates when the primary RPC node fails first",
    ],
    answer:0,
    explain:"Archive nodes retain full historical state. trace_block, debug_traceTransaction, and historical eth_call beyond ~128 blocks all require archive, which is why Ankr surfaces it as a tier feature." },
  { id:"i6", topic:"pricing-plans", level:"intermediate",
    q:"What are the published rate-limit tiers for Ankr Public versus Premium plans?",
    options:[
      "Public 30 req/sec versus Premium 1500 req/sec on dedicated endpoints",
      "Public 1000 req/sec versus Premium 100 req/sec by design choice always",
      "Both Public and Premium share an identical 100 req/sec ceiling at all times",
      "Public is unlimited and Premium imposes throttling above paid quota only",
    ],
    answer:0,
    explain:"Ankr Public is rate-limited to ~30 req/sec; Premium unlocks 1500 req/sec on private endpoints. Enterprise removes the ceiling with dedicated nodes." },
  { id:"i7", topic:"staking-depin", level:"intermediate",
    q:"Roughly how much TVL did Ankr report across its staking integrations in marketing copy?",
    options:[
      "$83M+ TVL across 9+ tokens with 18k+ users trusting the staking suite",
      "Over $10B TVL, the largest liquid staking protocol on the entire market",
      "Under $1M TVL because staking is a recently launched experiment for Ankr",
      "Exactly zero TVL because Ankr only operates infrastructure, not staking",
    ],
    answer:0,
    explain:"Ankr's homepage advertises $83M+ TVL across 9+ tokens (ankrETH, ankrBNB, ankrMATIC, ankrFTM, ankrXDC, etc.) and 18k+ users on its staking products." },
  { id:"i8", topic:"multichain-evm-solana", level:"intermediate",
    q:"What is the avg response time and uptime Ankr publishes for its Web3 API?",
    options:[
      "Around 56 ms average response time and 99.99% uptime in marketing claims",
      "Around 5000 ms average response time and 95% uptime on the public tier",
      "Sub-millisecond response time guaranteed across every supported region",
      "Zero downtime ever recorded, with no published SLA on actual uptime data",
    ],
    answer:0,
    explain:"Ankr's homepage advertises 56ms avg response time and 99.99% uptime across its global DePIN, with 8B daily RPC requests served from 30+ regions." },
  { id:"i9", topic:"scaling-rollups", level:"intermediate",
    q:"Which large EVM chain has Ankr publicly partnered with for infrastructure services?",
    options:[
      "Polygon, where Ankr powers 30B monthly RPC requests and supports Supernets",
      "Solana, where Ankr operates the only validator set running mainnet currently",
      "Bitcoin, where Ankr secures all peg-in transactions for wrapped BTC tokens",
      "TON Network, where Ankr is the sole liquid staking partner for the chain",
    ],
    answer:0,
    explain:"Ankr's Polygon case study advertises 30B monthly RPC requests powered, 1M+ smart contracts enabled, and Supernets-style EVM chain creation as a service for Polygon." },
  { id:"i10", topic:"ankr-api-surface", level:"intermediate",
    q:"What does Ankr's Earnings API expose to integrators?",
    options:[
      "Yield, staking, and reward data across multiple chains via REST queries",
      "A retail trading platform with built-in spot, margin, and futures markets",
      "An on-chain ad network that pays publishers in ANKR token rewards only",
      "A simple email subscription that reports user portfolio gains every week",
    ],
    answer:0,
    explain:"Earnings API surfaces staking rewards, yield, and reward-related data across chains so apps can show users their accrued earnings without writing per-chain integrations." },
  { id:"i11", topic:"rpc-fundamentals", level:"intermediate",
    q:"Which RPC method tends to dominate eth_getLogs-heavy workloads' credit consumption?",
    options:[
      "eth_getLogs at 75 credits per call, often called in tight polling loops",
      "eth_blockNumber at 10 credits, since it runs constantly during initialization",
      "eth_chainId at 5 credits, since every request issues it for routing checks",
      "net_version at 1 credit, since clients call it on every page load action",
    ],
    answer:0,
    explain:"eth_getLogs is the workhorse of indexing-heavy apps and costs 75 credits per call on Ankr. WebSocket subscriptions and Advanced API getEvents typically replace dozens of getLogs calls." },
  { id:"i12", topic:"pricing-plans", level:"intermediate",
    q:"What is Premium Deal in Ankr's Service Plans, distinct from Premium PAYG?",
    options:[
      "An annual committed-spend contract with discount pricing versus per-credit PAYG",
      "A purely free plan that mirrors Freemium but with double the credit allocation",
      "A pay-by-the-block model that charges only when chain state changes occur",
      "An invitation-only beta plan reserved for validator operators on the network",
    ],
    answer:0,
    explain:"Premium Deal is Ankr's committed-spend annual contract, typically priced at a meaningful discount versus PAYG and unlocking the same 1500 req/sec, 55+ chains, and team features." },

  // ── EXPERT (12) ──
  { id:"e1", topic:"rpc-fundamentals", level:"expert",
    q:"In Ankr's pricing, why does Beacon chain access carry a different per-credit USD rate than Solana?",
    options:[
      "Beacon credits price at $0.00007 because consensus-layer reads cost more node work",
      "Beacon credits cost less than Solana because Beacon RPC traffic is lower volume",
      "Beacon credits are free because Ankr does not bill consensus-layer queries at all",
      "Beacon credits are billed in ANKR token, not USD, due to staking-layer contracts",
    ],
    answer:0,
    explain:"Ankr's published pricing shows Solana methods at $0.00005 per credit and Beacon at $0.00007 per credit. The Beacon delta reflects the additional node work for consensus-layer queries." },
  { id:"e2", topic:"ankr-api-surface", level:"expert",
    q:"Which feature differentiates Premium PAYG from Freemium in Ankr's published comparison?",
    options:[
      "Private endpoints, 1500 req/sec, multi-project stats, and team accounts on Premium",
      "Unlimited credit consumption with no overages, but only on Freemium tier strictly",
      "Identical features to Freemium except Premium adds a small monthly admin fee",
      "Premium downgrades to Public-tier rate limits during peak global traffic hours",
    ],
    answer:0,
    explain:"Premium unlocks private endpoints, 1500 req/sec, access to 55+ chains, 3 projects, multi-project statistics, and team accounts. Freemium gives 200M credits but stays at Public rate limits." },
  { id:"e3", topic:"scaling-rollups", level:"expert",
    q:"What architecture pattern does Ankr's Polygon Supernets-style appchain creation typically follow?",
    options:[
      "Dedicated EVM-compatible chain with custom validator set, anchored to a base chain",
      "A privacy mixer running entirely on a single Layer 2 with sealed transactions only",
      "A pure proof-of-work chain with no validator set and ASIC-mined block rewards only",
      "A purely off-chain database with no smart-contract execution layer of any kind",
    ],
    answer:0,
    explain:"Supernets-style appchains are dedicated EVM-compatible chains with a custom validator set and bridges to a base chain. Ankr provides end-to-end engineering for these deployments." },
  { id:"e4", topic:"multichain-evm-solana", level:"expert",
    q:"Which Solana RPC method typically drives the most credit consumption in poorly tuned apps?",
    options:[
      "getProgramAccounts when called without a dataSlice and without aggressive caching",
      "getRecentBlockhash because it returns very large historical block ranges always",
      "getSlot because it triggers a full validator set election on every API call made",
      "getHealth because Solana validators charge a fee for each health probe issued",
    ],
    answer:0,
    explain:"getProgramAccounts can return huge account sets and is the classic perf+cost footgun. Use dataSlice, filters, or pre-built indexers to avoid pulling whole program states each call." },
  { id:"e5", topic:"staking-depin", level:"expert",
    q:"What is the role of Ankr's DePIN in serving RPC requests at low latency globally?",
    options:[
      "Bare-metal nodes in 30+ regions ensure shortest round-trip path for users",
      "A central data center in one region routes every request to its closest peer",
      "Validators serve RPC traffic directly, doubling as both consensus and read nodes",
      "Users are required to run their own local nodes to read state on Ankr endpoints",
    ],
    answer:0,
    explain:"Ankr's DePIN is a global network of bare-metal nodes spanning 30+ regions and 760k unique geo locations served monthly. Routing finds the shortest RTT for every request." },
  { id:"e6", topic:"pricing-plans", level:"expert",
    q:"At what monthly volume does Premium Deal typically beat Premium PAYG in Ankr's pricing?",
    options:[
      "At committed spend high enough to justify a 10 to 25% annual contract discount",
      "At any volume above 1000 credits per month, regardless of overall workload size",
      "Never, because Premium PAYG always costs less than any committed-spend contract",
      "Only when running fewer than three chains, otherwise Deal pricing is unavailable",
    ],
    answer:0,
    explain:"Premium Deal earns back at high enough committed monthly spend to justify the annual lock-in in exchange for typically 10 to 25% discount versus PAYG, plus dedicated commercial support." },
  { id:"e7", topic:"rpc-fundamentals", level:"expert",
    q:"How should a high-throughput app handle Ankr's Premium 1500 req/sec ceiling cleanly?",
    options:[
      "Burst smoothing plus secondary provider failover, or upgrade to Enterprise dedicated",
      "Hard-loop retry without backoff, since Ankr never returns 429 throttling responses",
      "Cache every read locally for 24 hours, even mempool data and pending transactions",
      "Switch all writes to Public endpoints to avoid hitting any Premium rate limits",
    ],
    answer:0,
    explain:"At sustained traffic above 1500 req/sec, options are burst-smoothing with retry/backoff, multi-provider failover, or moving to Enterprise dedicated nodes that remove the ceiling." },
  { id:"e8", topic:"ankr-api-surface", level:"expert",
    q:"How does Ankr's Query API differ from raw eth_getLogs polling in indexing workloads?",
    options:[
      "Pre-indexed event queries via REST that replace many raw eth_getLogs request calls",
      "It is a renamed alias for eth_getLogs with identical semantics and identical pricing",
      "It only works on testnets and returns synthetic placeholder events for mainnet calls",
      "It requires running an in-house Graph Node before any of its endpoints can be used",
    ],
    answer:0,
    explain:"Query API exposes pre-indexed events and contract interactions through REST, replacing dozens of raw eth_getLogs calls per query and removing the polling-loop footprint." },
  { id:"e9", topic:"scaling-rollups", level:"expert",
    q:"What is the operational tradeoff between deploying on Polygon CDK versus Ankr's Rollup-as-a-Service?",
    options:[
      "CDK is Polygon-aligned tech; Ankr RaaS adds engineering and node-ops as a service",
      "Both are fully equivalent in scope and pricing across every operational dimension always",
      "CDK requires a custom validator client; Ankr RaaS requires no infrastructure work at all",
      "Polygon CDK supports only Bitcoin, while Ankr RaaS only supports Cosmos appchains today",
    ],
    answer:0,
    explain:"Polygon CDK is the Polygon-aligned framework. Ankr RaaS layers engineering services and bare-metal node operations on top, removing the operational burden of running the chain itself." },
  { id:"e10", topic:"multichain-evm-solana", level:"expert",
    q:"Why is region-aware routing especially valuable for high-throughput Solana applications?",
    options:[
      "Solana's short slot time amplifies RTT impact on transaction landing latency",
      "Solana validators rotate across regions every block, requiring dynamic routing",
      "Solana has no concept of mempool, so RPC nodes must be in the same data center",
      "Solana bills users for region distance directly, which Ankr passes through as fees",
    ],
    answer:0,
    explain:"Solana's slot time (~400ms) means an extra 100ms of RTT can cost a slot's worth of opportunity. Ankr's 30+ region DePIN minimizes that path for time-sensitive trading and bot use cases." },
  { id:"e11", topic:"staking-depin", level:"expert",
    q:"What is the integration flow for adding ankrETH liquidity to a DeFi protocol?",
    options:[
      "Use ankrETH ERC-20 like any LST, with reward accrual via the rebasing exchange rate",
      "Run a custom validator client and stake bare ETH, bypassing Ankr's contract layer",
      "Buy ANKR token, lock it for 12 months, then mint synthetic ankrETH at expiration",
      "Deploy a wrapped Ethereum contract that mints ankrETH on every wrap transaction",
    ],
    answer:0,
    explain:"ankrETH is an ERC-20 LST. Integrators treat it like any token; rewards accrue through the increasing redemption rate against ETH, no custom validator infrastructure required." },
  { id:"e12", topic:"pricing-plans", level:"expert",
    q:"How does Ankr's Enterprise plan differ from Premium Deal at the architectural level?",
    options:[
      "Dedicated nodes, custom SLAs, reserved throughput, and 80+ chain coverage on Enterprise",
      "Enterprise costs less than Freemium and is the right tier for hobby projects to use",
      "Premium Deal is the only tier that supports private endpoints; Enterprise reverts public",
      "Enterprise is identical to Premium Deal in every way except the marketing label used",
    ],
    answer:0,
    explain:"Enterprise gives dedicated nodes (not shared multi-tenant), custom SLAs, reserved throughput beyond the 1500 req/sec Premium ceiling, and access to 80+ chains. Premium Deal stays multi-tenant." },
];

const TOPIC_LABEL: Record<string, string> = {
  "rpc-fundamentals": "RPC fundamentals",
  "ankr-api-surface": "Ankr API surface",
  "multichain-evm-solana": "Multi-chain (EVM and Solana)",
  "scaling-rollups": "Scaling and Rollups",
  "staking-depin": "Staking and DePIN",
  "pricing-plans": "Pricing and Service Plans",
};

function shuffle<T>(a: T[]): T[] { const x = [...a]; for (let i = x.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [x[i],x[j]]=[x[j],x[i]]; } return x; }
function sample<T>(a: T[], n: number): T[] { return shuffle(a).slice(0, n); }

function shuffleQuestions(questions: any[]) {
  const positionCounts = [0, 0, 0, 0];
  const recentPositions: number[] = [];
  return questions.map((q) => {
    const correctText = q.options[q.answer];
    const wrongTexts = q.options
      .filter((_: any, i: number) => i !== q.answer)
      .sort(() => Math.random() - 0.5);
    const blocked = recentPositions.slice(-2);
    const candidates = [0, 1, 2, 3]
      .filter((p) => !blocked.includes(p))
      .sort((a, b) => positionCounts[a] - positionCounts[b] || Math.random() - 0.5);
    const targetPos = candidates.length > 0
      ? candidates[0]
      : [0, 1, 2, 3].sort((a, b) => positionCounts[a] - positionCounts[b] || Math.random() - 0.5)[0];
    positionCounts[targetPos]++;
    recentPositions.push(targetPos);
    const newOptions = [...wrongTexts];
    newOptions.splice(targetPos, 0, correctText);
    return { ...q, options: newOptions, answer: targetPos };
  });
}

function pickQuestions(level: string, n: number) {
  if (level === "mixed") {
    const b = BANK.filter(q => q.level === "beginner");
    const i = BANK.filter(q => q.level === "intermediate");
    const e = BANK.filter(q => q.level === "expert");
    const each = Math.ceil(n / 3);
    return shuffleQuestions(shuffle([...sample(b, each), ...sample(i, each), ...sample(e, n - 2*each)]).slice(0, n));
  }
  const pool = BANK.filter(q => q.level === level);
  return shuffleQuestions(sample(pool, Math.min(n, pool.length)));
}

function App() {
  const [length, setLength] = useState<number>(10);
  const [level, setLevel] = useState<string>("beginner");
  const [stage, setStage] = useState<"setup"|"run"|"done">("setup");
  const [qs, setQs] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, number>>({});
  const [toast, setToast] = useState(false);

  const start = () => {
    const lvl = length === 30 ? (level === "expert" ? "expert" : "mixed") : level;
    const set = pickQuestions(lvl, length);
    setQs(set); setIdx(0); setPicks({}); setRevealed({}); setStage("run");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const choose = (qid: string, ci: number) => {
    if (revealed[qid] !== undefined) return;
    setPicks(p => ({ ...p, [qid]: ci }));
    setRevealed(r => ({ ...r, [qid]: ci }));
  };
  const next = () => {
    if (idx + 1 < qs.length) setIdx(idx + 1); else setStage("done");
  };

  const correctCount = useMemo(() => qs.reduce((acc,q)=> acc + (picks[q.id] === q.answer ? 1 : 0), 0), [qs, picks]);

  const topicBreakdown = useMemo(() => {
    const m: Record<string, { correct: number; total: number }> = {};
    for (const q of qs) {
      const t = q.topic;
      if (!m[t]) m[t] = { correct: 0, total: 0 };
      m[t].total++;
      if (picks[q.id] === q.answer) m[t].correct++;
    }
    return m;
  }, [qs, picks]);

  const summary = useMemo(() => {
    const lines: string[] = [];
    lines.push("Ankr & Web3 Infrastructure Trivia");
    lines.push(`Length: ${qs.length}, Level: ${length === 30 && level !== "expert" ? "mixed" : level}`);
    lines.push(`Score: ${correctCount} / ${qs.length}`);
    lines.push("");
    lines.push("Topic breakdown:");
    Object.entries(topicBreakdown).forEach(([t, v]) => {
      lines.push(`  • ${TOPIC_LABEL[t] || t}: ${v.correct}/${v.total}`);
    });
    return lines.join("\n");
  }, [qs.length, correctCount, topicBreakdown, level, length]);

  const onCopy = async () => {
    try { await navigator.clipboard.writeText(summary); setToast(true); setTimeout(()=>setToast(false), 1600); }
    catch { const ta=document.createElement("textarea"); ta.value=summary; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); setToast(true); setTimeout(()=>setToast(false),1600); }
  };

  const restart = () => { setStage("setup"); setQs([]); setIdx(0); setPicks({}); setRevealed({}); window.scrollTo({top:0, behavior:"smooth"}); };

  const Pills = ({ value, set, options }: { value: any; set: (v: any) => void; options: { value: any; label: string }[] }) => (
    <div className="pillgroup">
      {options.map(o => (
        <button key={String(o.value)} className={"pill " + (value === o.value ? "active" : "")} onClick={() => set(o.value)} type="button">{o.label}</button>
      ))}
    </div>
  );

  if (stage === "setup") {
    return (
      <div className="wrap">
        <header className="brand-bar">
          <a
            href={BRAND.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-logo"
            aria-label={BRAND.company}
          >
            <span dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }} />
          </a>
          <span className="brand-chip">Independent quiz</span>
        </header>
        <div className="eyebrow">A quiz · DevRel, sales enablement, partner education</div>
        <h1>Ankr & Web3 Infrastructure Trivia</h1>
        <p className="lede">A short, polite test of how well you know Ankr's product surface (Web3 API on 70+ chains, Advanced API for Token/NFT/Query/Earnings, Scaling Services, Staking Solutions, DePIN node network) and the broader web3 infrastructure concepts they sit on. Drawn from Ankr's public docs and pricing page.</p>

        <div className="card">
          <label>Length</label>
          <Pills value={length} set={setLength} options={[{value:10,label:"10 questions"},{value:20,label:"20 questions"},{value:30,label:"30 questions"}]} />
          <div style={{ height: 14 }} />
          <label>Difficulty</label>
          <Pills value={level} set={setLevel} options={[{value:"beginner",label:"Beginner"},{value:"intermediate",label:"Intermediate"},{value:"expert",label:"Expert"}]} />
          <div style={{ marginTop: 14 }}>
            <button className="btn" onClick={start}>Start quiz</button>
          </div>
        </div>

        <div className="footer-note">
          Ankr-specific detail comes directly from Ankr's public documentation (Web3 API, Advanced API, Scaling Services, Staking Solutions, DePIN, Service Plans, API Credit pricing). Broader questions cover RPC fundamentals, EVM/Solana, rollups, and standard web3 infra concepts. No data is collected.
        </div>
        <footer className="attribution">{BRAND.attribution}</footer>
      </div>
    );
  }

  if (stage === "run") {
    const q = qs[idx];
    const chosen = picks[q.id];
    const reveal = revealed[q.id] !== undefined;
    return (
      <div className="wrap">
        <header className="brand-bar">
          <a
            href={BRAND.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-logo"
            aria-label={BRAND.company}
          >
            <span dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }} />
          </a>
          <span className="brand-chip">Independent quiz</span>
        </header>
        <div className="progress"><div style={{ width: `${((idx)/qs.length)*100}%` }} /></div>
        <div className="eyebrow">Question {idx+1} of {qs.length} · {TOPIC_LABEL[q.topic] || q.topic} · {q.level}</div>
        <div className="card qcard">
          <h2 style={{ fontSize: 18, lineHeight: 1.4, marginBottom: 14 }}>{q.q}</h2>
          {q.options.map((opt: string, i: number) => {
            let cls = "opt";
            if (reveal) {
              if (i === q.answer) cls += " correct";
              else if (i === chosen) cls += " wrong";
            } else if (i === chosen) cls += " picked";
            return <button key={i} className={cls} onClick={() => choose(q.id, i)}>{String.fromCharCode(65+i)}. {opt}</button>;
          })}
          {reveal && <div className="explain"><strong>{chosen === q.answer ? "Correct." : "Not quite."}</strong> {q.explain}</div>}
          {reveal && <div style={{ marginTop: 14 }}><button className="btn" onClick={next}>{idx + 1 < qs.length ? "Next question" : "See results"}</button></div>}
        </div>
        <div style={{ display:"flex", gap: 10 }}>
          <button className="btn secondary" onClick={restart}>Restart</button>
        </div>
        <footer className="attribution">{BRAND.attribution}</footer>
      </div>
    );
  }

  // done
  const pct = Math.round((correctCount / qs.length) * 100);
  const headline =
    pct >= 90 ? "Genuinely sharp on Ankr and modern web3 infra." :
    pct >= 70 ? "Solid working understanding of Ankr's surface." :
    pct >= 50 ? "Reasonable grasp. Some good rabbit holes ahead." :
    "Plenty of room to learn. Ankr's docs are a good next stop.";

  const topicsSorted = Object.entries(topicBreakdown).map(([t, v]) => ({ t, ...v, pct: v.correct / v.total }));
  topicsSorted.sort((a,b) => b.pct - a.pct);
  const strong = topicsSorted.slice(0, 2).filter(x => x.pct >= 0.5).map(x => TOPIC_LABEL[x.t] || x.t);
  const weak = topicsSorted.slice(-2).filter(x => x.pct < 0.7).map(x => TOPIC_LABEL[x.t] || x.t);

  return (
    <div className="wrap">
      <header className="brand-bar">
        <a
          href={BRAND.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-logo"
          aria-label={BRAND.company}
        >
          <span dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }} />
        </a>
        <span className="brand-chip">Independent quiz</span>
      </header>
      <div className="eyebrow">Results</div>
      <h1>{correctCount} / {qs.length} correct · {pct}%</h1>
      <p className="lede">{headline}</p>

      <div className="card">
        <h2>Topic breakdown</h2>
        {Object.entries(topicBreakdown).map(([t, v]) => (
          <div className="topic-row" key={t}>
            <span style={{ color: "var(--muted)" }}>{TOPIC_LABEL[t] || t}</span>
            <span style={{ color: "var(--text)", fontVariantNumeric: "tabular-nums" }}>{v.correct}/{v.total}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>What you understand well</h2>
        <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>
          {strong.length ? strong.join(" · ") : "Nothing dominant yet. Try a longer quiz at a higher level."}
        </div>
      </div>

      <div className="card">
        <h2>What's worth learning next</h2>
        <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>
          {weak.length ? weak.join(" · ") : "All topics roughly even. The expert tier will pressure-test the edges."}
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={onCopy}>Copy results</button>
          <button className="btn secondary" onClick={restart}>Take another quiz</button>
        </div>
      </div>

      <div className="footer-note">Ankr-specific detail is sourced from Ankr's public documentation, blog, brand guidelines, and pricing page. Broader web3 infra questions cover RPC, EVM/Solana, rollups, and standard concepts. Independent tool, not affiliated with Ankr.</div>

      <div className={"toast " + (toast ? "show" : "")}>Results copied to clipboard</div>
      <footer className="attribution">{BRAND.attribution}</footer>
    </div>
  );
}

export default App;
