# Setup (ROS Melodic + Unitree Go1)

This document describes the environment setup used for teleoperation, data collection, and deployment of the vision-based Autowalker policy on the Unitree Go1.

---

## Environment

### Operating System
- **Ubuntu 18.04**
  - Required for ROS Melodic compatibility

### ROS
- **ROS Melodic**
- Core packages:
  - `rospy`
  - `sensor_msgs`
  - `geometry_msgs`
  - `std_msgs`
  - `rosbag`
  - `cv_bridge`

### Python
- **Python 3**
- Used for:
  - Dataset extraction
  - Model training (off-robot)
  - On-robot inference (`go1_auto_walk.py`)

### Key Dependencies
- **PyTorch + torchvision** (CPU-only for deployment)
- **OpenCV (cv2)** — image processing and visualization
- **NumPy / pandas** — data processing
- **joy** — joystick input
- **teleop / custom joystick mapping** (`go1_teleop`)
- **Unitree Legged SDK (Python)** — low-level UDP control

---

## Teleoperation Setup (Xbox Controller)

Teleoperation is performed using an **Xbox joystick**, mapped to velocity commands (`geometry_msgs/Twist`) and published to `/cmd_vel`.

### Launch File

```xml
<launch>
    <node name="joy_node" pkg="joy" type="joy_node" output="screen"></node>

    <node name="multi_camera_node"
          pkg="go1_teleop"
          type="websocket_cam.py"
          output="screen" />

    <node name="joystick_node"
          pkg="go1_teleop"
          type="joystick.py"
          output="screen" />

    <!-- Enable only when running with Unitree SDK on robot -->
    <!--
    <node name="vel_controller_node"
          pkg="go1_teleop"
          type="vel_controller.py"
          output="screen">
        <env name="PYTHONPATH"
             value="/home/aaquib/unittree_ws/src/unitree_legged_sdk/lib/python/amd64" />
    </node>
    -->
</launch>
