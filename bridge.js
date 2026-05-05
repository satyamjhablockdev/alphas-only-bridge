// ─── Card 3D tilt (pointer devices only) ────────────────
document.addEventListener('DOMContentLoaded', () => {
  const card = document.getElementById('bridge-card');
  if (!card) return;

  // Skip tilt on touch devices — there's no cursor to track
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotX = -dy * 4;
    const rotY = dx * 4;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

// ─── State ───────────────────────────────────────────────
let walletAddress = null;
let provider = null;
let signer = null;
let fromChain = null;
let toChain = null;
let currentModalTarget = null;
let recipientOpen = false;
let txHistory = JSON.parse(localStorage.getItem('ao_history') || '[]');

// ABIs
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

const TOKEN_MESSENGER_ABI = [
  'function depositForBurn(uint256 amount, uint32 destinationDomain, bytes32 mintRecipient, address burnToken, bytes32 destinationCaller, uint256 maxFee, uint32 minFinalityThreshold) returns (uint64 nonce)',
];

const MSG_TRANSMITTER_ABI = [
  'function receiveMessage(bytes message, bytes attestation) returns (bool success)',
];

// ─── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderChainGrid();
  renderHistory();
  updateBridgeButton();

  if (window.ethereum) {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
  }
});

// ─── Wallet ──────────────────────────────────────────────
async function connectWallet() {
  if (!window.ethereum) {
    showError('No wallet detected. Please install MetaMask.');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    await setupProvider(accounts[0]);
  } catch (e) {
    if (e.code !== 4001) showError('Failed to connect wallet.');
  }
}

async function setupProvider(address) {
  // Use ethers from CDN if available, else fallback to raw RPC
  if (typeof ethers !== 'undefined') {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  }

  walletAddress = address;
  const short = `${address.slice(0,6)}...${address.slice(-4)}`;

  document.getElementById('connect-label').textContent = short;
  document.getElementById('connect-btn').classList.add('connected');
  document.getElementById('net-dot').classList.add('connected');

  const chainId = parseInt(await window.ethereum.request({ method: 'eth_chainId' }), 16);
  updateNetworkPill(chainId);

  if (fromChain) await refreshBalance();
  updateBridgeButton();
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    walletAddress = null;
    document.getElementById('connect-label').textContent = 'Connect Wallet';
    document.getElementById('connect-btn').classList.remove('connected');
    document.getElementById('net-dot').classList.remove('connected');
    document.getElementById('net-name').textContent = 'Not Connected';
    document.getElementById('from-balance').textContent = '—';
    updateBridgeButton();
  } else {
    setupProvider(accounts[0]);
  }
}

function handleChainChanged(chainIdHex) {
  const chainId = parseInt(chainIdHex, 16);
  // Re-init provider so signer matches the new chain
  if (typeof ethers !== 'undefined' && window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  }
  updateNetworkPill(chainId);
  if (fromChain) refreshBalance();
}

function updateNetworkPill(chainId) {
  const chain = getChainById(chainId);
  document.getElementById('net-name').textContent = chain ? chain.shortName : `Chain ${chainId}`;
  document.getElementById('net-dot').style.animation = '';
}

function setNetworkPillSwitching(name) {
  document.getElementById('net-name').textContent = `Switching to ${name}…`;
  document.getElementById('net-dot').style.animation = 'pulse 1s ease-in-out infinite';
}

async function switchToChain(chain) {
  const targetChainId = chain.params.chainId;

  // Short-circuit if already on the target chain
  const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
  if (currentChainId.toLowerCase() === targetChainId.toLowerCase()) {
    if (typeof ethers !== 'undefined') {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
    }
    return;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetChainId }],
    });
  } catch (switchErr) {
    // 4902 = chain not in wallet — add it, then explicitly switch (some wallets
    // don't auto-switch after add). Only match the exact code; string-matching
    // error messages is too broad and creates duplicates under wrong chain IDs.
    const code = switchErr.code ?? switchErr?.error?.code ?? switchErr?.data?.originalError?.code;

    if (code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [chain.params],
        });
        // Some wallets don't auto-switch after add — explicitly switch now
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }],
          });
        } catch (postAddErr) {
          if (postAddErr.code !== 4001) throw postAddErr;
        }
      } catch (addErr) {
        if (addErr.code !== 4001) throw addErr; // 4001 = user rejected — silent
      }
    } else if (switchErr.code !== 4001) {
      throw switchErr; // real error, propagate
    }
  }

  // Wait briefly for chainChanged event to propagate to the wallet's RPC
  await sleep(200);

  // Verify and re-init provider on the new chain
  if (typeof ethers !== 'undefined') {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  }
}

// ─── Balance ─────────────────────────────────────────────
async function refreshBalance() {
  if (!walletAddress || !fromChain || typeof ethers === 'undefined') return;

  document.getElementById('from-balance').textContent = 'Loading…';
  try {
    // Use wallet's injected provider when it's already on the right chain.
    // JsonRpcProvider hits public RPCs directly and often gets CORS-blocked in browsers.
    const walletChainId = parseInt(
      await window.ethereum.request({ method: 'eth_chainId' }), 16
    );

    const balProvider = walletChainId === fromChain.id
      ? new ethers.providers.Web3Provider(window.ethereum)
      : new ethers.providers.JsonRpcProvider(fromChain.rpc);

    const usdc = new ethers.Contract(fromChain.usdc, ERC20_ABI, balProvider);
    const raw = await usdc.balanceOf(walletAddress);
    // All Circle-deployed testnet USDC tokens use 6 decimals
    const formatted = parseFloat(ethers.utils.formatUnits(raw, 6)).toFixed(2);
    document.getElementById('from-balance').textContent = `${formatted} USDC`;
  } catch (e) {
    console.warn('Balance fetch failed:', e.message);
    document.getElementById('from-balance').textContent = '—';
  }
}

