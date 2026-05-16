# Experiments and Results

## Page Summary

The later VLM capstone is evaluated mainly as an **offline social-navigation benchmark** over curated Go1 rosbag scenarios.
The point of this page is not to present a polished leaderboard. It is to document what improved, what did not, and what the failure modes suggest.

---

## Phase 1 Context

### What Phase 1 was trying to answer

- can a lightweight visual policy be trained from Go1 data?
- can it run in real time on the robot?
- can the perception-to-action loop stay stable enough to be usable?

### What Phase 2 asks instead

The later question is narrower and more semantic:

- can pretrained VLMs produce better decision labels for human-facing scenes than a stop/go-only interface allows?

---

## Benchmark Setup

### Models compared

- `InternVL-3.5-14B`
- `Qwen3-VL-30B`
- single-image prompting
- sequence-based prompting

### Data setting

- 13 curated Go1 rosbag scenarios
- sequence length `10`
- max `5` images per VLM call

### Important note

The geometry baseline stayed in the code for compatibility, but it was not available on this bag set because the extracted benchmark did not include the LiDAR topic needed by that baseline.
That is one reason the benchmark should be read as a decision-study setup, not a full navigation-stack comparison.

---

## Key Results

### 1. Best primary-case accuracy reached 0.60

Across the 10 non-review primary bags:

- `internvl_sequence_image_navigation`: `0.60`
- `qwen_sequence_image_navigation`: `0.60`
- `internvl_single_image_navigation`: `0.50`
- `qwen_single_image_navigation`: `0.30`

### Observation

The sequence variants did better overall in this saved run, but not by a huge margin.
The result is useful, though, because it suggests the action-space redesign was not completely washed out by using multiple frames.

---

### 2. Bag-level consensus on primary scenarios was 0.60

Using majority consensus across the VLM methods:

- primary bag-level consensus accuracy: `0.60` (`6 / 10` primary bags)

### Observation

This is a decent compact summary, but it also hides disagreement.
Several bags still have mixed predictions, which is important because instability across methods often points to perception ambiguity rather than one clean policy error.

---

### 3. Unsafe-forward rate remained a core failure mode

Mean unsafe-forward rate on STOP-labeled primary cases:

- `internvl_sequence_image_navigation`: `0.610`
- `internvl_single_image_navigation`: `0.500`
- `qwen_sequence_image_navigation`: `0.432`
- `qwen_single_image_navigation`: `0.335`

### Observation

This is one of the main reasons I would not overclaim the benchmark.
Even when the decision interface is richer, several methods still push forward too often in scenes that should remain conservative.
Also, the lowest unsafe-forward number does not automatically identify the best system, because it may come with overuse of `REVIEW` or poor overall action accuracy.

---

### 4. Review handling was useful but incomplete

The benchmark contained `3` review-oriented bags.
At the bag-consensus level:

- review bags without a review consensus: `1 / 3`

### Observation

`REVIEW` helps because it gives the evaluator somewhere honest to put ambiguity.
But the results also show that adding a review channel is not the same as getting calibrated uncertainty for free.

---

### 5. Sequence helped in receding-person recovery

In the receding-person case (`bag_10`):

- both sequence methods predicted `FORWARD` correctly
- `internvl_single_image_navigation` collapsed to `STOP`
- `qwen_single_image_navigation` collapsed to `REVIEW`

### Observation

This is one of the cleanest cases where temporal context actually mattered in the way I hoped it would.
The person remains visible, so a static frame can keep the model overly conservative. The short sequence gives it a chance to see that the corridor is reopening.

---

## Failure Cases and Interpretation

### Where the VLM helped

- receding versus approaching motion became easier to separate
- lateral intent could at least be represented through `LEFT` / `RIGHT`
- ambiguous scenes no longer had to be forced into a false binary answer every time

### Where perception still failed

Several crossing and entering-late scenarios still failed at the consensus level:

- `bag_05` (`right_to_left_crossing`) -> consensus `FORWARD`, expected `STOP`
- `bag_07` (`left_to_right_crossing`) -> consensus `FORWARD`, expected `STOP`
- `bag_08` (`person_enters_frame`) -> consensus `FORWARD`, expected `STOP`
- `bag_09` (`approaching_person`) -> consensus `FORWARD`, expected `STOP`

### What those failures suggest

The main bottleneck is not only prompt wording.
It is whether the model activates strongly enough on the relevant person and motion pattern under the current sampling regime.
In other words, the interface improved faster than the perception reliability did.

### Why sequence did not always outperform single image

Sequence prompting adds temporal evidence, but it also spreads the model's attention across multiple frames.
When the person is small, late-entering, or only intermittently salient, the extra context can fail to help and can even dilute the cue that mattered.

### Why `REVIEW` is still worth keeping

Even when used imperfectly, `REVIEW` is still a better failure mode than pretending every scene has a confident `STOP` or `FORWARD` answer.
It makes the uncertainty visible instead of hiding it.

---

## Main Takeaway

The capstone does not show deployed autonomous social navigation on Go1.
What it does show is that changing the decision interface matters.
A pretrained VLM can be pushed toward more structured outputs such as `LEFT`, `RIGHT`, and `REVIEW`, but the saved runs also make it clear that person detection and temporal activation are still the main weaknesses.
