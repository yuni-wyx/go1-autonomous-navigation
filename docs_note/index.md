# Go1 Research Report Overview

This report documents two related Go1 navigation studies.
The first is an earlier imitation-learning pipeline that reached real-time deployment on the robot.
The second is a later VLM-based social-navigation capstone whose reported benchmark is offline, while the broader study also includes online integration experiments and safety-projected decision paths.
The VLM policy should not be described as a fully deployed closed-loop robot controller.

## How to read this site

- Overview page: [Go1 Autonomous Navigation Research](../index.html)
- Study 1 page: [Imitation Learning Navigation](../imitation-learning.html)
- Study 2 page: [VLM Social Navigation](../vlm-social-navigation.html)

## Study split

### Study 1: Imitation Learning Navigation

Question:
How does the robot move?

Focus:

- real-time learned control on Go1
- low-level motion behavior from demonstrations
- reactive signals such as traversability, obstacle risk, and stability

Read next:

- [Study 1 summary](imitation_learning.md)
- [Model notes](model.md)
- [Data notes](data.md)

### Study 2: VLM Social Navigation

Question:
How should the robot behave around people?

Focus:

- higher-level social decisions rather than direct motor commands
- action space `STOP / FORWARD / LEFT / RIGHT / REVIEW`
- offline benchmark on curated Go1 social-navigation bags, plus controller-side integration studies

Read next:

- [Study 2 summary](vlm_social_navigation.md)
- [Experiments and results](experiments.md)
- [Deployment boundary](deployment.md)

## Why the project evolved

The first study is mainly about whether a learned visual controller can run online on the robot without becoming unstable.
The second study comes from a different bottleneck.
Once the robot can move, the harder question becomes what decision interface it needs when people appear in the scene.
A stop/go controller can react, but it does not make crossing direction, yielding, or uncertainty explicit.

## Final system view

The most useful overall system interpretation is:

- a fast controller handles real-time motion and local safety
- a slower semantic layer handles person-dependent decision suggestions
- any VLM output should remain safety-projected rather than directly executable