// ─── Network selection ────────────────────────────────────
function openNetworkModal(target) {
  currentModalTarget = target;
  document.getElementById('modal-title').textContent = target === 'from' ? 'Select Source' : 'Select Destination';
  document.getElementById('modal-search').value = '';
  renderModalList('');
  document.getElementById('network-modal').classList.add('open');
}

function closeNetworkModal(event, force) {
  if (force || !event || event.target === document.getElementById('network-modal')) {
    document.getElementById('network-modal').classList.remove('open');
    currentModalTarget = null;
  }
}

function filterNetworks(query) {
  renderModalList(query.toLowerCase());
}

function renderModalList(query) {
  const list = document.getElementById('modal-list');
  list.innerHTML = '';

  const chains = getAllChains().filter(c =>
    !query || c.name.toLowerCase().includes(query) || c.shortName.toLowerCase().includes(query)
  );

  chains.forEach(chain => {
    const isActive = currentModalTarget === 'from'
      ? fromChain?.id === chain.id
      : toChain?.id === chain.id;

    const isDisabled = currentModalTarget === 'to'
      ? fromChain?.id === chain.id
      : toChain?.id === chain.id;

    const item = document.createElement('div');
    item.className = `modal-network-item${isActive ? ' active' : ''}${isDisabled ? ' disabled' : ''}`;

    item.innerHTML = `
      <div class="modal-net-icon">${chain.icon}</div>
      <div class="modal-net-info">
        <div class="modal-net-name">${chain.name}</div>
        <div class="modal-net-domain">CCTP Domain ${chain.domain}</div>
      </div>
      ${chain.featured ? '<span class="modal-net-badge">Featured</span>' : ''}
    `;

    if (!isDisabled) {
      item.onclick = () => selectNetwork(chain);
    }

    list.appendChild(item);
  });
}

async function selectNetwork(chain) {
  if (currentModalTarget === 'from') {
    fromChain = chain;
    setNetworkDisplay('from', chain);
    if (toChain?.id === fromChain?.id) {
      toChain = null;
      resetNetworkDisplay('to');
    }
    closeNetworkModal(null, true);

    if (walletAddress) {
      const walletChainId = parseInt(
        await window.ethereum.request({ method: 'eth_chainId' }), 16
      );
      if (walletChainId !== fromChain.id) {
        // Wallet is on a different chain — prompt switch immediately
        setNetworkPillSwitching(chain.name);
        try {
          await switchToChain(chain);
          updateNetworkPill(chain.id);
        } catch (e) {
          if (e.code !== 4001) showError(`Could not switch to ${chain.name}: ${e.message}`);
          updateNetworkPill(walletChainId);
        }
      }
      await refreshBalance();
    }
  } else {
    toChain = chain;
    setNetworkDisplay('to', chain);
    closeNetworkModal(null, true);
  }
  updateReceiveAmount();
  updateBridgeButton();
}

function setNetworkDisplay(side, chain) {
  const icon = document.getElementById(`${side}-icon`);
  const label = document.getElementById(`${side}-label`);
  // Clear inline styles — the SVG logo is self-contained, no tint needed
  icon.style.background = '';
  icon.style.fontSize = '';
  icon.innerHTML = chain.icon;
  label.textContent = chain.name;
  label.className = 'net-label chosen';
  document.getElementById(`${side}-selector`).classList.add('selected');
}

