---
layout: "article"
title: "The PHP security flaws that took down the internet: what you should know"
description: "What the October 2026 PHP vulnerabilities mean, which releases contain the fixes, and how to confirm your website is patched."
deck: "What the vulnerabilities mean, which releases contain the fixes, and what to ask your hosting provider."
topic: "Security"
topics: ["Security", "PHP"]
date: "2026-10-22T07:38:00-04:00"
permalink: "/blog/php-security-updates/"
draft: false
published: true
publish_order: 0
reading_lane: "personal"
render_with_liquid: false
visual_pilot: false
---
Your website can look fine and still need an urgent security update. Pages load, customers can sign in, and nothing appears broken. That doesn't tell you whether the software running the site has a known vulnerability.

On October 21, 2026, the PHP team released fixes for two critical vulnerabilities that can allow unauthenticated remote code execution. If your website or application uses PHP, you need to confirm that the PHP installation serving it has received those fixes.

You don't need to become a PHP developer to ask the right questions. You do need to know who is responsible for the update and what they checked.

## What PHP does, and why this might affect your site

PHP is software that runs application code on a server. It powers WordPress and many other websites and business applications. When you visit one of those sites, PHP may process the request, retrieve information, and generate the page your browser receives.

That work happens behind the scenes. You might own a PHP-based website without ever having installed PHP yourself. A hosting provider, an agency, or a developer may manage it for you.

The PHP team's advisory covers installations serving web requests, including PHP-FPM, Apache with mod_php, php-cgi, FrankenPHP, and LiteSpeed. Those names describe different ways servers run PHP. If they aren't familiar, ask whoever manages your hosting rather than assuming the advisory doesn't apply.

## What these vulnerabilities can allow an attacker to do

The two issues are tracked as CVE-2026-109618 and CVE-2026-109619. A CVE identifier gives vendors and customers a shared reference for a specific vulnerability.

Both issues involve PHP's internal handling of memory and request data. One concerns cleanup after a memory failure interrupts initialization. The other concerns internal state that can remain after the memory behind it has been freed.

The practical concern is remote code execution. Under exploitable conditions, an attacker could get the server to run code they control. "Unauthenticated" means they don't need to sign in first.

The PHP team considers the risk highest for Apache with mod_php. It reports a demonstrated exploit that can trigger before any application code runs. That matters because a login screen or a permission check inside your application cannot be relied on to stop that attack path.

The technical advisory also distinguishes between server configurations. For the out-of-memory vulnerability, PHP-FPM exits the worker when request startup fails, which blocks the demonstrated startup attack path. The advisory still identifies PHP-FPM as susceptible to failures after startup, although it does not report a complete PHP-FPM exploit for that vulnerability. A difference in exploitability is not a reason to skip the update.

The advisory does not mean every PHP website has been compromised. It does mean waiting for visible symptoms is the wrong way to decide whether to patch.

## Which versions contain the fixes?

The October 21 security releases are:

| PHP branch | Release containing the fixes |
| --- | --- |
| 8.2 | 8.2.35 |
| 8.3 | 8.3.36 |
| 8.4 | 8.4.27 |
| 8.5 | 8.5.12 |

These are the releases named in this advisory, not a permanent list of the latest PHP versions. When you act, check for the current security release in your supported branch.

There is also a reason not to judge patch status by the version number alone. Linux distributions and long-term support vendors may backport fixes. That means they apply a security fix to the version they already maintain without adopting the newer upstream version number.

An older-looking version may therefore include the fixes. Ask for the vendor's security notice or package release confirming coverage of both CVEs. "We keep everything updated" is less useful than confirmation about the package actually running your site.

PHP 8.1 and older no longer receive regular updates from the PHP project. If you're on one of those branches, ask whether your vendor supplies these fixes and plan a move to a supported version. Don't assume an old installation has coverage.

### You can also build the fixes for some older versions

