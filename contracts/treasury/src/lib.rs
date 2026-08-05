#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Map, String, Symbol, Vec};

// ── Storage keys ────────────────────────────────────────────────────────────────
const OWNER: Symbol = symbol_short!("owner");
const SIGNERS: Symbol = symbol_short!("signers");
const THRESHOLD: Symbol = symbol_short!("threshold");
const TX_COUNT: Symbol = symbol_short!("tx_count");
const IS_FROZEN: Symbol = symbol_short!("frozen");

// ── Data types ──────────────────────────────────────────────────────────────────
#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct Signer {
    pub address: Address,
    pub name: String,
    pub weight: u32,
    pub role: String,
    pub added_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct TreasuryTransaction {
    pub id: u64,
    pub to: Address,
    pub amount: i128,
    pub asset: String,
    pub memo: String,
    pub approvals: Map<Address, bool>,
    pub executed: bool,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum TreasuryAction {
    Payment,
    Transfer,
    Distribution,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct AuditEvent {
    pub timestamp: u64,
    pub actor: Address,
    pub action: String,
    pub details: String,
}

// ── Events ──────────────────────────────────────────────────────────────────────
#[contracttype]
pub enum TreasuryEvent {
    SignerAdded(Address, String, u32),
    SignerRemoved(Address),
    ThresholdUpdated(u32),
    TransactionCreated(u64, Address, i128),
    TransactionApproved(u64, Address),
    TransactionExecuted(u64),
    TransactionRejected(u64),
    TreasuryFrozen,
    TreasuryUnfrozen,
}

// ── Contract ────────────────────────────────────────────────────────────────────

#[contract]
pub struct GranaryVaultTreasury;

#[contractimpl]
impl GranaryVaultTreasury {
    /// Initialize the treasury with an owner and initial threshold
    pub fn initialize(env: Env, owner: Address, threshold: u32) {
        if env.storage().instance().has(&OWNER) {
            panic!("Treasury already initialized");
        }
        owner.require_auth();
        env.storage().instance().set(&OWNER, &owner);
        env.storage().instance().set(&THRESHOLD, &threshold);
        env.storage().instance().set(&TX_COUNT, &0u64);
        env.storage().instance().set(&IS_FROZEN, &false);
        env.storage().instance().set(&SIGNERS, &Map::<Address, Signer>::new(&env));

        env.events().publish(
            (symbol_short!("init"), symbol_short!("treasury")),
            owner,
        );
    }

    /// Add a signer to the treasury
    pub fn add_signer(
        env: Env,
        signer_address: Address,
        name: String,
        weight: u32,
        role: String,
    ) {
        Self::require_owner(&env);
        let mut signers: Map<Address, Signer> = env.storage().instance().get(&SIGNERS).unwrap();

        let signer = Signer {
            address: signer_address.clone(),
            name: name.clone(),
            weight,
            role: role.clone(),
            added_at: env.ledger().timestamp(),
        };
        signers.set(signer_address.clone(), signer);
        env.storage().instance().set(&SIGNERS, &signers);

        env.events().publish(
            (symbol_short!("signer"), symbol_short!("added")),
            (signer_address, name, weight),
        );
    }

    /// Remove a signer
    pub fn remove_signer(env: Env, signer_address: Address) {
        Self::require_owner(&env);
        let mut signers: Map<Address, Signer> = env.storage().instance().get(&SIGNERS).unwrap();
        signers.remove(signer_address.clone());
        env.storage().instance().set(&SIGNERS, &signers);

        env.events().publish(
            (symbol_short!("signer"), symbol_short!("removed")),
            signer_address,
        );
    }

    /// Update approval threshold
    pub fn update_threshold(env: Env, new_threshold: u32) {
        Self::require_owner(&env);
        env.storage().instance().set(&THRESHOLD, &new_threshold);

        env.events().publish(
            (symbol_short!("threshold"), symbol_short!("updated")),
            new_threshold,
        );
    }

    /// Create a new transaction (requires signer)
    pub fn create_transaction(
        env: Env,
        signer: Address,
        to: Address,
        amount: i128,
        asset: String,
        memo: String,
    ) -> u64 {
        signer.require_auth();
        Self::require_not_frozen(&env);

        let mut count: u64 = env.storage().instance().get(&TX_COUNT).unwrap();
        count += 1;
        let tx_id = count;

        let mut approvals = Map::<Address, bool>::new(&env);
        approvals.set(signer.clone(), true);

        let tx = TreasuryTransaction {
            id: tx_id,
            to: to.clone(),
            amount,
            asset: asset.clone(),
            memo,
            approvals,
            executed: false,
            created_at: env.ledger().timestamp(),
        };

        env.storage().instance().set(&symbol_short!("tx"), &tx);
        env.storage().instance().set(&TX_COUNT, &count);

        env.events().publish(
            (symbol_short!("tx"), symbol_short!("created")),
            (tx_id, to, amount),
        );

        tx_id
    }

    /// Approve a pending transaction
    pub fn approve_transaction(env: Env, signer: Address, tx_id: u64) {
        signer.require_auth();
        Self::require_signer(&env, &signer);

        let mut tx: TreasuryTransaction = env.storage().instance().get(&symbol_short!("tx")).unwrap();
        tx.approvals.set(signer.clone(), true);
        env.storage().instance().set(&symbol_short!("tx"), &tx);

        // Check if threshold met
        let threshold: u32 = env.storage().instance().get(&THRESHOLD).unwrap();
        let signers: Map<Address, Signer> = env.storage().instance().get(&SIGNERS).unwrap();

        let mut total_weight: u32 = 0;
        for approval_entry in tx.approvals.iter() {
            if approval_entry.1 {
                if let Some(s) = signers.get(approval_entry.0) {
                    total_weight += s.weight;
                }
            }
        }

        if total_weight >= threshold {
            env.events().publish(
                (symbol_short!("tx"), symbol_short!("executed")),
                tx_id,
            );
        } else {
            env.events().publish(
                (symbol_short!("tx"), symbol_short!("approved")),
                (tx_id, signer),
            );
        }
    }

    /// Freeze the treasury (emergency)
    pub fn freeze(env: Env) {
        Self::require_owner(&env);
        env.storage().instance().set(&IS_FROZEN, &true);
        env.events().publish((symbol_short!("freeze"),), ());
    }

    /// Unfreeze the treasury
    pub fn unfreeze(env: Env) {
        Self::require_owner(&env);
        env.storage().instance().set(&IS_FROZEN, &false);
        env.events().publish((symbol_short!("unfreeze"),), ());
    }

    // ── Query functions ──────────────────────────────────────────────────────

    /// Get treasury owner
    pub fn get_owner(env: Env) -> Address {
        env.storage().instance().get(&OWNER).unwrap()
    }

    /// Get all signers
    pub fn get_signers(env: Env) -> Map<Address, Signer> {
        env.storage().instance().get(&SIGNERS).unwrap_or(Map::new(&env))
    }

    /// Get threshold
    pub fn get_threshold(env: Env) -> u32 {
        env.storage().instance().get(&THRESHOLD).unwrap()
    }

    /// Check if frozen
    pub fn is_frozen(env: Env) -> bool {
        env.storage().instance().get(&IS_FROZEN).unwrap_or(false)
    }

    // ── Auth helpers ─────────────────────────────────────────────────────────

    fn require_owner(env: &Env) {
        let owner: Address = env.storage().instance().get(&OWNER).unwrap();
        owner.require_auth();
    }

    fn require_signer(env: &Env, signer: &Address) {
        let signers: Map<Address, Signer> = env.storage().instance().get(&SIGNERS).unwrap();
        if !signers.contains_key(signer.clone()) {
            panic!("Not an authorized signer");
        }
    }

    fn require_not_frozen(env: &Env) {
        let frozen: bool = env.storage().instance().get(&IS_FROZEN).unwrap_or(false);
        if frozen {
            panic!("Treasury is frozen");
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::{Address, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let owner = Address::generate(&env);
        let contract_id = env.register(GranaryVaultTreasury, ());
        let client = GranaryVaultTreasuryClient::new(&env, &contract_id);

        client.initialize(&owner, &3);
        assert_eq!(client.get_owner(), owner);
        assert_eq!(client.get_threshold(), 3);
        assert!(!client.is_frozen());
    }

    #[test]
    fn test_add_signer() {
        let env = Env::default();
        let owner = Address::generate(&env);
        let signer = Address::generate(&env);
        let contract_id = env.register(GranaryVaultTreasury, ());
        let client = GranaryVaultTreasuryClient::new(&env, &contract_id);

        client.initialize(&owner, &3);
        client.add_signer(&signer, &String::from_str(&env, "Alice"), &2, &String::from_str(&env, "Treasurer"));

        let signers = client.get_signers();
        assert!(signers.contains_key(signer));
    }
}
