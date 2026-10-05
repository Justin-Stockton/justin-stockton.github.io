---
layout: "article"
title: "Choosing an outbox relay or change-data capture"
description: "A reopened database connection and duplicate publication show what a transactional outbox guarantees, and where log-based capture fits better."
deck: "The database can commit the business row and publication intent together. It still cannot make the broker acknowledge in the same transaction."
topic: "System design"
topics: ["System design"]
date: "2026-10-05T04:22:38.401851+00:00"
permalink: "/blog/outbox-or-change-data-capture/"
draft: false
published: true
publish_order: 4
reading_lane: "generalized"
render_with_liquid: false
visual_pilot: true
---
## The book is returned before anything is published

In this synthetic library example, loan 1 moves from `borrowed` to `returned`. The required result is a durable return record plus an event that can notify the next reader.

Writing the row and then publishing directly looks straightforward. It also creates a gap. If the row commits and the publish fails, downstream systems never hear about a state that already exists. Publishing first reverses the failure: downstream work may start for a database change that later rolls back.

Reordering the lines chooses which inconsistency is possible. It does not make the two systems atomic.

The local example puts the loan update and an outbox row in one SQLite transaction. It then closes the producer connection. A reopened connection finds the pending row:

<figure class="visual-step">
<img src="/blog/visuals/outbox-commit.svg" alt="Commit the change and event intent together" loading="lazy" width="320" height="368">
<figcaption><strong>The commit contains both rows</strong>Reopening the database connection finds the returned loan and the pending event. It does not mean the broker has received anything yet.</figcaption>

</figure>

This is connection reopening inside one Python process, not a process crash or restart. The useful fact is narrower: both rows survive the first connection because SQLite committed them together.

## An explicit outbox is the direct option

An outbox is an application table containing messages that still need to leave the database. The producer's critical section is small, and the context manager commits the update and insert together:

<figure class="bat-code-figure">
<div class="bat-code-view" tabindex="0" role="region" aria-label="Commit business state and publication intent together, horizontally scrollable code">
<img src="/blog/visuals/code/the-row-committed-the-message-did-not-code-1-3ebbe5da9cd5.svg" alt="Commit business state and publication intent together with comments in Catppuccin Mocha, source lines 8 through 12" width="1069" height="203" loading="lazy">
</div>
<figcaption>Commit business state and publication intent together, from <code>main.py</code>, lines 8 through 12. Scroll sideways on a narrow screen, or open the <a href="/blog/visuals/code/the-row-committed-the-message-did-not-code-1-3ebbe5da9cd5.svg">full-size SVG</a>. Also available as <a href="/blog/visuals/code/the-row-committed-the-message-did-not-code-1-3ebbe5da9cd5.png">PNG</a> or <a href="/blog/visuals/code/the-row-committed-the-message-did-not-code-1-3ebbe5da9cd5.jpg">JPG</a>.</figcaption>
</figure>

<details class="bat-selectable-code" markdown="1">
<summary>Selectable python code and copy button</summary>

```python
def return_loan(db):
    # One local transaction makes the return and publication intent durable.
    with db:
        db.execute("UPDATE loans SET status='returned' WHERE id=1")
        db.execute("INSERT INTO outbox(id, topic, body) VALUES (101, 'loan.returned', ?)", (json.dumps({"id": 1}),))
```

</details>

I'd start here when one application owns the write, the event volume is moderate, and I want the publication state to be visible in ordinary SQL. A relay can poll pending rows, operators can inspect the oldest item, and schema validation can happen before the row is accepted.

The cost is owning that relay. Multiple workers need a claim mechanism such as a short transaction using PostgreSQL's `FOR UPDATE SKIP LOCKED`, or a lease with recovery rules. Published rows need retention and cleanup. Polling introduces some delay and database load.

