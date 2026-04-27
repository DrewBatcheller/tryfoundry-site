---
title: 'Claude Code hooks: 9 patterns that actually fire'
date: '2026-04-27'
---

Claude Code's `settings.json` has a hooks block. Most users never touch it. They write CLAUDE.md rules, hope Claude follows them, then find out at the worst moment that "rules" are advisory. Hooks aren't.

A hook is shell code that runs at a specific lifecycle moment (`PreToolUse`, `PostToolUse`, `Stop`, others) and can return exit code 2 to block the action. If your hook says "no force-pushing to main," Claude can't talk its way out of it. The hook fires, the action stops.

The catch: writing hooks is annoying. Shell quoting, JSON escaping, matching the right tool name with the right matcher pattern, and remembering which lifecycle you actually wanted. You don't always know what lifecycle you wanted until you've thought about exactly what Claude could do that you'd regret.

Foundry ships 9 starter hook templates. They split into three groups by what they're for: hard blocks that refuse a tool call, side-effects that run after Claude does something, and observability hooks that log or notify around the session.

## Hard blocks

All three of these use `PreToolUse` and exit code 2. The pattern: read the tool input from stdin via `jq`, match against a forbidden shape, refuse with a stderr message and exit 2. Claude sees the refusal and doesn't retry the same call.

**`block-force-push`** runs on `Bash`. It catches any command that starts with `git push --force` or `git reset --hard`. Both rewrite history; both have a tendency to look reasonable in context and devastating in retrospect. The block fires before the command runs. The tradeoff: legit force-pushes on a feature branch you own also get blocked. You either edit the matcher to allow specific branches, or you do those manually.

**`block-env-edits`** runs on `Write` or `Edit`. It refuses any file path containing `.env` or under `secrets/`. The risk it catches isn't malice; it's Claude reading a config and helpfully offering "I see this should have these new keys, let me add them" while looking at your `.env.production`. That edit silently exposes secrets to the next git diff. The hook stops it cold.

**`block-protected-paths`** is the customizable cousin. Default list is `package-lock.json`, `migrations/`, and `schema.sql`. Edit the list to fit your project. Lockfile churn from auto-fixes, irreversible migration edits, schema-of-record changes that need DBA review: these all share a property. The right answer is usually "don't touch this one, ask first." The hook makes "ask first" automatic.

## Side-effect automation

`PostToolUse` hooks that run after Claude has already done something. Used for cleanup, validation, downstream actions.

**`format-after-edit`** runs `prettier --write` on whatever file Claude just touched. Removes a class of follow-up turns ("now format that") without you having to remember. The catch: prettier failures don't surface unless you remove the `|| true` at the end. For a beta-grade hook that's the right default; for production, you probably want to know when formatting failed.

**`test-after-change`** runs `npm test` after any edit under `src/`. The hook is opinionated: if Claude touched src code, the change should pass tests before you continue. The tradeoff is real. Test runs are slow, and Claude doing rapid small edits will trigger N test runs. For most projects, the right move is a more selective trigger (changed file maps to a single test file) or running a faster check (typecheck only, lint only). The template is the starting point; you adjust per project.

## Observability hooks

`Stop`, `SessionStart`, `UserPromptSubmit`, and `SessionEnd` lifecycle events. These don't block anything. They log or notify so you can see what Claude is doing across a session.

**`notify-on-stop`** fires `osascript` to show a macOS desktop notification when Claude finishes its turn. Useful when you've fired off a long task and switched to another window. Linux equivalent is `notify-send`; Windows is a PowerShell call. The macOS default is the smallest possible reference implementation; swap the body for your OS.

**`session-start-branch-info`** prints the current git branch and dirty-file count to the session header at `SessionStart`. Tiny but high signal: every Claude Code session starts with a one-liner reminding you what state the repo is in. Cuts the rate at which you start a session, give Claude a task, then realize 10 minutes later you were on the wrong branch.

**`log-prompt-timestamp`** appends a UTC timestamp to `.claude/prompt-log.txt` on every `UserPromptSubmit`. No content, just timestamps. Lets you reconstruct after the fact: how long was that session, how many turns did I take, when did I start. Quiet, append-only, useful when you want to know what your week with Claude actually looked like.

**`session-end-git-summary`** appends `git diff --stat HEAD` to `.claude/session-log.txt` at `SessionEnd`. Closes the loop: every session ends with a snapshot of what Claude (and you) changed. Pair with the prompt-log and you have a per-session record of "started here, ended with this diff." Helpful for retrospectives, and for anyone reviewing a Claude session weeks later.

## What the templates teach

Three things show up across all 9:

**Hooks are about determinism.** Rules tell Claude what you'd prefer; hooks make a class of actions impossible. When you're writing a hook, you're answering "what should never happen, regardless of context?" That's a much narrower question than "how should Claude behave?" and a much better fit for shell code than prose.

**Templates are starting points, not endings.** Every template ships with a `# Adjust ... for your project` comment near the parts that need per-project knowledge. The matcher pattern, the protected paths list, the OS-specific notify call. These aren't decisions Foundry can make for you; they're decisions you make once and forget.

**The lifecycle moment matters more than the matcher.** Most of the time you spend writing a hook is spent figuring out which lifecycle event you actually want. `PreToolUse` is the hard-block surface. `PostToolUse` is the cleanup surface. `Stop` and the session events are the observability surface. Pick the wrong moment and your hook either fires too late to help or too often to be useful.

If you're going to write your own hooks, start by reading the 9 templates for shape, then write the one you need with a `Pre` / `Post` / `Stop` choice that matches the problem. The templates give you the boilerplate; you provide the specifics.
