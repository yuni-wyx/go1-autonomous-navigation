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

- [Go1 overview](index.html)
- [Study 2 page](vlm-social-navigation.html)
- [Experiments and results](note-view.html?doc=docs_note/experiments.md&title=Benchmark%20Setup%20and%20Results&subtitle=Offline%20VLM%20evaluation%20notes&summary=This%20note%20summarizes%20the%20saved%20benchmark,%20core%20metrics,%20and%20failure%20cases%20from%20the%20VLM%20study.&parent=VLM%20Social%20Navigation&parentHref=vlm-social-navigation.html&focus=benchmark-setup)
- [Deployment notes](note-view.html?doc=docs_note/deployment.md&title=Deployment%20Boundary&subtitle=Real-time%20control%20versus%20offline%20VLM%20evaluation&summary=This%20note%20explains%20why%20the%20VLM%20layer%20stayed%20offline%20and%20how%20safety%20projection%20fits%20the%20system%20view.&parent=VLM%20Social%20Navigation&parentHref=vlm-social-navigation.html&focus=what-the-vlm-capstone-proposes)
- [Model notes](note-view.html?doc=docs_note/model.md&title=Decision%20Policy%20Design&subtitle=Pretrained%20VLM%20reasoning%20module&summary=This%20note%20covers%20the%20pretrained%20VLM%20choices,%20decision%20representation,%20and%20why%20the%20model%20was%20used%20as%20a%20semantic%20module.&parent=VLM%20Social%20Navigation&parentHref=vlm-social-navigation.html&focus=vlm-social-navigation-model)
