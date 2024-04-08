use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer};

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("HgPZRDk5Ue7ZikeJ62pFiztE6iwZosYnvUPLKFtvmNKW");

#[program]
mod spl404 {
    use super::*;
    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn transfer_in(_ctx: Context<TransferAccounts>, amount: u64) -> Result<()> {
        msg!("Token amount transfer in: {}!", amount);

        // Below is the actual instruction that we are going to send to the Token program.
        let transfer_instruction = Transfer {
            from: _ctx.accounts.sender_token_account.to_account_info(),
            to: _ctx.accounts.vault_token_account.to_account_info(),
            authority: _ctx.accounts.signer.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(
            _ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
        );

        anchor_spl::token::transfer(cpi_ctx, amount)?;

        Ok(())
    }

    pub fn transfer_out(_ctx: Context<TransferAccounts>, amount: u64) -> Result<()> {
        msg!("Token amount transfer out: {}!", amount);

        // Below is the actual instruction that we are going to send to the Token program.
        let transfer_instruction = Transfer {
            from: _ctx.accounts.vault_token_account.to_account_info(),
            to: _ctx.accounts.sender_token_account.to_account_info(),
            authority: _ctx.accounts.token_account_owner_pda.to_account_info(),
        };

        let bump = _ctx.bumps.token_account_owner_pda;
        let seeds = &[b"token_account_owner_pda".as_ref(), &[bump]];
        let signer = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            _ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
            signer,
        );

        anchor_spl::token::transfer(cpi_ctx, amount)?;
        Ok(())
    }

    #[derive(Accounts)]
    pub struct Initialize<'info> {
        // Derived PDAs
        #[account(
            init_if_needed,
            payer = signer,
            seeds=[b"token_account_owner_pda"],
            bump,
            space = 8
        )]
        token_account_owner_pda: AccountInfo<'info>,

        #[account(
            init_if_needed,
            payer = signer,
            seeds=[b"token_vault", mint_of_token_being_sent.key().as_ref()],
            token::mint=mint_of_token_being_sent,
            token::authority=token_account_owner_pda,
            bump
        )]
        vault_token_account: Account<'info, TokenAccount>,

        mint_of_token_being_sent: Account<'info, Mint>,

        #[account(mut)]
        signer: Signer<'info>,
        system_program: Program<'info, System>,
        token_program: Program<'info, Token>,
        rent: Sysvar<'info, Rent>,
    }

    #[derive(Accounts)]
    pub struct TransferAccounts<'info> {
        // Derived PDAs
        #[account(mut,
            seeds=[b"token_account_owner_pda"],
            bump
        )]
        token_account_owner_pda: AccountInfo<'info>,

        #[account(mut,
            seeds=[b"token_vault", mint_of_token_being_sent.key().as_ref()],
            bump,
            token::mint=mint_of_token_being_sent,
            token::authority=token_account_owner_pda,
        )]
        vault_token_account: Account<'info, TokenAccount>,

        #[account(mut)]
        sender_token_account: Account<'info, TokenAccount>,

        mint_of_token_being_sent: Account<'info, Mint>,

        #[account(mut)]
        signer: Signer<'info>,
        system_program: Program<'info, System>,
        token_program: Program<'info, Token>,
        rent: Sysvar<'info, Rent>,
    }
}