function resetNetworkDisplay(side) {
  const icon = document.getElementById(`${side}-icon`);
  const label = document.getElementById(`${side}-label`);
  icon.style.background = '';
  icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="#6B6560" stroke-width="1.2"/><path d="M6 9H12M9 6V12" stroke="#6B6560" stroke-width="1.2" stroke-linecap="round"/></svg>`;
  label.textContent = 'Select network';
  label.className = 'net-label';
  document.getElementById(`${side}-selector`).classList.remove('selected');
}

async function swapNetworks() {
  const tmp = fromChain;
  fromChain = toChain;
  toChain = tmp;

  if (fromChain) setNetworkDisplay('from', fromChain);
  else resetNetworkDisplay('from');
  if (toChain) setNetworkDisplay('to', toChain);
  else resetNetworkDisplay('to');

  updateReceiveAmount();
  updateBridgeButton();

  if (walletAddress && fromChain) {
    const walletChainId = parseInt(
      await window.ethereum.request({ method: 'eth_chainId' }), 16
    );
    if (walletChainId !== fromChain.id) {
      setNetworkPillSwitching(fromChain.name);
      try {
        await switchToChain(fromChain);
        updateNetworkPill(fromChain.id);
      } catch (e) {
        if (e.code !== 4001) showError(`Could not switch to ${fromChain.name}: ${e.message}`);
        updateNetworkPill(walletChainId);
      }
    }
    await refreshBalance();
  }
}

// ─── Amount ───────────────────────────────────────────────
function onAmountChange() {
  updateReceiveAmount();
  updateBridgeButton();
}

function updateReceiveAmount() {
  const amount = parseFloat(document.getElementById('amount-input').value) || 0;
  const fee = 0.0005;
  const receive = Math.max(0, amount - fee);
  document.getElementById('receive-amount').textContent =
    amount > 0 ? `${receive.toFixed(6)} USDC` : '—';
  document.getElementById('fee-amount').textContent =
    amount > 0 ? `~${fee} USDC` : '~0.0005 USDC';
}

async function setMax() {
  if (!walletAddress || !fromChain || typeof ethers === 'undefined') return;
  try {
    const walletChainId = parseInt(await window.ethereum.request({ method: 'eth_chainId' }), 16);
    const p = walletChainId === fromChain.id
      ? new ethers.providers.Web3Provider(window.ethereum)
      : new ethers.providers.JsonRpcProvider(fromChain.rpc);
    const usdc = new ethers.Contract(fromChain.usdc, ERC20_ABI, p);
    const raw = await usdc.balanceOf(walletAddress);
    document.getElementById('amount-input').value = parseFloat(ethers.utils.formatUnits(raw, 6)).toFixed(6);
    onAmountChange();
  } catch {}
}

// ─── Recipient ────────────────────────────────────────────
function toggleRecipient() {
  recipientOpen = !recipientOpen;
  const wrap = document.getElementById('recipient-input-wrap');
  const chev = document.getElementById('recipient-chevron');
  if (recipientOpen) {
    wrap.classList.add('open');
    chev.style.transform = 'rotate(180deg)';
  } else {
    wrap.classList.remove('open');
    chev.style.transform = '';
  }
}

// ─── Bridge ───────────────────────────────────────────────
function updateBridgeButton() {
  const btn = document.getElementById('bridge-btn');
  const label = document.getElementById('bridge-label');

  if (!walletAddress) {
    label.textContent = 'Connect wallet to bridge';
    btn.disabled = true;
    return;
  }
  if (!fromChain) {
    label.textContent = 'Select source network';
    btn.disabled = true;
    return;
  }
  if (!toChain) {
    label.textContent = 'Select destination network';
    btn.disabled = true;
    return;
  }
  const amount = parseFloat(document.getElementById('amount-input').value);
  if (!amount || amount <= 0) {
    label.textContent = 'Enter an amount';
    btn.disabled = true;
    return;
  }
  if (amount < 0.001) {
    label.textContent = 'Minimum 0.001 USDC';
    btn.disabled = true;
    return;
  }
  label.textContent = `Bridge ${amount} USDC → ${toChain.shortName}`;
  btn.disabled = false;
}

async function initiateBridge() {
  if (!walletAddress || !fromChain || !toChain) return;

  const amount = parseFloat(document.getElementById('amount-input').value);
  if (!amount || amount <= 0) return;

  hideError();
  showStatusTracker();
  document.getElementById('bridge-btn').disabled = true;

  const recipientRaw = document.getElementById('recipient-input').value.trim() || walletAddress;
  if (!ethers.utils.isAddress(recipientRaw)) {
    showError(`Invalid recipient address: ${recipientRaw}`);
    document.getElementById('bridge-btn').disabled = false;
    return;
  }
  const recipient = recipientRaw;

  try {
    // Step 1: Switch to source chain
    setStep('approve', 'active', 'Switching to source network...');
    await switchToChain(fromChain);

    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    const decimals = 6;
    const amountBN = ethers.utils.parseUnits(amount.toString(), decimals);
    const maxFee = ethers.BigNumber.from('500'); // 0.0005 USDC

    // Step 1: Approve
    setStep('approve', 'active', 'Waiting for approval...');
    const usdcContract = new ethers.Contract(fromChain.usdc, ERC20_ABI, signer);

    const allowance = await usdcContract.allowance(walletAddress, fromChain.tokenMessenger);
    if (allowance.lt(amountBN)) {
      const approveTx = await usdcContract.approve(fromChain.tokenMessenger, amountBN);
      setStep('approve', 'active', `Confirming... (tx: ${approveTx.hash.slice(0,10)}...)`);
      await approveTx.wait(1);
    }
    setStep('approve', 'done', 'Approved ✓');

    // Step 2: Burn (depositForBurn)
    setStep('burn', 'active', 'Confirm burn in wallet...');
    const messenger = new ethers.Contract(fromChain.tokenMessenger, TOKEN_MESSENGER_ABI, signer);

    // Pad address to bytes32 (left-pad, matching ABI encoding)
    const mintRecipient = ethers.utils.hexZeroPad(recipient, 32);
    const destinationCaller = ethers.utils.hexZeroPad('0x0000000000000000000000000000000000000000', 32);

    // Explicit gasLimit bypasses eth_estimateGas — public testnet RPCs
    // (sepolia.base.org etc.) are rate-limited and often reject simulation calls.
    // depositForBurn typically uses ~120-150k gas; 350k is a safe ceiling.
    const burnTx = await messenger.depositForBurn(
      amountBN,
      toChain.domain,
      mintRecipient,
      fromChain.usdc,
      destinationCaller,
      maxFee,
      1000, // fast transfer threshold
      { gasLimit: 350000 }
    );
    setStep('burn', 'active', `Burn submitted — waiting for confirmation...`);
    const burnReceipt = await burnTx.wait(1);
    if (burnReceipt.status === 0) throw new Error('depositForBurn transaction reverted on-chain');
    setStep('burn', 'done', `Burned on ${fromChain.shortName} ✓`);

    // Step 3: Poll attestation
    setStep('attest', 'active', 'Waiting for Circle attestation...');
    const attestation = await pollAttestation(burnTx.hash, fromChain.domain);
    setStep('attest', 'done', 'Attestation received ✓');

    // Step 4: Mint on destination
    setStep('mint', 'active', `Switching to ${toChain.shortName}...`);
    await switchToChain(toChain);

    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    const transmitter = new ethers.Contract(toChain.msgTransmitter, MSG_TRANSMITTER_ABI, signer);
    setStep('mint', 'active', 'Confirm mint in wallet...');
    // receiveMessage typically uses ~150-200k gas; 400k is safe ceiling.
    const mintTx = await transmitter.receiveMessage(
      attestation.message,
      attestation.attestation,
      { gasLimit: 400000 }
    );
    setStep('mint', 'active', `Mint submitted — waiting for confirmation...`);
    const mintReceipt = await mintTx.wait(1);
    if (mintReceipt.status === 0) throw new Error('receiveMessage transaction reverted on-chain');
    setStep('mint', 'done', 'USDC minted ✓');

    // Success
    const explorerUrl = `${toChain.explorer}/tx/${mintTx.hash}`;
    addHistory({
      from: fromChain.shortName,
      to: toChain.shortName,
      amount: amount,
      status: 'complete',
      time: Date.now(),
      txHash: mintTx.hash,
      burnHash: burnTx.hash,
      sourceDomain: fromChain.domain,
      explorerUrl,
    });

    showSuccess(
      `${amount} USDC bridged from ${fromChain.shortName} to ${toChain.shortName}`,
      explorerUrl
    );

  } catch (e) {
    console.error(e);
    const msg = extractErrorMessage(e);
    showError(msg);
    document.getElementById('bridge-btn').disabled = false;
    ['approve', 'burn', 'attest', 'mint'].forEach(s => {
      const ind = document.getElementById(`ind-${s}`);
      if (ind && ind.className.includes('active')) {
        setStep(s, 'error', 'Failed');
      }
    });
  }
}

function extractErrorMessage(e) {
  // User rejected — silent-ish
  if (e?.code === 4001 || e?.code === 'ACTION_REJECTED') return 'Transaction rejected in wallet.';

  // Ethers revert with reason string
  if (e?.reason) return e.reason;

  // Ethers error.data.message (contract revert reason from RPC)
  const rpcMsg = e?.error?.data?.message || e?.data?.message;
  if (rpcMsg) return rpcMsg;

  // Strip the verbose RPC blob from "RPC Request failed" errors —
  // the useful bit is everything before the first newline or JSON brace
  const raw = e?.message || 'Transaction failed';
  const cutAt = raw.search(/[\n{]/);
  const clean = cutAt > 0 ? raw.slice(0, cutAt).trim() : raw;
  return clean.length > 140 ? clean.slice(0, 140) + '…' : clean;
}

// ─── Attestation polling ─────────────────────────────────
async function pollAttestation(txHash, sourceDomain, maxAttempts = 60) {
  const url = `${IRIS_API}/v2/messages/${sourceDomain}?transactionHash=${txHash}`;
  const startTime = Date.now();

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data?.messages?.[0]?.status === 'complete') {
          return data.messages[0];
        }
        const status = data?.messages?.[0]?.status || 'pending';
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setStep('attest', 'active', `Attesting… ${status} · ${elapsed}s elapsed`);
      }
    } catch {}
    await sleep(5000);
  }
  throw new Error('Attestation timed out. Transaction may still complete — check Circle\'s attestation API.');
}

// ─── UI helpers ───────────────────────────────────────────
function showStatusTracker() {
  document.getElementById('status-tracker').style.display = 'block';
  document.getElementById('success-state').style.display = 'none';
  // Reset all steps
  ['approve', 'burn', 'attest', 'mint'].forEach(s => {
    setStep(s, 'pending',
      s === 'approve' ? 'Awaiting confirmation' :
      s === 'burn' ? 'Waiting for approval' :
      s === 'attest' ? 'Waiting for burn' : 'Waiting for attestation'
    );
  });
}

function setStep(step, state, desc) {
  const icon = document.getElementById(`icon-${step}`);
  const ind = document.getElementById(`ind-${step}`);
  const descEl = document.getElementById(`desc-${step}`);

  icon.className = `step-icon ${state}`;
  ind.className = `step-indicator ${state}`;
  if (state === 'active') icon.classList.add('spinning');
  if (descEl) descEl.textContent = desc;
}

function showSuccess(msg, txUrl) {
  document.getElementById('success-state').style.display = 'flex';
  document.getElementById('status-tracker').style.display = 'none';
  document.getElementById('success-msg').textContent = msg;
  const link = document.getElementById('success-tx-link');
  link.href = txUrl;
  link.style.display = txUrl ? 'inline' : 'none';
}

function resetBridge() {
  document.getElementById('success-state').style.display = 'none';
  document.getElementById('status-tracker').style.display = 'none';
  document.getElementById('amount-input').value = '';
  document.getElementById('bridge-btn').disabled = false;
  updateBridgeButton();
  updateReceiveAmount();
  if (fromChain) refreshBalance();
}

function showError(msg) {
  document.getElementById('error-banner').style.display = 'flex';
  document.getElementById('error-msg').textContent = msg;
}
function hideError() {
  document.getElementById('error-banner').style.display = 'none';
}
function dismissError() { hideError(); }

// ─── Chain grid (sidebar) ─────────────────────────────────
function renderChainGrid() {
  const grid = document.getElementById('chain-grid');
  getAllChains().forEach(chain => {
    const pill = document.createElement('div');
    pill.className = 'chain-pill';
    pill.title = `Domain ${chain.domain}`;
    pill.innerHTML = `
      <span class="chain-logo">${chain.icon}</span>
      ${chain.shortName}
    `;
    pill.onclick = () => {
      if (!fromChain) {
        fromChain = chain;
        setNetworkDisplay('from', chain);
        if (walletAddress) refreshBalance();
      } else if (!toChain && fromChain?.id !== chain.id) {
        toChain = chain;
        setNetworkDisplay('to', chain);
      }
      updateBridgeButton();
    };
    grid.appendChild(pill);
  });
}

// ─── History ─────────────────────────────────────────────
function addHistory(entry) {
  txHistory.unshift(entry);
  if (txHistory.length > 20) txHistory.pop();
  localStorage.setItem('ao_history', JSON.stringify(txHistory));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('history-list');
  if (!txHistory.length) {
    list.innerHTML = `<div class="history-empty">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="8" width="20" height="18" rx="2" stroke="#3A3530" stroke-width="1.3"/>
        <path d="M10 14H22M10 18H18" stroke="#3A3530" stroke-width="1.3" stroke-linecap="round"/>
      </svg>
      <span>No transactions yet</span>
    </div>`;
    return;
  }

  list.innerHTML = txHistory.map(tx => `
    <div class="history-item">
      <div class="history-item-header">
        <span class="history-route">${tx.from} → ${tx.to}</span>
        <span class="history-status ${tx.status}">${tx.status}</span>
      </div>
      <div class="history-amount">${tx.amount} USDC</div>
      <div class="history-time">${timeAgo(tx.time)}
        ${tx.explorerUrl ? ` · <a href="${tx.explorerUrl}" target="_blank" style="color:var(--gold);text-decoration:none">tx ↗</a>` : ''}
      </div>
    </div>
  `).join('');
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

// ─── Utils ────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── Unclaimed Mints Checker ──────────────────────────────

// CCTP V2 DepositForBurn event — depositor is the 3rd indexed param (topic[3])
// Topic computed at runtime via ethers so it works for any ABI variation
const DEPOSIT_FOR_BURN_EVENT = 'event DepositForBurn(uint64 indexed nonce, address indexed burnToken, uint256 amount, address indexed depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller, uint256 maxFee, uint32 minFinalityThreshold)';

let claimsRunning = false;
const claimsRegistry = {}; // txHash-key → item, avoids inline JSON in onclick attrs

function openClaimsChecker() {
  if (!walletAddress) {
    // Flash the connect button to guide the user
    const btn = document.getElementById('connect-btn');
    btn.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.5)';
    setTimeout(() => { btn.style.boxShadow = ''; }, 1200);
    showError('Connect your wallet first to find unclaimed mints.');
    return;
  }
  document.getElementById('claims-modal').classList.add('open');
  populateClaimsSourceSelect();
}

function closeClaimsModal(event, force) {
  if (force || !event || event.target === document.getElementById('claims-modal')) {
    document.getElementById('claims-modal').classList.remove('open');
  }
}

function populateClaimsSourceSelect() {
  const sel = document.getElementById('claims-src-chain');
  if (sel.options.length > 1) return; // already populated
  getAllChains().forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.domain;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });
}

// ── Sanitize tx hash input ───────────────────────────────
// Accepts a full explorer URL, a raw hex hash, or a hash without the 0x prefix.
// Returns a normalized 0x-prefixed 64-char hex string, or null if invalid.
function sanitizeTxHash(input) {
  if (!input) return null;
  const trimmed = String(input).trim();
  // Match a 64-char hex with 0x prefix anywhere in the string (handles URLs)
  const withPrefix = trimmed.match(/0x[a-fA-F0-9]{64}/);
  if (withPrefix) return withPrefix[0].toLowerCase();
  // Also accept a bare 64-char hex (no prefix)
  const noPrefix = trimmed.match(/^[a-fA-F0-9]{64}$/);
  if (noPrefix) return ('0x' + noPrefix[0]).toLowerCase();
  return null;
}

// ── Manual single-tx check ───────────────────────────────
async function checkManualTx() {
  const rawInput = document.getElementById('claims-tx-input').value;
  const txHash = sanitizeTxHash(rawInput);
  const domain = parseInt(document.getElementById('claims-src-chain').value);

  if (isNaN(domain)) {
    setClaimsScanInfo('Select a source chain.', true);
    return;
  }
  if (!txHash) {
    setClaimsScanInfo('Enter a valid transaction hash (0x-prefixed, 64 hex chars). Paste only the hash, not the explorer URL.', true);
    return;
  }
  // If we extracted a hash from a URL, write the cleaned version back so the
  // user sees what we're using.
  if (rawInput.trim() !== txHash) {
    document.getElementById('claims-tx-input').value = txHash;
  }

  setClaimsScanInfo('Fetching attestation from Circle…', false, true);
  // Clear any previous results so the loading message is visible
  document.getElementById('claims-results').innerHTML = '';

  try {
    const msg = await fetchAttestation(txHash, domain);
    if (!msg) {
      setClaimsScanInfo(
        'Circle has not yet indexed this burn. Attestations are typically ready within 30–60 seconds (longer for chains with slow finality). Wait a moment and try again.',
        true
      );
      return;
    }

    const item = buildClaimItem(msg, txHash, domain);
    if (!item) { setClaimsScanInfo('Could not decode the attestation message.', true); return; }

    // Check destination chain to see if this nonce was already minted
    setClaimsScanInfo('Verifying mint status on destination chain…', false, true);
    const claimed = await isAlreadyClaimed(item);
    if (claimed === true) item.claimed = true;

    renderClaimsItems([item], true);
    if (claimed === true) {
      setClaimsScanInfo('This transfer has already been claimed on the destination chain. No further action required.');
    } else if (item.status === 'complete') {
      setClaimsScanInfo('Attestation ready. You can claim now.');
    } else {
      setClaimsScanInfo('Attestation is still pending Circle confirmations. Check back shortly.');
    }
  } catch (e) {
    setClaimsScanInfo(`Error: ${extractErrorMessage(e)}`, true);
  }
}

// ── Has this nonce already been minted on the destination? ──────────
// Queries MessageTransmitterV2.usedNonces(bytes32) on the destination chain
// via that chain's public RPC. Returns true | false | null (null = couldn't verify).
const TRANSMITTER_USED_NONCES_ABI = [
  'function usedNonces(bytes32) view returns (uint256)',
];
async function isAlreadyClaimed(item) {
  if (!item || !item.destChainObj || !item.irisMsg?.eventNonce) return null;
  try {
    const provider = new ethers.providers.JsonRpcProvider(item.destChainObj.rpc);
    const transmitter = new ethers.Contract(
      item.destChainObj.msgTransmitter,
      TRANSMITTER_USED_NONCES_ABI,
      provider
    );
    const used = await transmitter.usedNonces(item.irisMsg.eventNonce);
    return used && !used.isZero();
  } catch (e) {
    console.warn('usedNonces check failed:', e?.message);
    return null;
  }
}

// ── Full scan ────────────────────────────────────────────
async function runClaimsCheck() {
  if (claimsRunning) return;
  claimsRunning = true;
  setScanBtn(true);
  setClaimsScanInfo('');

  const resultsEl = document.getElementById('claims-results');
  resultsEl.innerHTML = `<div class="claims-scanning-msg">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.05 3.05l2.12 2.12M10.83 10.83l2.12 2.12M3.05 12.95l2.12-2.12M10.83 5.17l2.12-2.12" stroke="#C9A84C" stroke-width="1.4" stroke-linecap="round"/>
    </svg>
    Scanning your bridge history and connected chain…
  </div>`;

  const found = [];

  // 1. Check stored bridge history from this app (burn hashes saved in localStorage)
  const historyItems = txHistory.filter(h => h.burnHash);
  for (const h of historyItems) {
    try {
      const msg = await fetchAttestation(h.burnHash, h.sourceDomain);
      if (msg) {
        const item = buildClaimItem(msg, h.burnHash, h.sourceDomain);
        if (item && !found.some(f => f.txHash === item.txHash)) found.push(item);
      }
    } catch {}
  }

  // 2. Scan the currently connected chain via window.ethereum (no CORS issues)
  try {
    const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
    const chain = getChainById(parseInt(chainIdHex, 16));
    if (chain) {
      setClaimsScanInfo(`Scanning ${chain.name} for DepositForBurn events…`);
      const burns = await scanChainBurns(chain);
      for (const burn of burns) {
        if (found.some(f => f.txHash === burn.txHash)) continue;
        try {
          const msg = await fetchAttestation(burn.txHash, chain.domain);
          if (msg) {
            const item = buildClaimItem(msg, burn.txHash, chain.domain, burn.amount);
            if (item) found.push(item);
          }
        } catch {}
      }
    }
  } catch (e) {
    console.warn('Chain scan error:', e.message);
  }

  // 3. For each found item with a complete attestation, check if it was already
  //    claimed on the destination chain so we can flag it accordingly.
  if (found.length) {
    setClaimsScanInfo('Verifying mint status on destination chains…');
    await Promise.all(found.map(async (item) => {
      if (item.status === 'complete') {
        const claimed = await isAlreadyClaimed(item);
        if (claimed === true) item.claimed = true;
      }
    }));
  }

  renderClaimsItems(found, false);
  setScanBtn(false);
  if (!found.length) {
    setClaimsScanInfo('Scan complete. No CCTP transfers found in your history or recent burns on the connected chain.');
  } else {
    const ready = found.filter(i => i.status === 'complete' && !i.claimed).length;
    const claimed = found.filter(i => i.claimed).length;
    const pending = found.length - ready - claimed;
    const parts = [];
    if (ready) parts.push(`${ready} ready to claim`);
    if (pending) parts.push(`${pending} pending`);
    if (claimed) parts.push(`${claimed} already claimed`);
    setClaimsScanInfo(`Scan complete · ${parts.join(' · ')}.`);
  }
  claimsRunning = false;
}

// ── Scan a chain for DepositForBurn events via wallet RPC ─
async function scanChainBurns(chain) {
  if (!walletAddress || typeof ethers === 'undefined') return [];
  try {
    const iface = new ethers.utils.Interface([DEPOSIT_FOR_BURN_EVENT]);
    const topic0 = iface.getEventTopic('DepositForBurn');
    // depositor = topic[3] (3rd indexed param, 0-indexed after topic0)
    const depositorTopic = ethers.utils.hexZeroPad(walletAddress.toLowerCase(), 32);

    const latestHex = await window.ethereum.request({ method: 'eth_blockNumber', params: [] });
    const latestBlock = parseInt(latestHex, 16);
    const fromBlock = '0x' + Math.max(0, latestBlock - 10000).toString(16);

    const logs = await window.ethereum.request({
      method: 'eth_getLogs',
      params: [{
        address: chain.tokenMessenger,
        topics: [topic0, null, null, depositorTopic],
        fromBlock,
        toBlock: 'latest',
      }],
    });

    return (logs || []).map(log => {
      try {
        const parsed = iface.parseLog(log);
        return {
          txHash: log.transactionHash,
          destDomain: parsed.args.destinationDomain,
          amount: ethers.utils.formatUnits(parsed.args.amount, 6),
          mintRecipient: parsed.args.mintRecipient,
        };
      } catch { return null; }
    }).filter(Boolean);
  } catch (e) {
    console.warn('eth_getLogs failed:', e.message);
    return [];
  }
}

// ── Fetch attestation from Iris ───────────────────────────
async function fetchAttestation(txHash, domain) {
  if (!txHash || domain === undefined || domain === null) return null;
  try {
    const res = await fetch(`${IRIS_API}/v2/messages/${domain}?transactionHash=${txHash}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.messages?.[0] || null;
  } catch { return null; }
}

