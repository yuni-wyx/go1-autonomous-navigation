# Unitree Go1: Learning Robotics Through Vision + Deep Learning (ROS Melodic, ResNet-18)

I built this project to deepen my understanding of robotics and to apply machine learning in an embodied system.
Starting from teleoperation and data collection, I created a dataset from ROS bags, trained a vision model (ResNet-18), and deployed it back onto the Unitree Go1 to run inference on the robot.

---

## 1. Motivation

I started this Go1 project with two goals:

1) **Learn robotics by building a real end-to-end system** (not just simulation or isolated scripts)  
2) **Apply machine learning to a physical robot** and understand practical constraints like data quality, latency, and deployment

This project is intentionally "systems-first": I wanted to experience the full pipeline from data → model → robot.

---

## 2. System Overview

**Hardware**
- Unitree Go1 (camera input)

**Software**
- ROS Melodic
- Python + PyTorch (training/inference)
- OpenCV (image processing, dataset extraction, debugging)
- Joystick / Teleop for data collection

**High-level pipeline**
1) Teleop the robot and record ROS bags  
2) Extract camera frames from ROS bags into a dataset  
3) Train a ResNet-18 vision model  
4) Deploy the trained model to Go1 and run inference successfully

> (Optional figure to add later: `assets/pipeline.png`)

---

## 3. Data Collection (Teleop + rosbag)

I collected real-world data by manually controlling Go1 using joystick teleoperation while recording ROS topics with `rosbag`.

**Why teleop + rosbag?**
- It’s the fastest way to gather realistic robot data
- Captures real environment conditions and sensor noise
- Allows iterative improvement: record → review → recollect

**What I recorded**
- Camera image stream (primary training signal)
- (Optional / if available) command / motion topics for analysis

---

## 4. Dataset Construction (rosbag → images)

After recording, I extracted images from rosbag files and organized them into a training-ready dataset.

**Key steps**
- Parse ROS image topics from bags
- Convert ROS image messages to image arrays
- Use OpenCV to save frames and validate data quality (resolution, blur, lighting)

**Why OpenCV here?**
- Reliable image conversion + resizing/preprocessing
- Quick visualization to spot corrupted frames or misalignment
- Standard preprocessing utilities for ML training

---

## 5. Model Training (ResNet-18, PyTorch)

I trained a ResNet-18 model in PyTorch and achieved strong accuracy.

**Why ResNet-18?**
- Strong baseline for vision tasks
- Efficient enough to consider real-time or near-real-time inference
- Easy to iterate and debug

**Training outcome**
- Achieved high accuracy on validation data
- The model generalized well enough to be tested on the robot

> (Add later) Metrics table + confusion matrix + example predictions in `assets/results.png`

---

## 6. On-Robot Deployment & Inference

A key milestone was deploying the trained model back onto Go1 and running inference successfully.

**What worked**
- Model could run on the robot and produce stable predictions
- End-to-end pipeline was functional: sensor → model → output

**Why this matters**
Training is only half the story — deployment on a real robot introduces practical constraints:
- compute limits
- dependency management
- real-time behavior
- robustness to changing lighting/environment

---

## 7. Lessons Learned

- Robotics projects require *systems thinking*: data, tools, and deployment matter as much as model choice
- Real-world data quality is a major driver of performance (lighting, motion blur, camera angle)
- Simple, strong baselines (ResNet-18) can be highly effective when the pipeline is solid

---

## 8. Future Work

- Improve generalization across different environments (indoors/outdoors, lighting changes)
- Add richer supervision or self-supervised learning
- Explore more advanced policies (e.g., diffusion policy / VLA-style approaches)
- Expand from perception-only to perception + control loops

---

## Links
- Code & assets: https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>
