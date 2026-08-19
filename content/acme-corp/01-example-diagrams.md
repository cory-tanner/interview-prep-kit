---
title: "Diagram Class Reference"
section: "Crash Course"
company: "Acme Corp"
---

# Diagram class reference

Raw HTML in lesson markdown passes straight through to the rendered page, so
these classes (defined globally in `app/diagrams.css`) can be used directly
in any lesson file. This page exercises every one of them.

## diagram-compare

Two-up comparison cards.

<div class="diagram-compare">
  <div class="diagram-compare__card">
    <div class="diagram-compare__title">REST</div>
    <div class="diagram-compare__content">Resource-oriented, multiple endpoints, HTTP verbs carry meaning.</div>
  </div>
  <div class="diagram-compare__card">
    <div class="diagram-compare__title">GraphQL</div>
    <div class="diagram-compare__content">Single endpoint, client specifies the exact shape of the response.</div>
  </div>
</div>

## diagram-flow

Sequential step flows.

<div class="diagram-flow">
  <div class="diagram-box">Request</div>
  <div class="diagram-arrow">→</div>
  <div class="diagram-box diagram-box--highlight">Auth Middleware</div>
  <div class="diagram-arrow">→</div>
  <div class="diagram-box">Handler</div>
  <div class="diagram-arrow">→</div>
  <div class="diagram-box">Response</div>
</div>

## diagram-tier

Big-O / complexity bar comparisons.

<div class="diagram-tier">
  <div class="diagram-tier__label">O(1)</div>
  <div class="diagram-tier__bar" style="width: 10%"></div>
</div>
<div class="diagram-tier">
  <div class="diagram-tier__label">O(log n)</div>
  <div class="diagram-tier__bar" style="width: 30%"></div>
</div>
<div class="diagram-tier">
  <div class="diagram-tier__label">O(n)</div>
  <div class="diagram-tier__bar" style="width: 55%"></div>
</div>
<div class="diagram-tier">
  <div class="diagram-tier__label">O(n log n)</div>
  <div class="diagram-tier__bar" style="width: 75%"></div>
</div>
<div class="diagram-tier">
  <div class="diagram-tier__label">O(n²)</div>
  <div class="diagram-tier__bar" style="width: 100%"></div>
</div>

## diagram-node

Tree / graph nodes.

<div class="diagram-flow">
  <div class="diagram-node">8</div>
  <div class="diagram-arrow">→</div>
  <div class="diagram-node diagram-node--small">3</div>
  <div class="diagram-node diagram-node--small">10</div>
</div>

## diagram-label

A caption above a diagram.

<div class="diagram-label">Two Pointers — converging from both ends</div>
<div class="diagram-flow">
  <div class="diagram-box diagram-box--highlight">left</div>
  <div class="diagram-box">mid</div>
  <div class="diagram-box diagram-box--highlight">right</div>
</div>

## A code block, for good measure

```js
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);
  }
  return [];
}
```
