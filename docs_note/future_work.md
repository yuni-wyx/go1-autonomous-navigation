# Future Work

## Why this remains open

The current site documents a useful split between a fast motion stack and a slower semantic decision layer.
That split is workable, but it is not finished.
The next steps are mostly about making the handoff between those layers tighter, safer, and less brittle under real runtime conditions.

## Short-term technical directions

- tighten the arbitration between the fast controller and the slower VLM reasoner
- make safety projection more explicit so high-level labels are filtered through verifiable execution checks
- improve `REVIEW` calibration so uncertainty is used more consistently instead of collapsing back to `STOP` or `FORWARD`
- reduce end-to-end latency in the online decision loop

## Perception and scenario gaps

- improve crossing detection under limited temporal evidence
- make entering-late cases less fragile
- expand scenario coverage beyond the current benchmark mix
- probe where the remaining errors come from: perception, activation, or rule application

## Longer-range system direction

- connect semantic decisions more tightly to safety-projected online control
- improve how the system reasons about human interaction rather than only local blockage
- keep the controller-side safety loop fast while allowing the semantic layer to stay slower and more deliberate

## Boundary

These are future directions, not completed work.
They describe the engineering path forward from the current split architecture rather than a finished deployment result.
