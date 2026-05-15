# Experiments and Results

## Page Summary

The later VLM capstone is evaluated primarily as an **offline social-navigation benchmark** over curated Go1 rosbag scenarios.
This page highlights the most important results without dumping the full JSON.

---

## Phase 1 Context

### What Phase 1 validated

The earlier imitation-learning phase answered a deployment question:

- can a lightweight visual policy be trained from Go1 data?
- can it run in real time on the robot?
- can the full perception-to-action loop stay stable online?

### What Phase 2 validates instead

The capstone asks a different question:

- can pretrained VLMs produce useful **high-level social decisions** from Go1 image sequences?

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

---

## Key Results

### 1. Best primary-case accuracy reached 0.60

Across the 10 non-review primary bags:

- `internvl_sequence_image_navigation`: `0.60`
- `qwen_sequence_image_navigation`: `0.60`
- `internvl_single_image_navigation`: `0.50`
- `qwen_single_image_navigation`: `0.30`

### Why it matters

The strongest results in the saved run came from the **sequence-based** policies rather than the single-image variants.

---

### 2. Bag-level consensus on primary scenarios was 0.60

Using majority consensus across the VLM methods:

- primary bag-level consensus accuracy: `0.60` (`6 / 10` primary bags)

### Why it matters

This is a good recruiter-friendly summary because it reflects scenario-level correctness rather than only per-method snapshots.

---

### 3. Unsafe-forward rate remained a core failure mode

Mean unsafe-forward rate on STOP-labeled primary cases:

- `internvl_sequence_image_navigation`: `0.610`
- `internvl_single_image_navigation`: `0.500`
- `qwen_sequence_image_navigation`: `0.432`
- `qwen_single_image_navigation`: `0.335`

### Why it matters

Lower unsafe-forward alone does not automatically mean a better policy.
For example, `qwen_single_image_navigation` had the lowest unsafe-forward rate here, but it also had only `0.30` primary-case accuracy and a high mean `REVIEW` rate (`0.403`).

---

### 4. Review handling was useful but incomplete

The benchmark contained `3` review-oriented bags.
At the bag-consensus level:

- review bags without a review consensus: `1 / 3`

### Why it matters

`REVIEW` is what lets the policy express uncertainty instead of forcing a brittle stop-or-go answer.

---

### 5. Sequence helped in receding-person recovery

In the receding-person case (`bag_10`):

- both sequence methods predicted `FORWARD` correctly
- `internvl_single_image_navigation` collapsed to `STOP`
- `qwen_single_image_navigation` collapsed to `REVIEW`

### Why it matters

This is one of the clearest examples where temporal reasoning helped the semantic policy behave more like the intended social rule.

---

## Interpretation

### Where the VLM helped

- distinguishing receding from approaching motion
- representing lateral intent through `LEFT` / `RIGHT`
- using `REVIEW` as an uncertainty fallback

### Where perception still failed

Several crossing and entering-late scenarios still failed at the consensus level:

- `bag_05` (`right_to_left_crossing`) -> consensus `FORWARD`, expected `STOP`
- `bag_07` (`left_to_right_crossing`) -> consensus `FORWARD`, expected `STOP`
- `bag_08` (`person_enters_frame`) -> consensus `FORWARD`, expected `STOP`
- `bag_09` (`approaching_person`) -> consensus `FORWARD`, expected `STOP`

### Why sequence did not always outperform single image

Sequence prompting adds temporal evidence, but it also spreads attention across multiple frames.
When the person is small, late-entering, or only intermittently salient, the extra context does not always improve activation.

### Why `REVIEW` is useful

Even when used imperfectly, `REVIEW` is a more honest interface for social-navigation ambiguity than forcing every scene into `STOP` or `FORWARD`.

---

## Main Takeaway

The capstone does not show fully deployed autonomous social navigation on Go1.
What it does show is that pretrained VLMs can act as **high-level decision policies** in an offline social-navigation benchmark, and that prompt-level design can induce structured actions such as `LEFT`, `RIGHT`, and `REVIEW` that are missing from simpler stop-or-go formulations.
