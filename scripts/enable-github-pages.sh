#!/bin/sh
# Run only after the organization owner has allowed public GitHub Pages.
# This script never changes organization policy or repository visibility.
set -eu
repo=mastermindx-market-intelligence/aerlor
org=mastermindx-market-intelligence
allowed=$(gh api "orgs/$org" --jq '.members_can_create_public_pages')
if [ "$allowed" != "true" ]; then
  printf '%s\n' 'BLOCKED: organization policy does not allow public Pages creation.' >&2
  printf '%s\n' 'An organization owner must review that policy; no permission change was attempted.' >&2
  exit 2
fi
status=$(gh api "repos/$repo/pages" --jq '.build_type' 2>&1) || {
  case "$status" in
    *'HTTP 404'*) gh api --method POST "repos/$repo/pages" -f build_type=workflow >/dev/null; status=workflow ;;
    *) printf '%s\n' "$status" >&2; exit 1 ;;
  esac
}
if [ "$status" != "workflow" ]; then
  printf '%s\n' 'Existing Pages source is not GitHub Actions. Review repository Pages settings before continuing.' >&2
  exit 2
fi
gh variable set AERLOR_ENABLE_GITHUB_PAGES --body true --repo "$repo"
gh workflow run site.yml --ref main --repo "$repo"
printf '%s\n' 'Pages workflow dispatched. A successful job and live browser verification are still required.'
