# 🐕 Unitree Go1 — ROS Teleop & Data Collection Setup

This document describes how to connect a laptop to the **Unitree Go1** robot via Wi-Fi, launch teleoperation nodes, and record ROS data for later training or analysis.

---

## 0. Prerequisites

* Unitree Go1 powered on
* Laptop with:

  * Ubuntu + ROS Noetic
  * `go1_teleop` package built in a catkin workspace
* Successfully connected to **Go1 Wi-Fi**

---

## 1. Connect to Go1 Network

Connect your laptop to the Go1 Wi-Fi network.

Once connected, verify network connectivity:

```bash
ping 192.168.12.1
```

If packets return successfully, the network is ready.

---

## 2. Set ROS Master

The Go1 onboard computer runs `roscore`.
On your **local laptop**, set the ROS master to Go1:

```bash
export ROS_MASTER_URI=http://192.168.12.1:11311
```

(Optional but recommended)

```bash
export ROS_HOSTNAME=$(hostname -I | awk '{print $1}')
```

---

## 3. Source Catkin Workspace

From your catkin workspace root:

```bash
source devel/setup.bash
```

To avoid repeating this every session, add it to `~/.bashrc`:

```bash
source ~/catkin_ws/devel/setup.bash
```

---

## 4. Launch Teleoperation Stack

### 4.1 Launch Teleop Nodes

```bash
roslaunch go1_teleop go1_teleop.launch
```

This typically starts:

* velocity command publishers
* joystick / keyboard interface
* safety constraints

---

### 4.2 Run Velocity Controller

In a **new terminal** (remember to `source` again):

```bash
rosrun go1_teleop vel_controller.py
```

This node:

* processes velocity commands
* publishes `/cmd_vel`
* interfaces with Go1 low-level control

---

## 5. Record ROS Data (rosbag)

To collect data for training, debugging, or replay:

```bash
rosbag record /cmd_vel /camera/image_raw
```

This records:

* `/cmd_vel` — robot motion commands
* `/camera/image_raw` — onboard camera stream

> 💡 Tip: name bags explicitly for experiments

```bash
rosbag record -O teleop_run_01 /cmd_vel /camera/image_raw
```

---

## 6. Common ROS Topics

Verify active topics with:

```bash
rostopic list
```

Typical topics include:

* `/cmd_vel`
* `/camera/image_raw`
* `/joint_states`
* `/imu`

---

## 7. Shutdown Procedure

Stop recording first:

```bash
Ctrl + C
```

Then stop nodes in reverse order.

Power off Go1 after all ROS nodes have exited.

---

## Notes

* ROS version must match Go1 onboard ROS (Noetic)
* Ensure only **one ROS master** is active
* Network latency can affect teleop responsiveness

---

## Author

Yuni Wu
Robotics / ML
Unitree Go1 Teleoperation & Data Collection