#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, String, Address};

#[contracttype]
pub struct Expense {
    pub payer: Address,
    pub amount: i128,
    pub description: String,
    pub is_settled: bool,
}

#[contract]
pub struct SplitPayContract;

#[contractimpl]
impl SplitPayContract {
    pub fn add_expense(
        env: Env,
        payer: Address,
        amount: i128,
        description: String,
    ) -> u64 {
        payer.require_auth();
        
        let mut count: u64 = env.storage().instance().get(&Symbol::new(&env, "count")).unwrap_or(0);
        count += 1;
        
        let expense = Expense {
            payer: payer.clone(),
            amount,
            description,
            is_settled: false,
        };
        
        env.storage().instance().set(&count, &expense);
        env.storage().instance().set(&Symbol::new(&env, "count"), &count);
        
        count
    }

    pub fn mark_settled(env: Env, expense_id: u64, payer: Address) {
        payer.require_auth();
        
        let mut expense: Expense = env.storage().instance().get(&expense_id).unwrap();
        expense.is_settled = true;
        
        env.storage().instance().set(&expense_id, &expense);
    }
}