// ── Build a unified claim item from an Iris message ───────
function buildClaimItem(irisMsg, txHash, sourceDomain, knownAmount) {
  if (!irisMsg) return null;

  const status = irisMsg.status; // 'complete', 'pending_confirmations', etc.
  const msgHex = irisMsg.message;
  if (!msgHex) return null;

  // Extract destination domain from the raw message bytes
  // CCTP message header: version(4B) + sourceDomain(4B) + destDomain(4B) …
  const hex = msgHex.startsWith('0x') ? msgHex.slice(2) : msgHex;
  const srcDomain  = parseInt(hex.slice(8, 16), 16);
  const destDomain = parseInt(hex.slice(16, 24), 16);

  const sourceChain = getChainByDomain(srcDomain || sourceDomain);
  const destChain   = getChainByDomain(destDomain);

  // Use amount passed from scan data if available; otherwise try decoding from
  // the raw BurnMessage body (CCTP V2 body offset ~196 bytes = 392 hex chars,
  // amount is a 32-byte uint256 at bytes 196–228 of the full message)
  let amount = knownAmount || null;
  if (!amount) {
    try {
      // Full CCTP message: header (116 bytes) + BurnMessage body
      // BurnMessage: version(4B) + burnToken(32B) + mintRecipient(32B) + amount(32B)
      // So amount starts at byte 116 + 4 + 32 + 32 = 184 → hex offset 368
      const amountHex = '0x' + hex.slice(368, 432);
      const amountBN = ethers.BigNumber.from(amountHex);
      amount = parseFloat(ethers.utils.formatUnits(amountBN, 6)).toFixed(2);
      if (parseFloat(amount) <= 0) amount = null;
    } catch {}
  }

  return {
    txHash,
    status,           // 'complete' = attestation ready; anything else = not yet
    sourceDomain: srcDomain || sourceDomain,
    destDomain,
    sourceChain: sourceChain?.name || `Domain ${srcDomain}`,
    sourceChainObj: sourceChain,
    destChain: destChain?.name || `Domain ${destDomain}`,
    destChainObj: destChain,
    amount: amount || '?',
    message: irisMsg.message,
    attestation: irisMsg.attestation,
    irisMsg,
  };
}

