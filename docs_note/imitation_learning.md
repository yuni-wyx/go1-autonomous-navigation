# Imitation Learning Navigation

## Working Question

Can a quadruped robot learn useful navigation behavior from demonstration data instead of relying entirely on hand-designed rules?

## What this study focused on

This phase is about low-level navigation behavior on Go1:

- moving forward when the path is open
- slowing or stopping when local conditions worsen
- reacting to obstacles in real time
- keeping motion stable enough to use on hardware

## Why imitation learning was useful here

Manual navigation logic is difficult to tune on a real robot.
Latency, sensing noise, and imperfect actuation mean that a controller has to work as a whole runtime system, not just as an offline model.
Imitation learning provides a way to learn motion behavior directly from collected demonstrations.

## System design

Supported elements from the existing project include:

- Go1 robot data recorded through ROS and rosbag workflows
- front-camera imagery aligned with motion-command supervision
- a lightweight visual policy built around `ResNet-18`
- short temporal history or GRU-style context where useful
- deployment-side smoothing, clipping, and conservative filtering

The model family was chosen mainly because it could plausibly run online on the robot.

## Low-level signals

The earlier system kept several reactive signals visible:

- `traversability`
- `obstacle risk`
- `stability`

These helped describe whether the robot was moving safely and reliably enough to be usable.
They were important, but they did not provide a full semantic understanding of human behavior.

## What this phase achieved

This phase established a real-time navigation pipeline and exposed what low-level learned control could and could not represent.
It showed that deployment concerns such as runtime smoothing, clipping, and loop stability mattered just as much as the learned policy itself.

## Limitations

The main limitation was not only control quality.
It was representation.

- the behavior remained mostly reactive
- humans were not represented as explicit social agents
- the system did not reason directly about crossing, yielding, or ambiguity

That is what motivated the later VLM-based social-navigation study.

## Related pages

- [Go1 overview](../index.html)
- [Study 1 page](../imitation-learning.html)
- [Model notes](model.md)
- [Data notes](data.md)
- [Deployment notes](deployment.md)
