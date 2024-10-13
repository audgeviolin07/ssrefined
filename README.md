<h1 align="center">
  <br>
  <img src="">
  <br>
  Stellar Shine
  <br>
</h1>

<h4 align="center">🛟 Shining a spotlight to those in need 🔊</h4>

<p align="center">
  <a href="https://www.linkedin.com/in/agustin-schiariti/">
    <img src="https://img.shields.io/badge/Reach_Agustin-LinkedIn-Green">
  </a>
  <a href="https://www.instagram.com/jia.seed/">
    <img src="https://img.shields.io/badge/Reach_Audrey-On_IG-Blue">
  </a>
  <a href="https://twitter.com/The_Game_2030">
    <img src="https://img.shields.io/badge/Reach_Abdur-On_Twitter-Green">
  </a>
  <a href="https://twitter.com/whoiskevin">
    <img src="https://img.shields.io/badge/Reach_Shankar-On_Twitter-Blue">
  </a>
</p>

<p align="center">
  <a href="#Key Features">Key Features</a> •
  <a href="#Short Description">Short Description</a> •
  <a href="#Tech Stack">Tech Stack</a> •
  <a href="#User Flow">User Flow</a> •
  <a href="#Challenges">Challenges</a> •
  <a href="#FAQs">FAQs</a> •
</p>


## Key Features

* Natural disaster victims can ask international community for direct financial aid with no bloated middlemen
* Utilising Claimable Balance mechanism to issue donated funds with embedded safety features such as minimum holding period
* Ai verifies validity of user proposal by analysing live social media content on twitter
* Ai processes user proposals to determine appropriate recipients, processes receipts for corresponding reimbursement
* If receipts are deemed invalid/fraudulent then the clawback function prevents token transfer to USDC and off-ramp.

## Short Description

This project introduces a Web3-powered GoFundMe inspired platform where government ID-verified users create funding proposals, and non-verified users can donate peer-to-peer. Key challenges include user verification (via ID, proof of residency, and KYC), event verification (using Twitter API and AI), and fund mismanagement, which is addressed by a clawback mechanism if funds are misused. The platform's functions include proposal creation, donation handling, receipt uploads for proof of spending, and clawbacks in cases of fraud.

Our alternative approach replaces direct donations with a reimbursement system similar to how healthcare insurance companies operate: users upload legitimate receipts and are initially reimbursed in platform tokens. These tokens have a holding period before they can be exchanged for USDC. If receipts are deemed illegitimate, the tokens are clawed back before conversion. This model ensures more accountability while offering flexibility in fund management and safeguarding donor contributions.

## Tech Stack

* Stellar
* Stellar is great
* Stellar is actually fantastic
* clawback
* Claimable Balance
* OpenAi verification of receipt images
  
## User Flow

.... insert user flow diagram here .....

## Challenges we faced and How we overcame them

* Code breaking during integration of smart contract logic and front-end
explain solution here
* Conceptualising a secure transfer mechanism whilst combatting fraud
explain solution here
* Reliance on third-party government ID verification for users
explain solution here

## FAQs

1) Why is this necessary, and is the inclusion of stellar blockchain truely justified?

This platform ensures transparency and trust in fundraising by verifying users, events, and how funds are used—things traditional platforms often can't guarantee. Blockchain is key for secure, automated processes like clawbacks and token-based reimbursement, making it harder to misuse funds.

2) How are we ensuring the receipts are legit?

Receipts are verified using a combination of AI models and third-party verification services to detect inconsistencies, fraud, or tampering.

4) How do we determine the minimum holding period?

The minimum holding period is set based on factors like typical transaction timelines, fund management practices, and risk assessments to allow enough time for proper verification of receipts.

6) When a user donates, where does that money go?

When a user donates, the funds are held in a secure smart contract and only released to the proposal creator once receipts are verified and approved.
  
8) How are we safeguarding the claimable balance?

The claimable balance is protected using smart contracts that enforce the holding period, clawback mechanisms, and restrictions on withdrawals until all conditions are met, ensuring funds are secure from misuse.

