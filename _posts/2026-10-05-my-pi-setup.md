---
layout: "article"
title: "My Pi setup grew one annoyance at a time"
description: "A footer, a resource command, a Git guard, and some terminal glue. The small extensions are what make Pi feel like mine."
deck: "Most of this code exists because I got tired of checking or fixing the same thing."
topic: "AI and tools"
topics: ["AI and tools"]
date: "2026-10-05T04:22:38.401851+00:00"
permalink: "/blog/my-pi-setup/"
draft: false
published: true
publish_order: 3
reading_lane: "personal"
render_with_liquid: false
visual_pilot: false
---
## The footer got another change

I looked through the history of my [Pi](https://pi.dev/) configuration, and a lot of it looks like this. Add a footer. Change the footer. Simplify the footer.

Pi is the coding agent I use in my terminal. It lets me work with different models and extend the tools and interface around them. That second part has been useful in ways that don't sound especially impressive when I list them.

I wanted the current model and reasoning level visible. I wanted to see context use, token counts, cost, and the Git branch without leaving the session. Then I wanted all of that to remain readable when the terminal got narrower.

The current footer removes lower-priority pieces when they don't fit. It can put the model and statistics on separate rows. Context use changes color as it crosses 70 and 90 percent. [Starship](https://starship.rs/), the shell-prompt tool, supplies directory and Git-status information instead of making the extension invent another version of it.

The thresholds are display choices, not a claim that every model suddenly gets worse at the same percentage. I want a visible reminder of how full the session is so I can decide what to do next.

This is the sort of code that would make a terrible launch announcement. I look at it all the time.

## I wanted to see what Pi had loaded

Customizing an agent introduces an annoying question. Is this session using the configuration I think it is?

There are project instructions, skills, prompt commands, extensions, and themes. Some live in my dotfiles. Some come from installed packages. Remembering where I put them doesn't tell me what the running session can see.

So I have a `/resources` command.

It shows the session's context files and skills, prompt commands, extension sources it can identify, and available file-backed themes. If I only need one category, I can ask for it. `/resources skills` is easier than asking the agent to explain why it didn't follow a procedure it may never have loaded.

There is a limit here. Part of the extension list comes from scanning local extension files, so it isn't a complete guarantee that every file initialized successfully. The command is an inspection aid, not an extension health monitor. That's still more useful than guessing from the directory structure.

The other small adapters follow the same pattern. A [Context7](https://context7.com/) hook tells library research to try its documentation lookup before the wider web. An [RTK](https://github.com/rtk-ai/rtk) adapter asks an existing output-compaction tool whether it has a less noisy version of a command. The rewriting stays in RTK instead of being copied into my extension.

Those are narrow choices. Documentation first when it can answer the question. Less command output when it preserves what matters. I don't need either adapter to become a research platform.

## Sometimes the fix is two terminal capabilities

One extension fixes image display in WezTerm under WSL, the Linux environment running inside Windows.

The code's explanation is short. Windows ConPTY strips Kitty graphics. WezTerm accepts iTerm2 images. Under the matching environment conditions, the extension tells Pi to use the image protocol the terminal can display.

That is most of the extension.

I like this kind of customization because it solves a problem at the place where the mismatch happens. I don't need every agent task that returns an image to know about my Windows terminal. Pi's display layer can know once.

It also gives me a useful test for deciding whether something should be an extension at all. A sentence in a prompt can't change a terminal capability. The running application needs code for that. On the other hand, telling the model how I want it to investigate a bug probably belongs in a skill, not an event handler.

I don't want to build a plugin because Pi makes plugins possible. I want the behavior to tell me where the change belongs.

## Herdr needs events, not another prompt

[Herdr](https://herdr.dev/) gives me workspaces for terminal and agent work. Its Pi integration reports whether the main session is working, blocked, or idle, and associates the pane with the Pi session.

That information has to follow runtime events. The model shouldn't have to remember to announce that it started working so the workspace can update a status indicator.

The integration listens for an agent start and for the session settling. A blocked state takes precedence while the wait remains active. It keeps only the latest queued state when a socket request is already in flight, rather than sending every stale transition afterward.

There are short timeouts and one retry. When Herdr isn't available, Pi can still run. I want the status integration to help me see the work, not become a requirement for doing the work.

This file is installed and managed by Herdr. It's part of the integration I use, not a custom protocol I wrote from scratch. That matters when an update replaces it. My own hooks belong beside it rather than in a file the installer owns.

## The Git guard is where convenience becomes a boundary

A footer can display bad information without deleting a branch. A tool hook has more consequential access.

My stacked-PR guard watches for commands such as force pushes, rebases, hard resets, and forced branch deletion. Before allowing one, it can show the command and Git status and ask for confirmation.

That is something a prompt can't guarantee. An instruction can ask the agent to be careful. A hook can intercept a command before it runs.

It still isn't complete protection. A command detector can miss another way to perform the same destructive action. The extension is trusted code running with Pi's permissions. [Pi's documentation](https://pi.dev/docs/latest/extensions) makes that permission boundary clear. Calling something a plugin doesn't make its filesystem access harmless.

I still need repository protections, backups, isolation where appropriate, and a review of what I'm about to allow. The guard catches a class of easy mistakes. That's useful without being a security system by itself.

This is also why I want the extensions to stay understandable. I need to know what they can intercept and what happens if they fail. Adding a hook because it saves one click isn't enough when it gains access to every tool call.

My dotfiles have removals as well as additions. Native support for external tool servers replaced an adapter. An obsolete helper went away. I want that to keep happening. When Pi handles something directly, I would rather delete my version than maintain it out of attachment.

For now, a footer, an inspection command, a terminal fix, and a few hooks are enough to make this setup feel like mine. The next extension can wait until I know what keeps bothering me.
