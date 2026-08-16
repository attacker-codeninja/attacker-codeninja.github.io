---
layout: post
title: "Mastering Claude Code Series - Part 3"
subtitle: "Context Engineering & Memory"
date: 2026-08-16
categories:
  - Claude Code Masterclass Series
tags:
  - Claude Code
  - Context Engineering
description: "Addressing the most burning doubts about AI behavior, context limits, and memory."
---

# Claude Code Foundation (Part <span class="strike">2</span>)

Hello Everyone! 👋 Welcome back to **Part 3** of the **Mastering Claude Code Series**.

In our previous post, we took a deep dive into the 3-Layer Architecture of Claude Code (The Brain, The Harness, and The Tools). We saw how they work together, and why understanding this is crucial for mastering AI-assisted development.

But before we dive back into the next set of foundational concepts, let's hit pause for a moment. ⏸️

Whenever you learn something completely new and paradigm-shifting (like the fact that the AI model is stateless and doesn't actually touch your files directly), it's completely natural to have questions. 

So, instead of just rushing forward to continue the foundation, **let's first address and explore some of the most burning doubts** you might have from the previous part. Clearing these up will make everything that follows much easier to understand! 💡

---

![Context Engineering Explained](/assets/img/context-engineering-explained.png)

---

### 🧐 Doubt #1: Why does AI ignore my rules even if I just told <span class="mk-bad">it?</span>

In our last post, we explained that when the AI "forgets" something, it's often because that information was pushed out of the Context Window. 


> *"The AI did not forget in the human sense. The reality is that the relevant information was simply no longer present in the reconstructed context package."*

While that is directionally correct, it is only **half the story.** 

When an AI model seems to ignore your instructions or forget a rule, there are actually **two entirely different mechanisms** at play. 

Mixing them up is a huge mistake if you want to master AI.

#### Mechanism 1: Absence (It was physically <span class="mk-bad">removed</span>)
This is what we talked about previously. As the conversation gets too long, older information is literally removed, truncated, or heavily summarized by the harness to save space. 

*   **What happens:** The information is physically missing from the package sent to the AI's Brain.
*   **The Result:** The model literally has no idea you ever gave it that instruction.

#### Mechanism 2: Dilution / Low Salience (It got <span class="mk-key">buried</span>)
This is the silent killer of AI productivity. 

In this scenario, your instruction *is* still inside the context package. It hasn't disappeared or been deleted. However, the context window has become so bloated with giant code files, error logs, and long conversations that your one small rule gets completely buried. 

**Let's understand this with a simple human example:**
Imagine you are a chef in a busy kitchen. 

*   If a waiter hands you a single sticky note that says, *"Table 4 wants no onions,"* you will easily remember it and follow the rule. 
*   But imagine if the waiter hands you a 50-page menu, 10 different recipes, a list of inventory, 20 customer reviews, and right in the middle of page 32, there is a tiny sentence that says, *"Table 4 wants no onions."* 

What happens? You didn't "forget" how to read, and the instruction wasn't deleted from the paper. But because there was so much other loud, distracting information, your brain naturally **under-weighted** that tiny instruction. It lost its importance. 

**This is exactly how an AI model's "attention mechanism" works.**

*   **What happens:** When you feed the AI thousands of lines of code and logs, its attention is spread too thin. Your specific instruction (like *"always use strict typing"*) loses its "weight" or visibility. This is called *Low Salience*.
*   **The Result:** The model didn't technically forget. It simply got overwhelmed by the noise and ignored your rule because everything else in the context was screaming for its attention.

> **💡 The Big Takeaway:** 
> When your AI misbehaves, you must diagnose it like an engineer: 
> 
> Did my instruction get physically pushed out of the context (Absence), or did it just get drowned out by too much noise (Dilution)?

---

### 🧐 Doubt #2: "But my CLAUDE.md file is in the context! Why does the AI still ignore my <span class="mk-bad">rules?"</span>

This is a fantastic question. You might be thinking: *"I put my strict rules in the `CLAUDE.md` file. I know for a fact that the harness keeps this file in the context package at all times. It is never absent. So why does the AI still ignore it?"*

If it's not an **Absence** problem, it is definitely a **Dilution** problem. Even if your `CLAUDE.md` is physically inside the context, your rules are still missing the mark for three specific reasons:

#### 1. Recency Bias (The "Shiny New Toy" <span class="mk-key">Syndrome</span>)

AI models have a strong "recency bias." This means they naturally give much more weight and importance to the *most recent* messages. 

If your `CLAUDE.md` file was loaded at the very beginning of the session (Turn 1), and you are now on Turn 50, that static instruction feels "old" to the model's attention mechanism. It is technically there, but the model cares significantly more about what you just typed 5 seconds ago.

#### 2. Instruction Competition (Tug of <span class="strike">War</span>)
In any given prompt, the model is receiving a lot of competing instructions all at once:

*   The core system rules
*   Your `CLAUDE.md` rules
*   Your actual chat message
*   The raw outputs of the tools it just ran

All these inputs are fighting to "win" the model's attention. If your `CLAUDE.md` rule is poorly written or buried, it simply loses the tug of war against the other inputs.

#### 3. AI is Probabilistic, Not <span class="mk-good">Deterministic</span>

Traditional programming code is deterministic: `If X, then execute Y`. It is a 100% mathematical guarantee. 

AI models do not work this way. They are probabilistic. When you give the AI a rule, it creates a *strong statistical tendency* for the AI to follow it, but it is **never a 100% guarantee.**

---

### 🛠️ How Do We Fix This? (The <span class="mk-good">Mitigations</span>)

If saying it once in a `CLAUDE.md` file isn't enough, how do we actually force the AI to listen? We have to use smart engineering mitigations to beat the Dilution problem:

1.  **Repeated Reminders:** If a rule is critically important, you cannot just say it once at the start of the session and hope for the best. You have to continuously re-inject it alongside your prompts. (Think of it like repeatedly reminding a child).
2.  **External Memory Files (`TODO.md` / `SESSION_LOG.md`):** Do not rely on the AI's internal context window to remember your project state. Create physical tracker files in your directory and instruct the AI to *explicitly read* them before taking any action.
3.  **Context Compaction (Clearing the Noise):** If the conversation gets too long and noisy, the best mitigation is to simply start a fresh chat session. This clears out all the "junk" data and makes your core rules "heavy" and important again!

> *Note: Even with all these tricks, missing a rule in a massive, complex project is still possible. Context management is an actively researched area in AI, not a fully solved problem!*

---

### 📚 Industry Proof: You Are Not Alone (10 Real-World <span class="mk-link">References</span>)

If you think this is just a personal theory, don't worry. The exact challenges (and solutions) we just discussed are some of the most actively researched topics in the AI industry right now. 

Here is proof from across the internet that the greatest AI minds are fighting the same battles:

1. **The "Lost in the Middle" Paper (Stanford/UC Berkeley, 2023):** A landmark academic paper mathematically proved that LLMs suffer from severe "attention decay." They remember the beginning and end of a prompt perfectly, but lose information buried in the middle (this proves our *Low Salience* concept).
2. **Context Window vs. Attention Budget:** AI researchers universally agree that a larger context window (like 1 Million tokens) does not mean a "smarter" model. It just means the model's "attention budget" is spread thinner across more data, causing massive Dilution.
3. **The `AGENTS.md` and `CLAUDE.md` Standard:** Using a dedicated instructional markdown file is now an industry-standard best practice (recommended by platforms like Cursor and GitHub Copilot) to feed rules directly into the context window, rather than relying on internal model "memory."
4. **"File-First" Memory Systems:** AI experts on Medium and X (Twitter) highly advocate using `TODO.md` and `SESSION_LOG.md` files as external "durable memory" for AI agents, specifically because the internal context is entirely stateless.
5. **The Recency Bias Phenomenon:** AI engineering blogs repeatedly highlight that LLMs (due to their Transformer architecture) naturally give heavier weight to tokens located near the very end of the prompt (the newest messages). 
6. **Prompt Engineering - "Repeated Injection":** Top prompt engineers recommend repeating critical instructions immediately before the final query. This directly combats the "Tug of War" instruction competition and forces the AI to listen.
7. **The "Sink Effect" (Attention Sinks):** AI architecture research shows that early tokens often act as "attention sinks", grabbing focus away from your actual rules. Re-injecting rules (like using system hooks) breaks this effect.
8. **Context Compaction Techniques:** Frameworks like LangChain and LlamaIndex have built-in "Conversation Summary Memory" precisely to compress old chats and prevent new rules from being diluted by old noise.
9. **Probabilistic Guardrails:** Anthropic and OpenAI documentation frequently remind developers that LLMs are non-deterministic. Even with perfect instructions, a model requires external "guardrails" (like explicit check steps) to guarantee a behavior.
10. **The "Progressive Disclosure" Pattern:** Advanced developers on Reddit and X suggest breaking down giant `CLAUDE.md` files into smaller linked documents (like `testing.md`). Why? To reduce noise and increase the *Salience* of the active rule.

The bottom line? The system isn't broken—it just requires you to stop treating it like a human with a memory, and start treating it like a machine with an attention budget!

---

### 🧠 Advanced: "Context Engineering" & Why This is Never Fully <span class="strike">Solved</span>

If you want to truly master AI, you need to learn a new term. 

Forget "Prompt Engineering", the future is **Context Engineering**.

Anthropic (the creators of Claude) officially uses this term. 

Here is the difference:
*   **Prompt Engineering:** Figuring out how to write a good instruction.
*   **Context Engineering:** Curating *everything* the model sees in its current turn, the system prompt, the tool results, the memory files, and the user input.

#### The Technical Truth: "Context <span class="mk-bad">Rot</span>"
Earlier, we called it "Dilution" or "Low Salience". The official industry term is **Context Rot**. 

> Under the hood, Transformer AI models use an attention mechanism that creates massive pairwise relationships between tokens. 
> 
> Simply put: the bigger the context window gets, the more calculations the model has to do, and its precision naturally drops. 
> 
> The context is technically there, but the model becomes "blind" to the specifics.

#### 4 Concrete Ways Anthropic Fights Context Rot (And You Should <span class="mk-good">Too</span>)
The amazing thing is that Anthropic has built-in system solutions for this, and they perfectly match the patterns we've been discussing!

1.  **Compaction:** When your chat gets too long, the harness automatically pauses and summarizes the old conversation before starting a fresh context window. *(Fun fact: If you look at Claude Code's raw system logs, you will literally see instructions telling it to do this!)*
2.  **Structured Note-Taking (Agentic Memory):** Anthropic officially recommends using external files like `NOTES.md` or `CLAUDE.md`. We independently discovered this when we started using `TODO.md` and `SESSION_LOG.md`!
3.  **Sub-Agent Architecture:** Instead of forcing one AI to do a massive job in a bloated context, you spawn smaller "sub-agents" (or use tools like fork) to do isolated tasks in clean, fresh contexts. 
4.  **Just-in-Time Retrieval:** Never load a massive file into the AI's context if you don't have to. Use tools to grab just the specific lines you need (like using `grep` or searching).

#### The Built-in Memory <span class="mk-key">Feature</span>
Did you know advanced agents have built-in memory file systems? 

In their system instructions, they are given a very specific, aggressive rule:

> *"ALWAYS VIEW YOUR MEMORY DIRECTORY BEFORE DOING ANYTHING ELSE... ASSUME INTERRUPTION: Your context window might be reset at any moment."*

The AI is literally trained to assume it will get amnesia at any second, so it must write everything important down in a physical file!

#### Why the Problem Still <span class="strike">Happens</span>
If there are so many mitigations, why does the AI still sometimes miss a rule?

Because the AI still has to *choose* what to write down in its memory files. If a compaction (auto-summarization) happens *before* the AI decides to write down a critical rule you mentioned, that rule is gone forever. 

It is a **best-effort system, not a guaranteed system.**

### 🏆 The Ultimate <span class="mk-key">Validation</span>
Anthropic has an official guide called the **"Multisession Software Development Pattern."** 

Their recommended workflow is exactly what we have been figuring out together:

1.  **Start:** Set up a progress log and feature checklist *before* writing code.
2.  **Resume:** Every new session must start by explicitly reading those files.
3.  **End:** Update the progress log before shutting down.
4.  **Verify:** Never mark a feature as "Done" until you have verified it end-to-end. 

We independently discovered the exact engineering patterns that the creators of the AI themselves recommend!  

You are no longer just a user talking to a chatbot. You are now a **Context Engineer**.

---

### 📝 Summary of Part <span class="strike">3</span>

To wrap up our deep dive into the foundations:
*   **Absence vs. Dilution:** AI doesn't "forget" like humans. Either the information was pushed out of the context (Absence), or it got buried under too much noise (Dilution / Low Salience).
*   **Recency Bias & Tug of War:** LLMs inherently favor new information. A rule stated once at the beginning of a chat will lose the "tug of war" against newer, more recent inputs.
*   **Context Engineering:** You are no longer just writing prompts. You are managing the model's entire attention budget. 
*   **The Mitigations:** Use `TODO.md` files, inject repeated reminders (hooks), and don't be afraid to clear your conversation (compaction) to keep the context clean.

We have officially finished sharpening the axe. You now know *exactly* how the AI brain works, its limitations, and how to engineer its context. 
