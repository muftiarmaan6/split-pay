#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Env, String, Address, Symbol};

/// Represents a bill-splitting expense stored on-chain.
#[contracttype]
pub struct Expense {
    pub payer: Address,
    pub debtor: Address,
    pub amount: i128,
    pub description: String,
    pub is_settled: bool,
}

#[contract]
pub struct SplitPayContract;

#[contractimpl]
impl SplitPayContract {
    /// Adds a new expense record on-chain and emits an ExpenseAdded event.
    /// Returns the auto-incremented expense ID.
    pub fn add_expense(
        env: Env,
        payer: Address,
        debtor: Address,
        amount: i128,
        description: String,
    ) -> u64 {
        payer.require_auth();

        let count_key = Symbol::new(&env, "count");
        let mut count: u64 = env
            .storage()
            .instance()
            .get(&count_key)
            .unwrap_or(0u64);
        count += 1;

        let expense = Expense {
            payer: payer.clone(),
            debtor: debtor.clone(),
            amount,
            description: description.clone(),
            is_settled: false,
        };

        env.storage().instance().set(&count, &expense);
        env.storage().instance().set(&count_key, &count);

        // Emit event: ("expense", "added") -> (id, payer, debtor, amount, description)
        env.events().publish(
            (Symbol::new(&env, "expense"), Symbol::new(&env, "added")),
            (count, payer.clone(), debtor.clone(), amount, description),
        );

        count
    }

    /// ✨ GREEN BELT: Inter-contract call
    /// Settles an expense by:
    ///   1. Calling the XLM SAC token contract (inter-contract call) to transfer
    ///      `amount` stroops from `debtor` → `payer`.
    ///   2. Marking the expense as settled in contract storage.
    ///   3. Emitting an ExpenseSettled event.
    ///
    /// The native XLM SAC address on Testnet:
    ///   CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
    pub fn settle_expense_onchain(
        env: Env,
        expense_id: u64,
        debtor: Address,
        token_address: Address,
    ) {
        // Only the debtor can authorise their own settlement
        debtor.require_auth();

        let mut expense: Expense = env
            .storage()
            .instance()
            .get(&expense_id)
            .unwrap();

        // Guard: cannot settle an already-settled expense
        if expense.is_settled {
            panic!("expense already settled");
        }

        // ─── INTER-CONTRACT CALL ────────────────────────────────────────────
        // Instantiate the Stellar Asset Contract (SAC) client using the token
        // address passed in (so this works on any network / token).
        // token::Client invokes the SAC's `transfer` function on our behalf.
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&debtor, &expense.payer, &expense.amount);
        // ────────────────────────────────────────────────────────────────────

        // Mark as settled
        expense.is_settled = true;
        env.storage().instance().set(&expense_id, &expense);

        // Emit event: ("expense", "settled") -> (id, debtor, amount)
        env.events().publish(
            (Symbol::new(&env, "expense"), Symbol::new(&env, "settled")),
            (expense_id, debtor.clone(), expense.amount),
        );
    }

    /// Read-only: get the total number of expenses stored.
    pub fn get_expense_count(env: Env) -> u64 {
        let count_key = Symbol::new(&env, "count");
        env.storage().instance().get(&count_key).unwrap_or(0u64)
    }
}