[The transactional outbox pattern](https://microservices.io/patterns/data/transactional-outbox.html) also makes its most important limit explicit: the relay may publish a message more than once.

## The acknowledgement gap produces a duplicate

The relay publishes event 101 and then marks its outbox row complete. Those are writes to separate systems. The example raises a failure after publish but before the completion update:

<figure class="visual-step">
<img src="/blog/visuals/outbox-retry.svg" alt="Failure after publish creates a retry" loading="lazy" width="320" height="392">
<figcaption><strong>The duplicate is the same event, not another return</strong>The stable ID lets a consumer recognize the retry. The demo uses an in-memory set; a real consumer needs deduplication durable with its own effect.</figcaption>

</figure>

| Step in the local model | Outbox state | Deliveries of event 101 |
| --- | --- | ---: |
| Commit the producer transaction | Pending | 0 |
| Publish, then fail before marking complete | Still pending | 1 |
| Publish again, then mark complete | Complete | 2 |

The demo consumer applies one effect because both deliveries carry the same event ID. The two broker deliveries remain visible; deduplication does not make the second delivery disappear.

On the next relay call, the row still looks pending. At-least-once delivery accepts that duplicate window so a lost acknowledgement does not become a lost event. The relay source leaves that acknowledgement gap visible:

<figure class="bat-code-figure">
<div class="bat-code-view" tabindex="0" role="region" aria-label="Publish, then mark the outbox row complete, horizontally scrollable code">
<img src="/blog/visuals/code/the-row-committed-the-message-did-not-code-2-e665c9ca6d37.svg" alt="Publish, then mark the outbox row complete with comments in Catppuccin Mocha, source lines 15 through 28" width="993" height="374" loading="lazy">
</div>
<figcaption>Publish, then mark the outbox row complete, from <code>main.py</code>, lines 15 through 28. Scroll sideways on a narrow screen, or open the <a href="/blog/visuals/code/the-row-committed-the-message-did-not-code-2-e665c9ca6d37.svg">full-size SVG</a>. Also available as <a href="/blog/visuals/code/the-row-committed-the-message-did-not-code-2-e665c9ca6d37.png">PNG</a> or <a href="/blog/visuals/code/the-row-committed-the-message-did-not-code-2-e665c9ca6d37.jpg">JPG</a>.</figcaption>
</figure>

<details class="bat-selectable-code" markdown="1">
<summary>Selectable python code and copy button</summary>

```python
def relay_once(db, broker, fail_after_publish=False):
    # Pending remains queryable until a separate broker write has succeeded.
    row = db.execute("SELECT id, topic, body FROM outbox WHERE published=0 ORDER BY id LIMIT 1").fetchone()
    if not row:
        return False
    # Publishing and marking complete cannot share the SQLite transaction.
    broker.append(row)
    print("relay published event", row[0])
    if fail_after_publish:
        # The next relay call will publish this stable event ID again.
        raise RuntimeError("simulated failure after publish, before marking complete")
    with db:
        db.execute("UPDATE outbox SET published=1 WHERE id=?", (row[0],))
    return True
```

</details>

The consumer therefore needs a stable event ID and durable deduplication beside its own effect. This toy uses an in-memory set, so it forgets on restart. A real consumer would record event 101 in the same local transaction as its database change. Email, payments, and other external calls need another idempotency boundary.

<figure class="bat-code-figure">
<div class="bat-code-view" tabindex="0" role="region" aria-label="In-memory duplicate detection for the bounded demonstration, horizontally scrollable code">
<img src="/blog/visuals/code/the-row-committed-the-message-did-not-code-3-7d5a69afc431.svg" alt="In-memory duplicate detection for the bounded demonstration with comments in Catppuccin Mocha, source lines 31 through 42" width="875" height="336" loading="lazy">
</div>
<figcaption>In-memory duplicate detection for the bounded demonstration, from <code>main.py</code>, lines 31 through 42. Scroll sideways on a narrow screen, or open the <a href="/blog/visuals/code/the-row-committed-the-message-did-not-code-3-7d5a69afc431.svg">full-size SVG</a>. Also available as <a href="/blog/visuals/code/the-row-committed-the-message-did-not-code-3-7d5a69afc431.png">PNG</a> or <a href="/blog/visuals/code/the-row-committed-the-message-did-not-code-3-7d5a69afc431.jpg">JPG</a>.</figcaption>
</figure>

<details class="bat-selectable-code" markdown="1">
<summary>Selectable python code and copy button</summary>

```python
def consume(broker):
    # This in-memory set demonstrates identity, not durable consumer deduplication.
    seen = set()
    effects = []
    for event_id, topic, body in broker:
        if event_id in seen:
            print("consumer ignored duplicate", event_id)
            continue
        # A real consumer records this ID atomically with its own database effect.
        seen.add(event_id)
        effects.append((topic, json.loads(body)["id"]))
    return effects
```

</details>

The outbox is doing useful work even though it cannot promise exactly once. It makes publication intent durable with the business state and makes the remaining duplicate visible.

## Change-data capture reads the log instead of polling

The other legitimate approach is change-data capture, often called CDC. A connector reads the database's transaction log and turns committed changes into a stream. It discovers committed changes without repeatedly querying a table for pending rows.

CDC is attractive when an organization already operates log capture, needs high throughput, or wants several downstream projections from the same committed data. It can reduce application-owned relay code and avoid repeated polling queries.

It shifts complexity rather than deleting it. Someone still defines the event contract. Raw row changes can expose storage details that should not become a public API. Schema evolution, connector offsets, snapshots, and replay become operational responsibilities. If the event needs a business meaning that does not map cleanly to one changed row, an explicit outbox record may still be the clearer source.

Some systems combine them: commit a business-shaped outbox row, then use CDC to transport that table. That keeps application intent explicit while using an existing log pipeline for delivery.

## I would choose the table before the platform

For one producer and one event type, I'd use the explicit outbox shown here. It is inspectable, transactional with the business row, and does not require introducing a separate capture platform. If a reliable CDC platform already exists and the database log is the standard integration path, I'd let it move the events instead of building another poller.

Either approach still needs event identity, ordering rules, consumer idempotency, and authorization. A stored payload should contain only data the topic is allowed to expose, and the relay or connector should publish only to approved destinations.

This model does not run PostgreSQL, a broker, multiple relay workers, process failure, or a durable consumer. The list named `broker` is only a visible duplicate counter. It supports the decision at the database boundary: record publication intent in the same commit, then choose a table relay or CDC based on the infrastructure and event contract actually available.


Download the [complete runnable example](/blog/examples/transactional-outbox.zip), extract it, and run `python3 main.py` inside the extracted directory. The download includes the checks used for this walkthrough.
