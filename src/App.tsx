import { useMemo, useState } from "react";
import "./styles.css";
import { BRAND } from "./brand";

// Question schema: { id, topic, level, q, options[], answer (idx), explain }
// Topics: rpc-fundamentals, ankr-api-surface, multichain-evm-solana, scaling-rollups, staking-depin, pricing-plans
// Length parity 0.90–1.10 STRICT across options.

const BANK = [
  // ── BEGINNER (12): 5 fun fact + 5 product line + 2 industry ──
  { id:"b1", topic:"company-fun-facts", level:"beginner",
    q:"What year was Ankr founded?",
    options:[
      "2017, by college roommates from UC Berkeley campus",
      "2009, in the original Bitcoin whitepaper era of crypto",
      "2014, alongside the launch of the Ethereum mainnet phase",
      "2020, during the DeFi summer of yield farming season",
    ],
    answer:0,
    explain:"Ankr was founded in 2017 by Chandler Song, Ryan Fang, and Stanley Wu. Song and Fang were roommates at UC Berkeley. Source: CoinSpeaker founder bio." },
  { id:"b2", topic:"company-fun-facts", level:"beginner",
    q:"Who are the founding co-founders of Ankr?",
    options:[
      "Chandler Song, Ryan Fang, and Stanley Wu started Ankr",
      "Vitalik Buterin and Gavin Wood teamed up to start Ankr",
      "Brian Armstrong and Fred Ehrsam launched Ankr together",
      "Changpeng Zhao and He Yi founded Ankr in Shanghai labs",
    ],
    answer:0,
    explain:"Per Ankr leadership profiles: Chandler Song is CEO, Ryan Fang is COO, and Stanley Wu (ex-Amazon engineer) is CTO. Song and Fang met at UC Berkeley." },
  { id:"b3", topic:"company-fun-facts", level:"beginner",
    q:"Which university did the Ankr co-founders attend together?",
    options:[
      "UC Berkeley, where Song and Fang were college roommates",
      "MIT in Cambridge, where many crypto founders also studied",
      "Stanford University, the typical Silicon Valley pipeline route",
      "Tsinghua University in Beijing, well known for engineering",
    ],
    answer:0,
    explain:"Chandler Song studied EECS/IEOR at UC Berkeley; Ryan Fang attended Berkeley's business school. They were roommates and started Ankr together in 2017." },
  { id:"b4", topic:"company-fun-facts", level:"beginner",
    q:"In which city is Ankr's headquarters historically based?",
    options:[
      "San Francisco, California, on Howard Street downtown",
      "Singapore in the central business district near Raffles",
      "Zug, Switzerland, the well known crypto valley region",
      "New York City, in the Manhattan financial district zone",
    ],
    answer:0,
    explain:"Ankr's listed address is 589 Howard St, Suite 100, San Francisco, CA 94105. The team is now globally distributed, but SF remains the registered HQ." },
  { id:"b5", topic:"company-fun-facts", level:"beginner",
    q:"What is Ankr's primary brand color, per its public brand kit?",
    options:[
      "Ankr Blue, a vivid blue tone with hex value of #356DF3",
      "Solana Purple, a violet shade often used in Solana branding",
      "Bitcoin Orange, the iconic orange hue from the Bitcoin logo",
      "Ethereum Grey, the muted neutral grey used on ETH brand kit",
    ],
    answer:0,
    explain:"Ankr's public brand assets page lists Primary Ankr Blue at hex #356DF3, paired with Ankr Black #1F2226. Source: ankr.com/assets." },
  { id:"b6", topic:"company-products", level:"beginner",
    q:"What is Ankr primarily known for in the Web3 infrastructure market?",
    options:[
      "Multi-chain RPC, Advanced API, Scaling, and Staking services",
      "An EVM Layer 2 rollup chain optimized for low gas transaction fees",
      "A self-custody mobile wallet aimed at retail crypto traders only",
      "A smart contract security audit and verification firm only today",
    ],
    answer:0,
    explain:"Ankr markets itself as a Web3 infrastructure platform anchored by Web3 API (RPC), Advanced API, Scaling Services, and Staking Solutions, all on a global DePIN network." },
  { id:"b7", topic:"company-products", level:"beginner",
    q:"How many blockchains does Ankr publicly advertise support for?",
    options:[
      "Roughly 70+ chains across Public, Freemium, and Premium pricing",
      "Only Ethereum mainnet and a few testnets, no other chains supported",
      "Solana exclusively, with no EVM compatible chain integrations at all",
      "Bitcoin and Litecoin only, no support for any kind of smart contracts",
    ],
    answer:0,
    explain:"Ankr advertises 70+ blockchains. Public lists 40+, Freemium 65+, and Premium 80+ chains with full and archive access on tiers." },
  { id:"b8", topic:"company-products", level:"beginner",
    q:"What is ankrETH in Ankr's staking ecosystem?",
    options:[
      "A liquid staking token that represents staked ETH plus accrued rewards",
      "A new chain level fee market that fully replaces EIP-1559 fee logic",
      "An on chain governance scheme used by major DAO protocols of today",
      "A consensus layer upgrade that switches Ethereum to proof of stake",
    ],
    answer:0,
    explain:"ankrETH is Ankr's liquid staking derivative for Ethereum. Holders can use it across DeFi while their underlying ETH continues to earn staking rewards." },
  { id:"b9", topic:"company-products", level:"beginner",
    q:"What is an API Credit in Ankr's pricing model?",
    options:[
      "A weighted unit of cost assigned to each method based on its work",
      "A fixed flat fee charged for every individual API call uniformly",
      "A staking related token that secures Ankr's infrastructure layer",
      "A short lived API session token issued to authenticate every request",
    ],
    answer:0,
    explain:"Different RPC methods do different amounts of node work, so Ankr bills in API Credits. Solana methods cost 500 credits and Beacon chain 700 credits each." },
  { id:"b10", topic:"company-products", level:"beginner",
    q:"What does Ankr's Freemium plan include, per published pricing?",
    options:[
      "200M API credits per month at no cost with public-tier rate limits",
      "Unlimited request volume across every chain Ankr currently supports",
      "A perpetual free Enterprise plan with custom SLAs included always",
      "100 free requests per second across every supported chain at once",
    ],
    answer:0,
    explain:"Ankr publishes Freemium as 200M API credits/month at no charge with Public-tier rate limits. Above that or for private endpoints, users move to Premium." },
  { id:"b11", topic:"industry", level:"beginner",
    q:"What does an RPC endpoint do, in plain product terms?",
    options:[
      "It is a URL your application calls to read or write blockchain state",
      "It is a mnemonic phrase used to unlock and recover a crypto wallet",
      "It is a smart contract interface for token transfer methods only",
      "It is a consensus protocol used by validators to finalize new blocks",
    ],
    answer:0,
    explain:"An RPC (remote procedure call) endpoint is the URL an application uses to query chain state or submit transactions. Ankr's Web3 API is one such endpoint." },
  { id:"b12", topic:"industry", level:"beginner",
    q:"What is a rollup in modern Ethereum scaling architecture?",
    options:[
      "A Layer 2 chain that batches transactions and posts them to Ethereum",
      "A consensus protocol used by validators to finalize blocks on mainnet",
      "A staking mechanism for delegating ETH to professional node operators",
      "A specific kind of mempool that orders transactions by gas price only",
    ],
    answer:0,
    explain:"A rollup is a Layer 2 that executes transactions off mainnet and posts compressed data and proofs back to Ethereum. Ankr's Scaling Services help teams deploy them." },

  // ── INTERMEDIATE (12): 5 fun fact + 5 product line + 2 industry ──
  { id:"i1", topic:"company-fun-facts", level:"intermediate",
    q:"What token standard does the ANKR governance token use?",
    options:[
      "ERC-20, with the ANKR token also bridged to other chains today",
      "ERC-721, since ANKR is technically a non fungible token series",
      "BRC-20, an inscription standard layered on top of Bitcoin only",
      "SPL native, since ANKR launched first as a Solana program token",
    ],
    answer:0,
    explain:"ANKR is an ERC-20 token that powers payments, governance, and network insurance on the Ankr platform. It is bridged to multiple chains for multi-chain use." },
  { id:"i2", topic:"company-fun-facts", level:"intermediate",
    q:"What is the maximum supply of the ANKR token?",
    options:[
      "Ten billion ANKR tokens, the published max supply on CMC today",
      "Twenty one million tokens, mirroring the supply of Bitcoin exactly",
      "One hundred million ANKR tokens, similar to many ERC-20 launches",
      "An uncapped supply, since ANKR uses a perpetual inflation issuance",
    ],
    answer:0,
    explain:"Per CoinMarketCap, ANKR has a fixed total supply of 10,000,000,000 (10 billion) tokens. The token is used for service payments, governance, and insurance." },
  { id:"i3", topic:"company-fun-facts", level:"intermediate",
    q:"Which major cloud provider did Ankr partner with in February 2023?",
    options:[
      "Microsoft Azure, for enterprise level blockchain node hosting service",
      "Google Cloud Platform, for a joint validator hosting research project",
      "Amazon Web Services, for a flagship managed RPC node service launch",
      "Oracle Cloud, for a regional Latin America blockchain pilot in Brazil",
    ],
    answer:0,
    explain:"In February 2023 Ankr announced a partnership with Microsoft to deliver enterprise blockchain node services on Azure. Source: SiliconANGLE and Ankr blog." },
  { id:"i4", topic:"company-fun-facts", level:"intermediate",
    q:"Which Layer 2 ecosystem has Ankr publicly partnered with on Supernets?",
    options:[
      "Polygon, where Ankr is an official Supernets infrastructure partner",
      "Arbitrum, where Ankr operates the entire Nitro sequencer node alone",
      "Optimism, where Ankr is the only RPC provider for the OP Stack chain",
      "zkSync, where Ankr powers the only proving cluster for the L2 chain",
    ],
    answer:0,
    explain:"Ankr's Polygon case study lists Ankr as an official Polygon Supernets partner offering Sidechains-as-a-Service and end-to-end engineering for chain deployments." },
  { id:"i5", topic:"company-fun-facts", level:"intermediate",
    q:"Where did Ankr's CTO Stanley Wu work before co-founding Ankr?",
    options:[
      "Amazon, where he managed Chandler Song during an AWS internship",
      "Google, where he led the search ranking team in Mountain View site",
      "Coinbase, where he ran the institutional custody engineering group",
      "Goldman Sachs, where he ran the equity trading engineering division",
    ],
    answer:0,
    explain:"Per CoinSpeaker's founder story, Stanley Wu spent over a decade at Amazon and managed Chandler Song during an AWS internship before they co-founded Ankr in 2017." },
  { id:"i6", topic:"company-products", level:"intermediate",
    q:"Which Ankr Advanced API endpoint group covers indexed token and NFT data?",
    options:[
      "Token API, NFT API, Query API, and Earnings API endpoint groups",
      "A single REST namespace called Bridge API for cross chain data",
      "A unified GraphQL endpoint identical to The Graph hosted service",
      "Only legacy raw eth_call methods routed through a different host",
    ],
    answer:0,
    explain:"Ankr Advanced API is split into Token API, NFT API, Query API (events and contract calls), and Earnings API (staking/yield), each consolidating raw RPC calls." },
  { id:"i7", topic:"company-products", level:"intermediate",
    q:"How does Ankr's ankrBNB liquid staking token deliver rewards to holders?",
    options:[
      "Reward bearing: redemption ratio versus BNB grows daily over time",
      "Rebasing: token quantity goes up daily while the ratio stays at one",
      "Airdrops: ANKR tokens are sent monthly to every ankrBNB wallet held",
      "Manual claim: holders sign a claim transaction every staking epoch",
    ],
    answer:0,
    explain:"ankrBNB is a reward-bearing token. Quantity stays the same while the redemption ratio (e.g. 1 ankrBNB = 1.10 BNB) appreciates daily. Source: ankr.com/staking-crypto/binance-bnb." },
  { id:"i8", topic:"company-products", level:"intermediate",
    q:"What are the published rate limits for Ankr Public versus Premium plans?",
    options:[
      "Public 30 req/sec versus Premium 1500 req/sec on dedicated endpoints",
      "Public 1000 req/sec versus Premium 100 req/sec by design choice always",
      "Both Public and Premium share an identical 100 req/sec ceiling at all times",
      "Public is unlimited and Premium imposes throttling above paid quota only",
    ],
    answer:0,
    explain:"Ankr Public is rate-limited to ~30 req/sec; Premium unlocks 1500 req/sec on private endpoints. Enterprise removes the ceiling with dedicated nodes." },
  { id:"i9", topic:"company-products", level:"intermediate",
    q:"What does Ankr's Earnings API expose to integrators?",
    options:[
      "Yield, staking, and reward data across multiple chains via REST queries",
      "A retail trading platform with built in spot, margin, and futures markets",
      "An on chain ad network that pays publishers in ANKR token rewards only",
      "A simple email subscription that reports user portfolio gains every week",
    ],
    answer:0,
    explain:"Earnings API surfaces staking rewards, yield, and reward-related data across chains so apps can show users accrued earnings without writing per-chain integrations." },
  { id:"i10", topic:"company-products", level:"intermediate",
    q:"What avg response time and uptime does Ankr publish for its Web3 API?",
    options:[
      "Around 56 ms average response time and 99.99% uptime in marketing claims",
      "Around 5000 ms average response time and 95% uptime on the public tier",
      "Sub millisecond response time guaranteed across every supported region",
      "Zero downtime ever recorded, with no published SLA on actual uptime data",
    ],
    answer:0,
    explain:"Ankr's homepage advertises 56ms avg response time and 99.99% uptime across its global DePIN, with 8B daily RPC requests served from 30+ regions." },
  { id:"i11", topic:"industry", level:"intermediate",
    q:"What is archive node access, and why does it matter for trace methods?",
    options:[
      "It retains full historical state needed for trace_block and debug_traceTransaction",
      "It is a separate consensus client used to bootstrap fresh validators on new chains",
      "It is a billing add on that lowers per call credit cost across read methods only",
      "It is a backup system that only activates when the primary RPC node fails first",
    ],
    answer:0,
    explain:"Archive nodes retain full historical state. trace_block, debug_traceTransaction, and historical eth_call beyond ~128 blocks all require archive access on most clients." },
  { id:"i12", topic:"industry", level:"intermediate",
    q:"What does WebSocket support add to an RPC service compared to polling?",
    options:[
      "Subscriptions that push events when watched data changes on chain",
      "A signed cryptographic attestation about a wallet's complete history",
      "A daily emailed summary for wallets, with no real time event triggers",
      "An on chain message that updates contract storage on every transfer",
    ],
    answer:0,
    explain:"WSS endpoints support eth_subscribe (and Solana subscription methods) so apps receive pushed events instead of polling, which lowers credit consumption." },

  // ── EXPERT (12): 4 fun fact + 4 product line + 4 industry ──
  { id:"e1", topic:"company-fun-facts", level:"expert",
    q:"Which Ankr token was exploited in the high profile December 2022 incident?",
    options:[
      "aBNBc, the BNB liquid staking token, with quadrillions of new mints",
      "ankrETH, the ETH liquid staking token, drained via a flash loan attack",
      "ANKR itself, the governance token, via a compromised bridge contract",
      "ankrMATIC, the Polygon liquid staking token, on a faulty oracle feed",
    ],
    answer:0,
    explain:"In December 2022 the aBNBc token was exploited; Forbes reported about 6 quadrillion tokens minted and called the breach an inside job. Ankr published an after action report." },
  { id:"e2", topic:"company-fun-facts", level:"expert",
    q:"Which major exchange's investment arm joined an Ankr strategic round in 2022?",
    options:[
      "Binance Labs, which later rebranded as YZi Labs after a 2024 reorg",
      "Coinbase Ventures, in a notable Series A extension led by Coinbase",
      "Kraken Ventures, the new corporate venture arm of Kraken exchange",
      "OKX Ventures, in a public co-lead with the Bybit ecosystem fund",
    ],
    answer:0,
    explain:"Per public funding trackers, Binance Labs (now YZi Labs) led a strategic round in Ankr in 2022, around the period when ANKR listed on Binance. Source: dropstab and Binance Square." },
  { id:"e3", topic:"company-fun-facts", level:"expert",
    q:"Which crypto venture firm has invested in Ankr across multiple rounds?",
    options:[
      "Pantera Capital, listed across three separate Ankr funding rounds",
      "Andreessen Horowitz, which led the Ankr Series A and Series B rounds",
      "Sequoia Capital, the only Ankr backer across the entire seed cycle",
      "Paradigm, which was the sole institutional backer of the seed round",
    ],
    answer:0,
    explain:"Funding trackers (dropstab) list Pantera Capital as a backer across three Ankr rounds, alongside BlockVC, NGC Ventures, OKX, Danhua, and others from the 2018 placement." },
  { id:"e4", topic:"company-fun-facts", level:"expert",
    q:"What is Chandler Song's role at Ankr, per his public LinkedIn profile?",
    options:[
      "Co-Founder and CEO since November 2017, based in San Francisco",
      "Co-Founder and CTO since November 2017, leading core engineering",
      "Co-Founder and CFO, leading the finance and treasury function team",
      "Chief Marketing Officer, hired externally in 2019 to build the brand",
    ],
    answer:0,
    explain:"Chandler Song's LinkedIn lists him as Co-Founder of Ankr since November 2017. He is CEO; Ryan Fang is COO; Stanley Wu (ex-Amazon) is CTO." },
  { id:"e5", topic:"company-products", level:"expert",
    q:"Why does Beacon chain access carry a different per credit USD rate than Solana?",
    options:[
      "Beacon credits price at $0.00007 because consensus layer reads cost more node work",
      "Beacon credits cost less than Solana because Beacon RPC traffic is lower volume",
      "Beacon credits are free because Ankr does not bill consensus layer queries at all",
      "Beacon credits are billed in ANKR token, not USD, due to staking layer contracts",
    ],
    answer:0,
    explain:"Ankr's published pricing shows Solana methods at $0.00005 per credit and Beacon at $0.00007 per credit. The delta reflects extra node work for consensus-layer queries." },
  { id:"e6", topic:"company-products", level:"expert",
    q:"What is Premium Deal in Ankr's Service Plans, distinct from Premium PAYG?",
    options:[
      "An annual committed spend contract with discount pricing versus per credit PAYG",
      "A purely free plan that mirrors Freemium but with double the credit allocation",
      "A pay by the block model that charges only when chain state changes occur",
      "An invitation only beta plan reserved for validator operators on the network",
    ],
    answer:0,
    explain:"Premium Deal is Ankr's committed-spend annual contract, typically priced at a meaningful discount versus PAYG and unlocking 1500 req/sec, 55+ chains, and team features." },
  { id:"e7", topic:"company-products", level:"expert",
    q:"How does Ankr's Enterprise plan differ from Premium Deal at the architectural level?",
    options:[
      "Dedicated nodes, custom SLAs, reserved throughput, and 80+ chain coverage on Enterprise",
      "Enterprise costs less than Freemium and is the right tier for hobby projects to use",
      "Premium Deal is the only tier that supports private endpoints; Enterprise reverts public",
      "Enterprise is identical to Premium Deal in every way except the marketing label used",
    ],
    answer:0,
    explain:"Enterprise gives dedicated nodes (not shared multi-tenant), custom SLAs, reserved throughput beyond the 1500 req/sec Premium ceiling, and access to 80+ chains." },
  { id:"e8", topic:"company-products", level:"expert",
    q:"How does Ankr's Query API differ from raw eth_getLogs polling in indexing workloads?",
    options:[
      "Pre indexed event queries via REST that replace many raw eth_getLogs request calls",
      "It is a renamed alias for eth_getLogs with identical semantics and identical pricing",
      "It only works on testnets and returns synthetic placeholder events for mainnet calls",
      "It requires running an in house Graph Node before any of its endpoints can be used",
    ],
    answer:0,
    explain:"Query API exposes pre-indexed events and contract interactions through REST, replacing dozens of raw eth_getLogs calls per query and removing the polling-loop footprint." },
  { id:"e9", topic:"industry", level:"expert",
    q:"Which Solana RPC method typically drives the most credit consumption in poorly tuned apps?",
    options:[
      "getProgramAccounts when called without a dataSlice and without aggressive caching",
      "getRecentBlockhash because it returns very large historical block ranges always",
      "getSlot because it triggers a full validator set election on every API call made",
      "getHealth because Solana validators charge a fee for each health probe issued",
    ],
    answer:0,
    explain:"getProgramAccounts can return huge account sets and is the classic perf and cost footgun. Use dataSlice, filters, or pre-built indexers to avoid pulling whole program states." },
  { id:"e10", topic:"industry", level:"expert",
    q:"Which RPC method typically dominates eth_getLogs heavy workloads' credit consumption?",
    options:[
      "eth_getLogs at 75 credits per call, often called in tight polling loops",
      "eth_blockNumber at 10 credits, since it runs constantly during initialization",
      "eth_chainId at 5 credits, since every request issues it for routing checks",
      "net_version at 1 credit, since clients call it on every page load action",
    ],
    answer:0,
    explain:"eth_getLogs is the workhorse of indexing-heavy apps and costs 75 credits per call. WebSocket subscriptions and pre-indexed event APIs typically replace many getLogs calls." },
  { id:"e11", topic:"industry", level:"expert",
    q:"Why is region aware routing especially valuable for high throughput Solana applications?",
    options:[
      "Solana's short slot time amplifies RTT impact on transaction landing latency",
      "Solana validators rotate across regions every block, requiring dynamic routing",
      "Solana has no concept of mempool, so RPC nodes must be in the same data center",
      "Solana bills users for region distance directly, which Ankr passes through as fees",
    ],
    answer:0,
    explain:"Solana's slot time (~400ms) means an extra 100ms of RTT can cost a slot's worth of opportunity. A multi-region DePIN minimizes that path for time-sensitive trading and bots." },
  { id:"e12", topic:"industry", level:"expert",
    q:"How should a high throughput app handle hitting an RPC provider's rate limit cleanly?",
    options:[
      "Burst smoothing plus secondary provider failover, or upgrade to a dedicated tier",
      "Hard loop retry without any backoff, since providers never return 429 throttling",
      "Cache every read locally for 24 hours, even mempool data and pending transactions",
      "Switch all writes to Public endpoints to avoid hitting any Premium rate limits today",
    ],
    answer:0,
    explain:"At sustained traffic above the plan ceiling, options are burst-smoothing with retry/backoff, multi-provider failover, or moving to dedicated nodes that remove the ceiling." },
];

const TOPIC_LABEL: Record<string, string> = {
  "company-fun-facts": "Company fun facts",
  "company-products": "Company product line",
  "industry": "Industry and technical",
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
