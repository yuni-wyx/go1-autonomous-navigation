# Go1 Autonomous Navigation Site

This directory contains the visitor-facing Go1 research portfolio site.
It presents two related studies and a shared note archive without exposing the underlying repository layout to readers.

## Site Pages

- `index.html`
  - portfolio overview and study map
- `imitation-learning.html`
  - Study 1: motion learning and real-time robot deployment
- `vlm-social-navigation.html`
  - Study 2: social-navigation benchmark results plus controller-side integration framing
- `research-notebook.html`
  - shared technical archive across both studies
- `note-view.html`
  - note reader that renders markdown notes inside the site layout

## Markdown Archive

- `docs_note/`
  - source notes used by `note-view.html`
  - keep markdown here as the source of truth for notebook content

Current notebook topics include:

- imitation-learning overview
- VLM social-navigation overview
- model and pipeline notes
- data and telemetry notes
- experiments and benchmark notes
- deployment boundary notes
- future work notes

## Artifacts

- `assets/`
  - site images, diagrams, and local media
- `assets/vlm-final-report.pptx`
  - editable source slides for the final presentation
- `assets/vlm-final-report.pdf`
  - visitor-facing PDF export of the final presentation
- `assets/vlm-social.mp4`
  - local study media for the VLM social-navigation page
- `docs_note/future_work.md`
  - future directions note for the shared research archive
- `research-notebook.html`
  - links out to the slides and technical notes

## Maintenance Notes

- Keep navigation labels consistent:
  - `Overview`
  - `Imitation Learning`
  - `VLM Social Navigation`
  - `Research Notebook`
- New technical writeups should usually be added under `docs_note/` and opened through `note-view.html`.
- Visitor-facing content should avoid local filesystem paths or implementation-only workspace references.
- Study 2 wording should keep the distinction clear:
  - reported benchmark: offline
  - broader study: offline evaluation plus online integration experiments
  - no raw VLM closed-loop motor-control claim
