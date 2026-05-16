# Go1 Research Report Overview

## One-Sentence Summary

This report documents two related Go1 systems. The earlier one is a real-time imitation-learning navigation pipeline that ran on the robot. The later one is a VLM-based social-navigation capstone evaluated mainly offline. The second should not be described as a deployed closed-loop controller.

---

## The Big Picture

### What this report covers

- **Phase 1:** real-time imitation-learning navigation on Go1
- **Phase 2:** VLM-based social-navigation benchmark on curated Go1 rosbags
- **Final system view:** keep the fast controller, then add a slower layer for decisions that depend on people and temporal context

### Why the project changed

The first phase was mostly a deployment problem:
can a learned visual policy run online on the robot without becoming unstable?

The second phase came from a different bottleneck.
Once the robot can move, the harder question is what its decision interface should look like when a person appears in front of it.
A stop/go output is often too coarse for crossings, receding motion, or ambiguous scenes.

---

## Phase 1: Real-Time Imitation-Learning Navigation

### What this does

- collects teleoperation data from Go1 rosbags
- trains visual navigation policies such as ResNet-18-based models
- integrates the learned policy into a real-time ROS pipeline on the robot

### What the policy is trying to control

- move forward when the path is clear
- slow or stop when needed
- turn smoothly enough to stay usable on hardware
- keep inference lightweight enough for on-robot execution

### Engineering focus

This phase is mostly about practical system issues:

- timestamp alignment
- data coverage
- runtime smoothing and clipping
- keeping the controller stable enough to actually use

---

## Why the Problem Changed

### Limitation of the earlier framing

Imitation learning can reproduce motion labels, but it does not automatically expose why the robot should stop, keep going, yield left, yield right, or defer.

### What showed up in practice

Once people entered the scene, the failure mode was not just control quality.
It became a representation problem.
A centered person, a receding person, a crossing person, and a late-entering person are different situations, but a low-level interface tends to collapse them.

---

## Phase 2: VLM Social-Navigation Capstone

### What this does

- evaluates pretrained vision-language models on Go1 image sequences
- treats social navigation as a decision-label problem rather than a direct motor-control problem
- expands the action space to:
  - `STOP`
  - `FORWARD`
  - `LEFT`
  - `RIGHT`
  - `REVIEW`

### Key architectural decision

The capstone does **not** fine-tune a new controller end to end.
Instead, it uses pretrained VLMs and changes the prompt and output interface.
That interface forces the model to account for:

- crossing direction
- receding-person recovery
- uncertainty via `REVIEW`

### What was actually evaluated

- 13 curated Go1 rosbag scenarios
- single-image and sequence-based prompting
- offline metrics such as action accuracy, unsafe-forward rate, and bag-level consensus

---

## Architectural Progression

### Phase 1

`image input -> learned visual policy -> direct real-time robot control`

### Phase 2

`image sequence -> pretrained VLM -> structured decision label -> safety-projected controller path`

### Why this split exists

This split is not aesthetic.
It comes from engineering constraints.
Raw VLM outputs are too slow and too unconstrained to trust as low-level commands, but they are still useful when the hard part is interpreting human motion over time.

---

## Offline vs. Real-Time

### Evaluated offline

- `Qwen3-VL-30B` and `InternVL-3.5-14B`
- single-image and sequence-based social-navigation policies
- 13 curated Go1 rosbag scenarios
- decision-level metrics and scenario analysis

### Deployed or safety-projected in real time

- the earlier imitation-learning stack was deployed on Go1 for real-time inference
- the later VLM work only defines a conservative path in which VLM outputs are treated as advisory signals and passed through safety logic before any executable robot action is considered

---

## Main Takeaway

The project started as a low-level navigation system and then turned into a question about decision representation.
The most useful result was not that one model “solved” social navigation.
It was learning which parts of the stack need fast reactive control, and which parts need a slower but more expressive interface for ambiguity and human motion.