// ── Render results ────────────────────────────────────────
function renderClaimsItems(items, manual) {
  const el = document.getElementById('claims-results');

  if (!items.length) {
    el.innerHTML = `<div class="claims-none-found">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#2E2B24" stroke-width="1.5"/>
        <path d="M14 20L18 24L26 16" stroke="#2E2B24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div class="none-title">No unclaimed mints found</div>
      <div class="none-sub">All your CCTP transfers appear to be minted, or there are no burns in the last 10,000 blocks.</div>
    </div>`;
    return;
  }

  const claimable = items.filter(i => i.status === 'complete' && !i.claimed);
  const pending   = items.filter(i => i.status !== 'complete' && !i.claimed);
  const claimed   = items.filter(i => i.claimed);

  let html = '';
  if (claimable.length) {
    html += `<div class="claims-section-label">Ready to claim (${claimable.length})</div>`;
    html += claimable.map(i => claimItemHTML(i)).join('');
  }
  if (pending.length) {
    html += `<div class="claims-section-label" style="margin-top:0.75rem">Pending attestation (${pending.length})</div>`;
    html += pending.map(i => claimItemHTML(i)).join('');
  }
  if (claimed.length) {
    html += `<div class="claims-section-label" style="margin-top:0.75rem">Already claimed (${claimed.length})</div>`;
    html += claimed.map(i => claimItemHTML(i)).join('');
  }
  el.innerHTML = html;
}

