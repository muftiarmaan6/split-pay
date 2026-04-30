#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, vec, Address, Env, String, Symbol, Vec};

/// Represents a bill-splitting expense stored on-chain.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Expense {
    pub id: u64,
    pub group_id: u64, // 0 if not associated with a group
    pub payer: Address,
    pub amount: i128,
    pub description: String,
    pub is_settled: bool,
}

/// Represents a group of users for sharing expenses.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Group {
    pub id: u64,
    pub name: String,
    pub members: Vec<Address>,
}

/// Request payload for batch settling.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SettlementRequest {
    pub expense_id: u64,
    pub debtor: Address,
    pub token_address: Address,
}

/// Custom error codes for the SplitPay contract.
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum SplitPayError {
    InvalidAmount = 1,
    ExpenseNotFound = 2,
    AlreadySettled = 3,
    Unauthorized = 4,
    InsufficientBalance = 5,
    GroupNotFound = 6,
    NotAGroupMember = 7,
}

/// Storage keys enum to organize state properly.
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    ExpenseCount,
    GroupCount,
    Expense(u64),
    Group(u64),
}

#[contract]
pub struct SplitPayContract;

#[contractimpl]
impl SplitPayContract {
    // ──────────────────────────────────────────────────────────────────────────
    // EXPENSES
    // ──────────────────────────────────────────────────────────────────────────

    /// Adds a new expense record on-chain.
    pub fn add_expense(
        env: Env,
        group_id: u64,
        payer: Address,
        amount: i128,
        description: String,
    ) -> Result<u64, SplitPayError> {
        payer.require_auth();

        if amount <= 0 {
            return Err(SplitPayError::InvalidAmount);
        }

        // Validate group membership if a group is specified
        if group_id > 0 {
            let group_opt: Option<Group> = env.storage().instance().get(&DataKey::Group(group_id));
            let group = group_opt.ok_or(SplitPayError::GroupNotFound)?;
            if !group.members.contains(&payer) {
                return Err(SplitPayError::NotAGroupMember);
            }
        }

        let mut count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::ExpenseCount)
            .unwrap_or(0u64);
        count += 1;

        let expense = Expense {
            id: count,
            group_id,
            payer: payer.clone(),
            amount,
            description: description.clone(),
            is_settled: false,
        };

        env.storage().instance().set(&DataKey::Expense(count), &expense);
        env.storage().instance().set(&DataKey::ExpenseCount, &count);

        env.events().publish(
            (Symbol::new(&env, "expense"), Symbol::new(&env, "added")),
            (count, group_id, payer, amount),
        );

