# **Emojicoin.fun and Liquidity Pools**

## **1️⃣ What is a Liquidity Pool in emojicoin.fun?**
A **liquidity pool** in emojicoin.fun consists of three key components:
- **APT (Aptos Token)**
- **Emojicoins**
- **LP Tokens (Liquidity Provider Tokens)**

Liquidity pools are used in **CPAMMs (Constant Product Automated Market Makers)** to facilitate decentralized trading by following the formula:

\[ x \times y = k \]

Where:
- **x** = Quantity of **APT** in the pool.
- **y** = Quantity of **Emojicoins** in the pool.
- **k** = A constant value that must remain unchanged during swaps.

When users swap tokens, the formula adjusts the token balances while maintaining the constant **k**, leading to automatic price determination.

---

## **2️⃣ What is an LP Token in emojicoin.fun?**
An **LP Token (Liquidity Provider Token)** represents a user's share of a **liquidity pool**. When a user deposits **APT** and **Emojicoins** into the pool, they receive LP tokens as proof of their liquidity contribution.

### **How LP Tokens Work**
1. **Providing Liquidity**
   - Users deposit **APT + Emojicoins** into a pool.
   - They receive **LP tokens**, which represent their share of the pool.

2. **Earning Rewards**
   - Liquidity providers earn a portion of the **0.25% swap fee** collected on trades.
   - The rewards increase the value of LP tokens over time.

3. **Withdrawing Liquidity**
   - Users can redeem LP tokens for their **APT and Emojicoins** plus any accumulated fees.
   - The number of tokens received depends on the user's **LP token share** in the pool.

4. **LP Token Burning in emojicoin.fun**
   - When an emojicoin's market cap reaches **4,500 APT**, the bonding curve transitions to a **CPAMM liquidity pool**.
   - **1,000 APT + 22.3% of the emojicoin supply** are allocated to the pool.
   - LP tokens from this initial setup are **burned** to ensure liquidity remains **permanently locked**.

---

## **3️⃣ Does Adding Fees Break x * y = k?**
### **Scenario 1: Swap with 0.25% Fee**
When a trade occurs:
1. The user **pays the fee**, which is collected by the pool.
2. The remaining trade amount follows the **x * y = k** rule.
3. The **fee is later added back**, increasing **x and y**, which in turn increases k.

For example, if a swap initially follows:
\[ x_{\text{new}} \times y_{\text{new}} = k \]

After collecting fees, the final k increases slightly, ensuring the **pool grows over time**.

### **Scenario 2: Second Swap After Fee Addition**
If a second user swaps tokens after fees were added:
1. The new trade again follows **x * y = k**.
2. The pool now has slightly more liquidity, making trades cheaper.
3. The new k value increases again after collecting the next 0.25% fee.

### **Key Takeaways**
✅ **Each swap follows x * y = k strictly.**
✅ **Fees increase k slightly, but they do not break the formula.**
✅ **This ensures long-term sustainability and rewards LPs.**

---

## **4️⃣ How to Calculate APT and Emojicoins for LP Tokens?**
When adding liquidity, users must deposit **APT and Emojicoins in the same ratio as the current pool**:

\[ \frac{\text{APT to Deposit}}{\text{Total APT in Pool}} = \frac{\text{Emojicoin to Deposit}}{\text{Total Emojicoin in Pool}} \]

For example, if the pool has:
- **100 APT**
- **10,000 Emojicoins**

A user adding **10 APT** must also deposit:
\[ \text{Emojicoins to Deposit} = 10,000 \times \frac{10}{100} = 1,000 \text{ Emojicoins} \]

### **How Many LP Tokens Do You Get?**
LP tokens represent the **percentage share of total liquidity**:

\[ \text{LP Tokens Minted} = \text{Total LP Supply} \times \frac{\text{APT Deposited}}{\text{Total APT in Pool}} \]

If the total LP supply is **1,000 LP tokens**, and the user deposits **10 APT**:

\[ \text{LP Tokens Minted} = 1,000 \times \frac{10}{100} = 100 \text{ LP Tokens} \]

### **Withdrawing Liquidity**
When a user redeems LP tokens, they receive back **APT and Emojicoins** based on their share of the pool. If they own **10% of LP tokens**, they get **10% of the total APT and Emojicoins**.

---

## **🔥 Summary**
- **Liquidity pools in emojicoin.fun use CPAMM (x * y = k).**
- **LP tokens track ownership and earn swap fees.**
- **Adding fees slightly increases k over time, growing the pool.**
- **Deposits must follow the APT-Emojicoin ratio to mint LP tokens.**
- **LP tokens can be redeemed for liquidity rewards.**

This model ensures **sustainable decentralized trading and rewards liquidity providers! 🚀**