function claimItemHTML(item) {
  const isClaimed = !!item.claimed;
  const isReady = item.status === 'complete' && !isClaimed;
  const srcExplorer = item.sourceChainObj?.explorer;
  const shortHash = `${item.txHash.slice(0, 8)}…${item.txHash.slice(-6)}`;
  const txLink = srcExplorer
    ? `<a href="${srcExplorer}/tx/${item.txHash}" target="_blank">${shortHash} ↗</a>`
    : shortHash;

  const amount = item.amount !== '?' ? `${item.amount} USDC` : 'USDC';
  const regKey = item.txHash.slice(2, 14);
  claimsRegistry[regKey] = item;

  let badgeClass, badgeText;
  if (isClaimed)      { badgeClass = 'claimed'; badgeText = 'Already minted'; }
  else if (isReady)   { badgeClass = 'ready';   badgeText = 'Attestation ready'; }
  else                { badgeClass = 'pending'; badgeText = 'Pending attestation'; }

  let action;
  if (isClaimed) {
    action = `<span class="claim-action-note">Funds already on ${item.destChainObj?.shortName || 'destination'}</span>`;
  } else if (isReady) {
    action = `<button class="btn-claim-now" onclick="claimMint(claimsRegistry['${regKey}'], this)">Claim now</button>`;
  } else {
    action = `<span class="claim-action-note">Check back shortly</span>`;
  }

  return `<div class="claim-item${isClaimed ? ' is-claimed' : ''}" id="claim-${regKey}">
    <div class="claim-item-header">
      <div class="claim-route">
        <span>${item.sourceChain}</span>
        <span class="claim-route-arrow">→</span>
        <span>${item.destChain}</span>
      </div>
      <span class="claim-amount">${amount}</span>
    </div>
    <div class="claim-item-meta">
      <span class="claim-tx">${txLink}</span>
    </div>
    <div class="claim-status-row">
      <span class="claim-badge ${badgeClass}">
        <span class="badge-dot"></span>
        ${badgeText}
      </span>
      ${action}
    </div>
  </div>`;
}