        Ok(count)
    }

    /// Read-only: retrieve a single expense by ID.
    pub fn get_expense(env: Env, expense_id: u64) -> Result<Expense, SplitPayError> {
        env.storage().instance().get(&DataKey::Expense(expense_id)).ok_or(SplitPayError::ExpenseNotFound)
    }

    /// Read-only: get the total number of expenses stored.
    pub fn get_expense_count(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::ExpenseCount).unwrap_or(0u64)
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GROUPS (Level 4 Feature)
    // ──────────────────────────────────────────────────────────────────────────

    /// Creates a new group. The creator is automatically added as a member.
    pub fn create_group(env: Env, creator: Address, name: String) -> u64 {
        creator.require_auth();

        let mut count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::GroupCount)
            .unwrap_or(0u64);
        count += 1;

        let mut members = Vec::new(&env);
        members.push_back(creator.clone());

        let group = Group {
            id: count,
            name,
            members,
        };

        env.storage().instance().set(&DataKey::Group(count), &group);
        env.storage().instance().set(&DataKey::GroupCount, &count);

        count
    }

    /// Adds a new member to an existing group. Admin/Creator must authorize.
    pub fn add_member(
        env: Env,
        group_id: u64,
        admin: Address,
        new_member: Address,
    ) -> Result<(), SplitPayError> {
        admin.require_auth();

        let mut group: Group = env.storage().instance().get(&DataKey::Group(group_id)).ok_or(SplitPayError::GroupNotFound)?;

        // Only existing members can add new members
        if !group.members.contains(&admin) {
            return Err(SplitPayError::Unauthorized);
        }

        if !group.members.contains(&new_member) {
            group.members.push_back(new_member);
            env.storage().instance().set(&DataKey::Group(group_id), &group);
        }

        Ok(())
    }

    /// Read-only: retrieve a single group by ID.
    pub fn get_group(env: Env, group_id: u64) -> Result<Group, SplitPayError> {
        env.storage().instance().get(&DataKey::Group(group_id)).ok_or(SplitPayError::GroupNotFound)
    }

    // ──────────────────────────────────────────────────────────────────────────
    // SETTLEMENTS (Levels 1, 2 & 4 Features)
    // ──────────────────────────────────────────────────────────────────────────

    /// Marks an expense as settled without performing a token transfer.
    pub fn mark_settled(
        env: Env,
        expense_id: u64,
        payer: Address,
    ) -> Result<(), SplitPayError> {
        payer.require_auth();

        let mut expense: Expense = env.storage().instance().get(&DataKey::Expense(expense_id)).ok_or(SplitPayError::ExpenseNotFound)?;

        if expense.is_settled {
            return Err(SplitPayError::AlreadySettled);
        }

        if expense.payer != payer {
            return Err(SplitPayError::Unauthorized);
        }

        expense.is_settled = true;
        env.storage().instance().set(&DataKey::Expense(expense_id), &expense);

        env.events().publish(
            (Symbol::new(&env, "expense"), Symbol::new(&env, "settled")),
            (expense_id, payer),
        );

        Ok(())
    }

    /// Settles an expense by performing an inter-contract call to the Stellar Asset Contract (SAC).
    pub fn settle_expense_onchain(
        env: Env,
        expense_id: u64,
        debtor: Address,
        token_address: Address,
    ) -> Result<(), SplitPayError> {
        debtor.require_auth();

        let mut expense: Expense = env.storage().instance().get(&DataKey::Expense(expense_id)).ok_or(SplitPayError::ExpenseNotFound)?;

        if expense.is_settled {
            return Err(SplitPayError::AlreadySettled);
        }

        if expense.amount <= 0 {
            return Err(SplitPayError::InvalidAmount);
        }

        // ─── INTER-CONTRACT CALL ───
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&debtor, &expense.payer, &expense.amount);

        expense.is_settled = true;
        env.storage().instance().set(&DataKey::Expense(expense_id), &expense);

        env.events().publish(
            (Symbol::new(&env, "expense"), Symbol::new(&env, "settled")),
            (expense_id, debtor, expense.amount),
        );

        Ok(())
    }

    /// Auto-Settlement / Batch Settlement (Level 4 Feature)
    /// Settles multiple minimized debts in a single transaction payload.
    pub fn batch_settle(
        env: Env,
        debtor: Address,
        settlements: Vec<SettlementRequest>,
    ) -> Result<(), SplitPayError> {
        debtor.require_auth();

        for req in settlements.iter() {
            // Ensure the auth context applies to every request in the batch
            if req.debtor != debtor {
                return Err(SplitPayError::Unauthorized);
            }
            
            // Delegate to the standard on-chain settlement
            Self::settle_expense_onchain(
                env.clone(),
                req.expense_id,
                debtor.clone(),
                req.token_address.clone(),
            )?;
        }

        Ok(())
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// TESTS
// ──────────────────────────────────────────────────────────────────────────────
#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{token, Address, Env, String};
    use token::Client as TokenClient;
    use token::StellarAssetClient as TokenAdminClient;

    fn create_token_contract<'a>(env: &Env, admin: &Address) -> (TokenClient<'a>, TokenAdminClient<'a>) {
        let contract_id = env.register_stellar_asset_contract(admin.clone());
        (
            TokenClient::new(env, &contract_id),
            TokenAdminClient::new(env, &contract_id),
        )
    }

    #[test]
    fn test_add_expense_and_settle() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, SplitPayContract);
        let client = SplitPayContractClient::new(&env, &contract_id);

        let payer = Address::generate(&env);
        let debtor = Address::generate(&env);
        let admin = Address::generate(&env);

        let (token, token_admin) = create_token_contract(&env, &admin);

        // Fund the debtor so they can pay
        token_admin.mint(&debtor, 2000i128);

        // Add expense
        let desc = String::from_str(&env, "Dinner");
        let expense_id = client.add_expense(0, &payer, 500i128, &desc);
        assert_eq!(expense_id, 1);

        // Verify expense data
        let expense = client.get_expense(expense_id);
        assert_eq!(expense.amount, 500);
        assert_eq!(expense.payer, payer);
        assert_eq!(expense.is_settled, false);

        // Settle on-chain
        client.settle_expense_onchain(expense_id, &debtor, &token.address);

        // Check balances
        assert_eq!(token.balance(&debtor), 1500); // 2000 - 500
        assert_eq!(token.balance(&payer), 500);   // 0 + 500

        // Check state
        let settled_expense = client.get_expense(expense_id);
        assert_eq!(settled_expense.is_settled, true);
    }

    #[test]
    fn test_group_features() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, SplitPayContract);
        let client = SplitPayContractClient::new(&env, &contract_id);

        let alice = Address::generate(&env);
        let bob = Address::generate(&env);

        // Create Group
        let group_name = String::from_str(&env, "Roommates");
        let group_id = client.create_group(&alice, &group_name);
        assert_eq!(group_id, 1);

        // Add Member
        client.add_member(group_id, &alice, &bob);

        // Get Group and assert
        let group = client.get_group(group_id);
        assert_eq!(group.members.len(), 2);
        assert!(group.members.contains(&bob));

        // Add Group Expense
        let desc = String::from_str(&env, "Groceries");
        let expense_id = client.add_expense(group_id, &alice, 1000i128, &desc);
        
        let expense = client.get_expense(expense_id);
        assert_eq!(expense.group_id, group_id);
    }
}
