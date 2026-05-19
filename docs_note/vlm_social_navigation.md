# VLM Social Navigation

## Working Question

Once the robot can move, how should it decide what to do around people?

## What changed from the earlier study

The change was not simply "replace the controller with a bigger model."
The key change was the decision interface.
A stop/go framing is often too coarse for person-dependent scenes such as crossing, receding motion, or late-entering ambiguity.

## Decision representation

The later benchmark uses a five-label action space:

- `STOP`
- `FORWARD`
- `LEFT`
- `RIGHT`
- `REVIEW`

These are high-level social-navigation decisions, not raw motor commands.

## What was evaluated

This phase is primarily an offline benchmark over curated Go1 social-navigation rosbags.
Supported details from the saved run include:

- `13` curated bags
- sequence window length `10`
- max `5` frames per VLM call
- models `Qwen3-VL-30B` and `InternVL-3.5-14B`
- primary bag-level consensus accuracy `0.60`
- best primary-case accuracy `0.60`

The useful result is not that the benchmark solved social navigation.
The useful result is that it exposed where a richer interface helped and where perception reliability remained the main bottleneck.

## Observations

Grounded takeaways from the report and saved benchmark include:

- sequence context helped on the receding-person case
- crossing and entering-late cases remained difficult
- unsafe-forward behavior mattered more than raw accuracy alone
- `REVIEW` works best as an uncertainty interface, not as a sign that the model is finished
- VLM latency makes raw low-level control a poor fit

## Deployment boundary

This phase should not be described as full VLM deployment on Go1.
What was evaluated was an offline social-navigation decision policy.
The more careful system view is:

- fast controller for real-time motion and local safety
- slower VLM layer for semantic guidance
- safety projection between high-level decision and executable action

## Related pages

- [Go1 overview](../index.html)
- [Study 2 page](../vlm-social-navigation.html)
- [Experiments and results](experiments.md)
- [Deployment notes](deployment.md)
- [Model notes](model.md)