// ── Execute the mint (receiveMessage) ─────────────────────
async function claimMint(item, btn) {
  if (!walletAddress) { showError('Connect your wallet first.'); return; }
  if (!item.destChainObj) {
    showError(`Destination chain (domain ${item.destDomain}) is not configured in this app.`);
    return;
  }
  if (!item.message || !item.attestation) {
    showError('Attestation data missing — status may not be complete yet.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Switching chain…';

  try {
    await switchToChain(item.destChainObj);
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    btn.textContent = 'Confirm in wallet…';
    const transmitter = new ethers.Contract(
      item.destChainObj.msgTransmitter, MSG_TRANSMITTER_ABI, signer
    );
    const tx = await transmitter.receiveMessage(
      item.message,
      item.attestation,
      { gasLimit: 400000 }
    );

    btn.textContent = 'Minting…';
    const receipt = await tx.wait(1);
    if (receipt.status === 0) throw new Error('receiveMessage reverted on-chain');

    // Remove the card and show success
    const card = document.getElementById(`claim-${item.txHash.slice(2, 14)}`);
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(-8px)';
      card.style.transition = 'opacity 0.3s, transform 0.3s';
      setTimeout(() => card.remove(), 300);
    }

    const explorerUrl = `${item.destChainObj.explorer}/tx/${tx.hash}`;
    addHistory({
      from: item.sourceChain,
      to: item.destChainObj.shortName,
      amount: item.amount !== '?' ? parseFloat(item.amount) : 0,
      status: 'complete',
      time: Date.now(),
      txHash: tx.hash,
      explorerUrl,
    });

    setClaimsScanInfo(`✓ Claimed on ${item.destChainObj.name}. <a href="${explorerUrl}" target="_blank" style="color:var(--gold)">View tx ↗</a>`);

  } catch (e) {
    btn.disabled = false;
    btn.textContent = 'Claim Now';
    showError(extractErrorMessage(e));
  }
}

// ── UI helpers ────────────────────────────────────────────
function setScanBtn(scanning) {
  const btn = document.getElementById('claims-scan-btn');
  btn.disabled = scanning;
  btn.classList.toggle('scanning', scanning);
  btn.innerHTML = scanning
    ? `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2M2.9 2.9l1.4 1.4M8.7 8.7l1.4 1.4M2.9 10.1l1.4-1.4M8.7 4.3l1.4-1.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Scanning…`
    : `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v2M6.5 10v2M1 6.5h2M10 6.5h2M2.9 2.9l1.4 1.4M8.7 8.7l1.4 1.4M2.9 10.1l1.4-1.4M8.7 4.3l1.4-1.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Scan Now`;
}

function setClaimsScanInfo(msg, isError, isLoading) {
  const el = document.getElementById('claims-scan-info');
  el.style.color = isError ? 'var(--error)' : isLoading ? 'var(--gold)' : 'var(--muted)';
  el.innerHTML = msg || 'Scans your connected chain for DepositForBurn events + checks your bridge history.';
}
