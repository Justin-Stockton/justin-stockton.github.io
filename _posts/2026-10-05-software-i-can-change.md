---
layout: "article"
title: "I want software I can change"
description: "Coding agents make me care more about software I can inspect, extend, and maintain. My editor and terminal explain why."
deck: "AI can help me change the software. I still want to understand the change and own what comes next."
topic: "Developer tools"
topics: ["Developer tools"]
date: "2026-10-05T04:22:38.401851+00:00"
permalink: "/blog/software-i-can-change/"
draft: false
published: true
publish_order: 1
reading_lane: "personal"
render_with_liquid: false
visual_pilot: false
---
## Lua followed me out of Minecraft

I learned Lua writing programs for ComputerCraft turtles in Minecraft with my friends. Those turtles could gather materials and build things based on the code I wrote. Researching how to make them do something, then watching the program run, was what got me interested in becoming a software engineer.

Years later, Lua is still in my setup. I use it to customize [Neovim](https://neovim.io/), my editor, and [WezTerm](https://wezterm.org/), my terminal. The programs are less likely to dig a hole now, but I still enjoy the same cycle. Build something, use it, find out what I got wrong, change it again.

I've spent hundreds of hours on my development environment. That's my estimate, not a time sheet. I care about speed and consistency, but I don't think every hour needs to pay for itself in saved keystrokes. I enjoy this work. It's a bit like a game for me, and the environment keeps changing as I do.

When I look at a new tool, I want useful defaults, a way to change the behavior that bothers me, and a setup that fits the machines I actually use. I also want to understand enough of the implementation to maintain the parts I change. Before I decide whether the defaults are good, I want to know what happens when I stop agreeing with them.

Working with coding agents makes me care about this more. I can ask an agent to help write a helper or explain an unfamiliar part of the code. That gives me more ways to attempt a change. It doesn't give the application an extension point it never had, or tell me whether the change is safe to keep.

## LazyVim got me into Neovim

I used [Visual Studio Code](https://code.visualstudio.com/) before Neovim. I wanted to move over, but I didn't want learning the editor and building the editor to be the same project.

A configured starting point helped. I tried [NvChad](https://nvchad.com/) and found it had more around it than I wanted. [LazyVim](https://www.lazyvim.org/) was a better fit. Both are distributions that put plugins and configuration around Neovim so you don't have to begin with an empty setup.

I also liked the work of LazyVim's maintainer, [Folke Lemaitre](https://github.com/folke). He builds a lot of tools I enjoy using, and I like how he develops them and writes the code. That matters when I'm choosing something I expect to open up and change later. I'm interested in how it works, not only whether the first screen looks good.

LazyVim gave me a way in. Now I'm working toward my own setup away from it as I learn which pieces I want.

I don't regret starting with a distribution. It let me use Neovim while I developed opinions about Neovim. Those opinions are much more useful than the ones I could have formed by choosing plugins before using the editor.

Some of the custom work is very specific to my machines. My desktop runs Windows with [WSL](https://learn.microsoft.com/windows/wsl/about), the Linux environment inside Windows. Neovim needs to use the Windows clipboard. If I'm editing an HTML file in Linux, I want a command that saves it and opens the file in Windows Chrome.

Neither change is an editor philosophy. They're things I want to do without thinking about which operating system owns the next step.

## WezTerm was available where I needed it

I probably would have tried [Ghostty](https://ghostty.org/) when I was looking for a terminal. It didn't support Windows. Its [current documentation](https://ghostty.org/docs/features) still lists macOS and Linux, with Windows support planned for the future.

WezTerm was cross-platform and customizable, and it used a language I already knew. Lua had gone from Minecraft to Neovim, so using it in the terminal was an easy next step.

I could change the keybindings, name tabs, assign colors, and make a split start in the directory I was already working in. These are small things until I have several projects open and keep reconstructing where I am.

In my current configuration, a right split inherits the active pane's WSL directory. A new named tab starts there too, then asks for a title and color. I can switch tabs directly instead of cycling through all of them. The terminal can show what job a tab belongs to rather than whatever title the last process chose.

The point isn't that these are the best keybindings. They are mine, and I can change them when they stop fitting.

The history makes that fairly clear. I added tab helpers, revised them, added pane controls, and then changed the transparency behavior. Always-on transparency became opt-in. I still have the effect when I want it, but an opaque window is the normal starting point now.

A setup screenshot would miss most of those decisions. The useful part is what happens after I've looked at the screenshot and actually worked in the terminal.

## I want the same habits on different machines

My goal is a cohesive environment that I can use across devices, servers, and operating systems. Windows, Linux, macOS, and iOS don't need to run identical applications. They do need to fit together well enough that moving between them doesn't feel like changing jobs.

That puts some fairly boring things near the top of my list. Predictable project locations. A terminal that keeps the working directory. Editor commands that cross the Windows and Linux boundary deliberately. Remote access that doesn't require a completely different set of habits.

[SSH](https://www.openssh.com/) gives me an encrypted remote shell, and [Tailscale](https://tailscale.com/kb/1151/what-is-tailscale) connects my devices through a private network. Those tools are parts of the environment too. A tool that only feels good at the desktop isn't necessarily the one I want when I'm checking something from another machine.

I can't make a phone behave like my primary workstation, and I don't need to. I want to reach the work, understand its state, and perform the next useful action. Sometimes that's a terminal. Sometimes it's a browser. Consistency is about the handoff as much as the application.

This is where customization earns its place. If a terminal opens in the wrong directory, I can fix the helper that chooses it. If the clipboard crosses an operating-system boundary badly, I can fix that boundary. I don't have to keep adjusting my behavior around it.

## An agent can help write the change. I still have to own it

A terminal helper is a small example, but it explains what I mean. I want a new pane to start in the directory where I'm working. If the terminal exposes the active pane and lets me choose the launch directory, I have a place to implement that behavior. An agent can help me work through the Lua. I can read the result, try it in the terminal, and keep the configuration in version control.

If the application gives me no way to change that behavior, a better coding model doesn't solve the same problem. I may be left maintaining a fork, patching undocumented behavior, or rebuilding more of the application than the helper was worth.

The [Pi extensions I use](/blog/my-pi-setup/) are another example. A footer belongs in an interface hook. Reporting session state belongs in a runtime event. Those extension points give a change somewhere specific to live. I can inspect the code and remove an extension without rebuilding the whole agent around it.

I think this should affect how we develop software as coding agents become more common. Useful defaults need to work on their own. After that, I want clear ways to configure or extend the behavior, with interfaces narrow enough to understand and tests that show what the change is supposed to preserve.

That includes permissions. Changing a tab label is a different decision from letting an extension run commands or read files. Generated code shouldn't acquire broader access just because it was convenient to write. I still need to understand what it can touch and what happens when it fails.

The cost of producing a patch is only part of the cost of keeping it. I own the next update, the test that missed a case, and the question of whether I still understand why the custom behavior exists. AI assistance doesn't make those responsibilities disappear.

## I don't want every customer maintaining a fork

I don't think this means every application needs a plugin marketplace, or every customer should write code to use the product. A well-designed setting may solve the problem. A supported API may be enough. Some behavior needs to remain fixed because changing it would break security, consistency, or the meaning of the data.

The point is to decide where variation belongs rather than make people work around an assumption forever. When there is a reasonable place to customize something, document it and make it testable. Keep the core rules clear. A preference about presentation should not become permission to bypass access checks.

I also want to be able to leave. If I invest time in a workflow, I want configuration and data in formats I can read and move. Otherwise, customization can leave me more dependent on the application even while it feels more personal.

My editor and terminal are unusually configurable because that suits the work I do. Someone buying a business application may want the opposite experience: get the job done with very little setup. Good defaults and deliberate extension points can support both. The customer doesn't need to see the machinery for the software to leave room for change.

## I'm allowed to enjoy the setup

There's a version of this hobby that becomes an excuse not to do the work. I can spend an evening rearranging a tab bar just as easily as anyone else. Having access to every setting doesn't make changing every setting a good idea.

But I also don't want to pretend the only legitimate reason to customize something is a productivity calculation. I like building tools for myself. I like learning enough about an editor or terminal to make it behave differently. A small piece of Lua that does exactly what I wanted is satisfying.

The maintenance comes with that. I own the custom code and the next incompatibility. A default setup would give me less to maintain. It would also leave me with some of the same annoyances I already know how to remove.

When I look at a new tool, I want to know whether I can keep adapting it without taking on more than I want to maintain. Coding agents make it easier to attempt those changes. That makes the application's own design matter more to me, especially the parts that explain what I can change safely.

Lua followed me out of Minecraft because I enjoyed making a program do something I wanted. I still do. Now I also spend more time thinking about what I will have to look after once it works.
