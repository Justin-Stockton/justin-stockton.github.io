---
layout: "article"
title: "Another worktree isn't another running app"
description: "Git separates the checkout. Parallel development still needs decisions about ports, databases, containers, and browser state."
deck: "The files can be separate while the two branches are still changing the same database."
topic: "Developer tools"
topics: ["Developer tools"]
date: "2026-10-05T04:22:38.401851+00:00"
permalink: "/blog/worktrees-and-runtime-isolation/"
draft: false
published: true
publish_order: 2
reading_lane: "personal"
render_with_liquid: false
visual_pilot: false
---
## I want more than one branch open

[Git worktrees](https://git-scm.com/docs/git-worktree) fit the way I'm working with coding agents. I can keep a branch checked out while another task uses a separate directory. I don't have to make the first task leave its checkout just because I want to investigate something else.

That is useful on its own. It also makes it tempting to say I've given each task its own environment.

I've given it its own files.

The distinction matters as soon as those files start an application. The second checkout can still connect to the first checkout's database, use the same host ports, or share the browser's login state. Git can't decide any of that for me.

This is what I've been thinking through in my local development tooling. I want parallel tasks, but I don't want their runtime state to interfere just because the branches are in different directories.

The first design decision is to say what each task actually owns.

## A different port only solves the listener

Imagine two branches of an application. Each has a frontend, an API, and a database. One branch changes a screen. The other adds a database migration.

Give the frontends different ports and both can open in the browser. They look separate. If the API processes still point at one database, the migration branch can change the schema underneath the screen branch.

Everything started successfully. The isolation still failed.

That is why a port list isn't enough. Each listener needs a place to bind, but successful startup doesn't establish who owns the data behind it. A mail viewer, storage emulator, or debugger may add more ports too. The frontend is only the most visible one.

[Docker Compose](https://docs.docker.com/compose/) starts related containers as a project. A distinct [project name](https://docs.docker.com/compose/how-tos/project-name/) can separate the resources Compose manages. Its default normally comes from the directory name, but an explicit name in configuration or an environment variable can override that. Two different checkouts aren't a guarantee of two project names.

And a separate Compose project doesn't automatically separate every dependency. Both projects can still use an external database, an explicitly named shared volume, or a service started outside Compose. The name is one useful part of the design, not proof that the whole stack is private.

## Data is the part I'd be most careful sharing

I don't need every task to get a completely new database. Read-only research can often use existing data. A change to a static page may not need a full stack at all.

A migration or destructive test is different. Those tasks can change assumptions that another branch relies on. Reusing data there should be a decision I can see, not an accidental consequence of copying an environment file.

Separate schemas may be enough for some applications. They still share the database instance, including settings and resources outside an individual schema. If the task changes those, separate schemas won't solve it.

Configuration needs the same care. Copying a real environment file into every worktree creates more secret-bearing copies to manage. Pointing every worktree at one mutable file creates coupling instead. I want each stack's configuration choice to be explicit, with secrets kept out of the repository.

The particular mechanism depends on the application. I don't need an elaborate configuration platform to run two branches. I do need to be able to answer which database each one will touch before an agent starts running migrations.

## The browser doesn't separate identities by port

This is an easy boundary to overlook because the URLs look different.

A page on one port and a page on another can use cookies for the same host. [Cookie matching](https://www.rfc-editor.org/rfc/rfc6265#section-8.5) includes the host and path, not the port. Opening two localhost ports does not create two independent browser identities.

That may be fine when both branches are doing ordinary work as the same user. It is less fine when a task changes session behavior, authentication, or tenant selection. The browser can carry state between the two applications while the terminals look perfectly isolated.

Separate browser profiles can help. Separate hostnames can help too, with cookie scope configured correctly. Neither should be treated as automatic. A cookie scoped to a parent domain may still span hostnames.

Sign-in callbacks add another constraint. Many applications use [OpenID Connect](https://openid.net/developers/how-connect-works/), an identity layer over OAuth, to sign users in through another provider. A provider may require a registered redirect URL. Changing the local host or port can mean changing that registration too.

Remote development introduces one more pair of addresses. A stack runs on one machine, and a tunnel makes it reachable from the browser machine. The forwarded port has to be available locally, and the application has to generate a callback that the browser can actually reach.

These aren't reasons to avoid parallel stacks. They're reasons to include the browser and remote connection in the definition of a stack.

## Cleanup has to say whether the data stays

A checkout is easy to see. Retained runtime state is easier to forget.

Stopping containers may leave volumes intact. Removing a worktree doesn't stop its processes. Deleting a container doesn't necessarily delete the data it used. Those are useful defaults when I want to resume work later. They are confusing when a new task accidentally inherits the old task's state.

I want stop and destroy to mean different things. Stop should let me put the work aside. Destroy should make it clear when data will be removed. A command that cleans up one task should know which resources belong to it, rather than deleting everything with a vaguely matching name.

That ownership also has to survive a failed startup. If a stack creates a network and then fails before the application starts, cleanup needs to distinguish the new network from an existing one another task uses. I want the tooling to demonstrate that behavior before I trust it with shared resources.

A small record tying the checkout to its runtime name, ports, and data can be enough. Container labels may already provide part of it. I don't need another service if a local file answers the question.

The useful result is that I can see what is running, which checkout owns it, and what will remain after I stop it. That's the environment I want an agent to enter.

Worktrees still solve the part they were designed to solve. They let me have more than one branch open. I just need the application tooling to be equally clear about everything those branches start.
