## Data Pipeline (Teleoperation + rosbag → Dataset)

This section describes how raw robot experience was collected and transformed into a supervised learning dataset for training a vision-based policy.

---

### Recording

I collected data by manually teleoperating the Unitree Go1 using a joystick while recording ROS topics with `rosbag`. This approach allowed me to efficiently gather realistic robot data under natural operating conditions.

#### Topics Recorded

* **Camera stream**: `/camera/image_raw`

  * Primary perception input used for learning
* **Motion commands**: `/cmd_vel` (`geometry_msgs/Twist`)

  * Used as supervision targets: `[vx, vy, wz]`

#### Recommended Duration per Bag

* **3–8 minutes per rosbag**
* Shorter bags make it easier to:

  * Inspect data quality
  * Discard corrupted segments
  * Iterate quickly during recollection

#### Tips for Data Coverage

To improve dataset diversity and generalization:

* Vary **lighting conditions** (bright, dim, mixed shadows)
* Record on different **floor surfaces** (smooth, reflective, textured)
* Include **turning behaviors** (left/right curves, corridor intersections)
* Capture dynamic elements (e.g., **people walking through the scene**)
* Avoid long segments of identical motion (e.g., straight-line driving only)

---

### Extraction

Recorded rosbag files were processed offline to convert raw ROS messages into a training-ready dataset.

#### Bag → Frames

* Parsed `sensor_msgs/Image` messages from rosbag
* Converted ROS image messages into standard image arrays
* Saved frames to disk using OpenCV
* Used message timestamps to preserve temporal alignment

#### Folder Structure

The extracted dataset follows a simple, ML-friendly structure:

```
data_no_ros/
├── images/
│   ├── 1760135562.140430.png
│   ├── 1760135550.344453.png
│   └── ...
└── labels.csv
```

* **images/**: RGB frames extracted from the camera stream
* **labels.csv**: Per-frame motion labels with columns:

  * `fname`, `vx`, `vy`, `wz`

#### Timestamp Alignment

* Image frames and motion commands were aligned using **nearest-neighbor matching in time**
* This ensures each image is paired with the most relevant control command issued during teleoperation

---

### Data Cleaning

Before training, the dataset was lightly filtered to improve signal quality:

* Verified image integrity (no corrupted or unreadable frames)
* Checked for obvious motion blur or extreme lighting artifacts
* Ensured all label values (`vx`, `vy`, `wz`) were numeric and well-formed
* Optionally removed or down-weighted long static segments with near-zero motion

The goal was not heavy curation, but **maintaining a clean and realistic dataset** that reflects real robot operation.
