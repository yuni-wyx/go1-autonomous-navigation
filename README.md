# Unitree Go1: Vision-Based Navigation (ROS + Deep Learning)

This project is a hands-on robotics + machine learning exploration using Unitree Go1.
I collected real-world data with ROS (Melodic), trained a ResNet-18 vision model with PyTorch, and deployed the model back onto the robot for on-device inference.

## Highlights
- Collected real-world robot data using joystick teleop + `rosbag`
- Built a dataset pipeline: ROS image topics → extracted frames → training set
- Trained a ResNet-18 model (PyTorch) and achieved strong validation accuracy
- Deployed the model onto Go1 and successfully ran inference on the robot

## Technical Blog (GitHub Pages)
Full write-up:
- https://yuni-wyx.github.io/go1-autonomous-navigation/

## Tech Stack
ROS Melodic · Python · PyTorch · OpenCV · ResNet-18 · rosbag · Teleop/Joystick

## Repo Structure
- `docs/`: GitHub Pages blog
- `assets/`: figures (pipeline diagram, results, etc.)

## Notes
This write-up focuses on the end-to-end system: data collection, dataset construction, model training, and on-robot deployment.