Because of the severity of these vulnerabilities, the PHP security team provided minimal source backports for [PHP 7.4](https://github.com/php/php-src/tree/PHP-7.4-CVE-2026-109618-109619), [PHP 8.0](https://github.com/php/php-src/tree/PHP-8.0-CVE-2026-109618-109619), and [PHP 8.1](https://github.com/php/php-src/tree/PHP-8.1-CVE-2026-109618-109619). These let teams build PHP from source with the fixes for both CVEs, including teams without access to a long-term support vendor.

These are source backports, not regular supported releases or a return to ongoing security support for those branches. If you need this route, have whoever maintains your PHP installation build, deploy, and verify the patched version. It addresses these two vulnerabilities, not every security issue an older installation may have. You still need a plan to move to a supported branch.

## Updating WordPress isn't the same as updating PHP

Your website has more than one layer of software. WordPress, its plugins, and its themes are separate from the PHP runtime that executes them.

Updating those application components is still necessary, but it doesn't establish that PHP itself has been patched. The reverse is true too. A PHP update doesn't fix an unrelated vulnerability in a plugin.

The same distinction applies to custom applications. A developer can deploy new application code while the server continues running an old PHP package or container image.

The question here is specific: has the PHP runtime serving this website received the fixes for both CVEs?

## A firewall isn't confirmation that PHP is patched

A web application firewall filters incoming requests. Updating PHP changes the runtime that processes them. These are different controls, so confirmation that a firewall is enabled doesn't answer whether the PHP fixes are installed.

If your provider says its firewall protects you, ask which vulnerabilities its rules cover and whether the underlying PHP update is complete. The PHP team says updating to a release containing the patch is the only complete mitigation for the out-of-memory vulnerability. Treat filtering as an additional defense, not a reason to leave PHP unpatched.

## What to send your hosting provider

If someone else manages the server, you can send them this:

> Does my website or application use PHP? If so, have you applied the fixes for CVE-2026-109618 and CVE-2026-109619? Please confirm the PHP version and package or container release serving my site, whether both fixes are included, and whether the required service restarts or redeployments are complete. If your vendor backported the fixes, please share the relevant security notice.

If you have multiple sites or environments, ask which ones the answer covers. Confirmation for your main website doesn't necessarily cover an older customer portal or a separate staging server.

If the provider says patching is your responsibility, identify who has the access and knowledge to do it. A hosting account doesn't always include runtime maintenance.

## If you manage the server yourself

Start with the PHP advisory and your operating system or hosting vendor's update instructions. Then verify the installation that actually handles web traffic.

Running `php -v` in a terminal is useful, but it reports the command-line PHP version. A web server may use a different version, installation, or container. That command alone isn't proof that the website is patched.

A practical update check should cover:

- The PHP package or image serving each application, including any vendor backport confirmation.
- Installation of the fixed release and the required restart or replacement of running PHP workers and containers.
- Verification that the running web application now uses the patched installation.
- Checks of important application workflows after the update, such as sign-in, form submissions, and uploads.

Use your normal backup and recovery precautions, and test compatibility where you can. Don't let an open-ended testing plan become a reason to leave a critical update without an owner or a deadline.

The advisory includes temporary measures for teams that cannot update immediately. The PHP team explicitly says those measures do not make an installation safe. They reduce exposure to specific attack paths, and some have operational tradeoffs. Don't copy a configuration change from a social post and treat it as a replacement for patching.

## Patching and checking for compromise are different jobs

Applying a fix addresses the vulnerability going forward. It doesn't establish whether someone exploited it before the update.

If you find unexpected files, unexplained administrative activity, or other signs of compromise, preserve the relevant logs and get help investigating. Don't assume installing the patch removes an attacker's changes.

For a website owner, the immediate goal is a concrete answer: which installation serves your site, whether it includes both fixes, and who verified that the updated software is running.

If that's where you're stuck, you're not sure whether this applies to you, or you don't know where to start, message me. I'm more than happy to lend a hand.

## Sources

- [PHP security advisory, October 21, 2026](https://www.php.net/archive/2026.php#2026-10-21-5)
- [CVE-2026-109618 technical advisory](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w)
- [CVE-2026-109619 technical advisory](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp)
