# Using Cloudflare for Hosting Page

## Context and Problem Statement

Github Pages only allows the hosting of a single site (branch) at a time.
We wish to end-to-end test on each different branch, because testing on `main` would be moot point.
We also want to host documentation, but again run into the same issue with GitHub

## Considered Options:
- Cloning branches into seperate repos and hosting those in the Github Action
- Cloudflare Pages
- Having stunted E2E Tests

## Decision Outcome

Option: Use Cloudflare

It's fairly obvious - Cloudflare lets us have an absurd number of "preview" pages, thus we can have one for each branch (or even push).
This let's us do end to end testing fairly effectively, while also not making a heinous github action that copies things all over the place.
Cloudflare has the wrangler github action which makes deployment simple, and we can use secrets to deploy, meaning no hard coding.
Lastly, with the "infrastructure" in place, we can also host our documentation site with relative ease.
