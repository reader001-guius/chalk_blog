# Pre-Investigation

## Survey

### 1. 3D-SQA

![image-20260401164147300](https://raw.githubusercontent.com/reader001-guius/markdown-images/main/img/image-20260401164147300.png)



![image-20260402140531306](https://raw.githubusercontent.com/reader001-guius/markdown-images/main/img/image-20260402140531306.png)

#### Dataset Structure

##### Scene Modalities and Scale

- ###### Synthetic 3D Datasets

- ###### Point Cloud Datasets

- ###### Multi-View Datasets

- ###### Multimodel Datasets

  - Robospatial

  - M3DBench

  - 3D-LLM









##### Query Modalities and Complexity

- Basic Text Queries

- Agent-Centric Text Queries

- Multimodel Agent-Centric Queries

- Instruction-Tuned Queries

  - Scan-Scribe
  - LEO
  - M3DBench

  Multimodel Agent-Centric Queries VS Instruction-Tuned Queries

  > ```
  >              Multimodal           Instruction-Tuned
  >              Agent-Centric        Queries
  > ──────────────────────────────────────────────────────
  > 核心问题        "查询包含什么"        "查询要求做什么"
  > 
  > 关注维度        输入模态的丰富性      任务复杂度
  > 
  > 输入特征        文字+图像+坐标        文字指令（可含多模态）
  > 
  > 任务类型        回答一个问题          执行一个任务
  > 
  > 输出类型        一个答案              答案/行动/规划/对话
  > 
  > 时间维度        单次交互              可能多步骤/多轮
  > 
  > 代表数据集      SPARTUN3D, MSQA       LEO, M3DBench, ScanScribe
  > 
  > 训练目标        理解复杂的情境输入    泛化到多种任务类型
  > ```

![image-20260402143630891](https://raw.githubusercontent.com/reader001-guius/markdown-images/main/img/image-20260402143630891.png)



#### QA Pair Creation

##### Methods

- Template-Based Generation
- Manual Annotation
  - OpenEQA
  - SQA3D
- LLM-Assisted Generation
  - Spartun3D
  - MSQA

![image-20260402152412911](https://raw.githubusercontent.com/reader001-guius/markdown-images/main/img/image-20260402152412911.png)

#### Evaluation

![image-20260402163105384](https://raw.githubusercontent.com/reader001-guius/markdown-images/main/img/image-20260402163105384.png)

![image-20260402163038807](https://raw.githubusercontent.com/reader001-guius/markdown-images/main/img/image-20260402163038807.png)

- In both benchmarks, zero-shot methods perform the worst, with significantly lower scores across all metrics. Although these models offer scalability and generalization potential, they currently struggle to capture fine-grained spatial understanding, highlighting the need for future research in effective zero-shot adaptation for 3D QA tasks.

#### Challenges

- Dataset Quality and Standardization

  Integrating these datasets into unified benchmarks can offer the much needed standardised evaluation to catapult research in this direction.

- **Enhancing 3D Awareness in Zero-Shot**

  - Future work needs to explore architectures that deeply integrate 3D features with linguistic and visual modalities to enhance generalization across diverse task
  - an apparent direction for future research is to explore the balance between multimodal alignment and pretrained models in zero-shot 3D SQA to enhance both efficiency and performance.

- **Unified Evaluation**

  Absence of standardized and 3D SQA objective-specific evaluation metrics

- Dynamic and Open-World Scenarios

- **Interpretable and Explainable 3D SQA Models**

- Multimodal Interaction and Collaboration

- **Incorporating Temporal Dynamics**

  Future research should aim to incorporate temporal dynamics into 3D SQA, allowing models to reason about scene changes over time.

### 2. 3D-LLM



Integrating 3D context via depth maps, point clouds, or voxels remains challenging

#### 3D Data Structure

 point clouds, voxel grids, polygonal meshes, neural fields, hybrid representations, and 3D Gaussian splatting.

> **2. Voxel grids：很值得做，尤其是 sparse voxel / occupancy 这条**
>
> 如果你问我哪种底层表示在“3D理解”里被低估了，我会说是 **sparse voxel**。
>  原因很简单：它比 point cloud 更规整，比 3DGS 更少 spatial ambiguity，对对象边界、占据关系、可导航性、空间邻接关系都更友好。最近的 LESV 直接把这个点说得很明确：他们转向显式 sparse voxel rasterization，就是为了缓解 3DGS 语义注册中的 spatial ambiguity 和 semantic bleeding。OpenVoxel 也说明：基于 sparse voxel 的 open-vocabulary grouping / captioning 还有很大空间，而且甚至能走 training-free 路线。
>
> 更关键的是，voxel 很适合你真正关心的那种 3D能力：
>
> - occupancy / free space / support relation
> - inside / behind / reachable / traversable
> - multi-object spatial composition
> - embodied agent 的场景地图
>
> 这类问题单张图很难稳定解决，而 voxel 天然就是“把 3D 空间本身存出来”。同时，2026 年关于 open-vocabulary occupancy 的工作也还在强调：大规模场景下这件事仍然明显 underexplored。
>
> 我的判断是：
>  **如果你想做真正偏 3D 推理、空间关系、场景理解，而不是只做漂亮渲染，voxel 路线非常值得押。**
>
> **我的评级：A。**
>  尤其适合做 scene understanding、robotics、open-vocab grounding、3D world model 接口。
>
> **5. Hybrid representations：六条里我最看好的一条**
>
> 这是我最明确推荐的。
>  原因不是它“啥都沾一点”，而是它正好对应了现在 3D理解里最真实的瓶颈：**单一表示很难同时兼顾几何精度、语义对齐、场景规模、可解释 grounding、推理效率。** 最新的 3D-LLM/3D-VLM 系统越来越明显地在走 hybrid/object-centric 这条路：Chat-Scene++ 把 scene 组织成 context-rich object sequences；很多方法把 2D 语义先验、3D 几何 backbone 和 object identifier tokens 结合起来；N3D-VLM 也在强调 native 3D object perception + explicit reasoning 的必要性。
>
> 更重要的是，这条线非常符合 benchmark 反思后的方向。
>  既然很多 benchmark 可以被 2D 或文本 shortcut“作弊”，那你真正应该做的是：让模型在 **对象、区域、关系、坐标、可见/遮挡、支持/接触、路径/可达性** 这些层面显式推理，而不是只学一个黑盒 scene embedding。hybrid 表示特别适合承载这种结构化信息，因为你可以：
>
> - 底层用 voxel / point / 3DGS 存几何
> - 中层抽 object / region / relation tokens
> - 上层让 LLM 做 grounded reasoning
>
> 这条路离“真正的 3D cognition”更近。
>
> **我的评级：S。**
>  如果你要赌未来 2–3 年最有研究生命力的一条，就是它。
>
> ------
>
> **6. 3D Gaussian Splatting：非常值得做，而且现在还早**
>
> 3DGS 这条线我会给很高评价。
>  原因是它到 2025 年才真正开始和 VLM/LLM 深度结合。GaussianVLM 明确把自己定义成首个 Gaussian splatting-based VLM，并且强调它能把场景中的每个 Gaussian primitive 做语言对齐，再稀疏化成少量 task-aware token。换句话说，**这条线才刚开始，不是已经卷烂了。**
>
> 它为什么有吸引力？
>  因为 3DGS 天然兼顾了：
>
> - 比 point cloud 更丰富的外观与空间 primitive
> - 比 NeRF 更显式、渲染更快
> - 更适合 scene-centric 建模，而不只是 object-centric 点云
>
> 这让它特别适合真实场景、embodied reasoning、scene-level QA。Survey 也把 3DGS 视为 explicit radiance field 的重要拐点，强调了其实时渲染和可编辑性优势。
>
> 但它也有明确缺口：
>  最新的 LESV 就是冲着 3DGS 的语义注册缺陷来的，指出 Gaussian 的重叠和概率性会导致 spatial ambiguity / semantic bleeding。也就是说，这条线远没成熟，恰恰说明还有很多工作可做：更好的语言对齐、更好的高斯到对象/区域抽象、更好的几何一致性、更少歧义的 scene tokenization。
>
> **我的评级：A。**
>  如果你想找“比较新、还没挤满、又确实有前景”的方向，3DGS 很合适。
>
> 

#### 3 taxonomies

![image-20260407193739362](https://raw.githubusercontent.com/reader001-guius/markdown-images/main/img/image-20260407193739362.png)

![image-20260407203931634](https://raw.githubusercontent.com/reader001-guius/markdown-images/main/img/image-20260407203931634.png)















## Overall

| Question                                             | Paper    | Solution                                                     | Wait-solution |
| ---------------------------------------------------- | -------- | ------------------------------------------------------------ | ------------- |
| task–memory mismatch inherent in fixed scene graphs. | GraphPad | a system in which a single VLM both identifies knowledge gaps and updates its 3D representation |               |
|                                                      |          |                                                              |               |
|                                                      |          |                                                              |               |

## Seperate

### 1. GraphPad

#### Core Issues

> GraphPad 真正的核心贡献是**整个感知-记忆-推理的架构重构**：
>
> ```
> OpenEQA 的根本问题（三个层面）：
> 
> 问题1：帧采样（你识别到的）
> └── 均匀采样丢失关键帧
> GraphPad解决：动态按需检索 ✓
> 
> 问题2：物体表示（更重要）
> └── 没有跨帧的物体一致性
> 同一把椅子在50帧里是50个独立的Caption
> 没有"这是同一个物体"的概念
> GraphPad解决：Object Track + 点云融合
> → 跨帧统一的物体实例
> 
> 问题3：空间结构（最核心）
> └── 物体之间没有结构化关系
> 所有信息平铺，LLM需要自己推断关系
> GraphPad解决：Scene Graph + 语义边
> → 预计算的结构化空间关系
> ```

#### Contributions

- We formulate **language-driven online editing of structured 3D memories** as a solution to the task–memory mismatch inherent in fixed scene graphs. 

- We present GraphPad, **a system in which a single VLM both identifies knowledge gaps and updates its 3D representation** via language function calls during inference.

  > ```
  > 贡献1（问题定义）：
  > 提出了"task-memory mismatch"问题
  > └── 固定的场景图无法适应不同问题的信息需求
  > └── 这是比OpenEQA更精确的问题定位
  > 
  > 贡献2（系统设计）：
  > SSM = 四个互补的结构
  > └── 每个结构解决一个具体问题
  > └── 四者协同，缺一不可
  > 
  > 贡献3（在线编辑能力）：
  > 推理时的自我感知补全
  > └── 不是预处理穷举，而是按需精确补充
  > └── 这是与所有prior work的本质区别
  > ```

#### Structure

- Structured Scene Memory(SSM)
  - Scene Graph
  - Graphical Scratch-Pad
  - Frame Memory
  - Navigation Log

##### SSM

> ## 四个子结构详解
>
> ### 结构1：Scene Graph（场景图）
>
> **定义：有向多重图 G = (N, E)**
>
> #### 节点（N）：物体轨迹
>
> ```
> 一个"物体轨迹（Object Track）"是什么？
> 
> 不是单帧中检测到的物体
> 而是跨越多帧、被持续追踪的同一物体实例
> 
> 例如：
> 帧1检测到"椅子"
> 帧5检测到"椅子"（同一把）
> 帧12检测到"椅子"（同一把）
> → 合并为一个 Track（节点 n_i）
> ```
>
> **每个节点 n_i 存储的信息：**
>
> ```
> n_i = {
> P_i：点云（Point Cloud）
> │    该物体所有帧观测的3D点的集合
> │    是物体3D形状的直接表示
> │
> V_i：视觉嵌入（Visual Embedding）
> │    CLIP ViT-L/14 提取的视觉特征向量
> │    代表物体的视觉外观
> │    多帧特征通过指数移动平均聚合
> │
> L_i：语言嵌入（Language Embedding）
> │    BGE模型提取的文字特征向量
> │    代表物体的语义描述
> │
> C_i：Caption（文字描述）
> │    物体的自然语言描述
> │    多帧Caption经过压缩整合
> │
> room/floor ID：房间和楼层标识
> │
> keyframes：该物体可见的关键帧列表
>          用于后续检索
> }
> ```
>
> #### 边（E）：空间关系
>
> ```
> 四种预定义的空间关系类型：
> 
> 1. on top of（在...上面）
>    椅子 → on top of → 地板
>    杯子 → on top of → 桌子
> 
> 2. subpart of（是...的一部分）
>    椅子腿 → subpart of → 椅子
>    抽屉 → subpart of → 桌子
> 
> 3. contained in（被...包含）
>    书 → contained in → 书架
>    衣服 → contained in → 衣柜
> 
> 4. attached to（附着于）
>    相框 → attached to → 墙
>    灯 → attached to → 天花板
> 
> 为什么只有这四种？
> └── "view-invariant"（视角不变）
>     无论从哪个角度看，这四种关系都成立
> 
> 相比之下：
> "左边/右边" → 依赖观察者视角，不稳定
> "前面/后面" → 依赖观察者朝向，不稳定
> ```
>
> **每条边存储：**
>
> ```
> edge = {
>     subject_ID：主体物体的节点ID
>     object_ID：客体物体的节点ID
>     relation_label：四种关系之一
>     justification：VLM给出的自由文本推理依据
> }
> ```
>
> ------
>
> ### 结构2：Graphical Scratch-Pad（图形草稿板）
>
> ```
> 本质：场景图的"便签纸"版本
> 
> 镜像节点集合 N（与场景图相同的节点）
> +
> 每个节点额外有一个 notes 字段
> 初始为空
> 在推理过程中由API动态写入
> 
> 例如：
> 初始状态：
> 节点"冰箱" → notes: ""
> 
> 推理过程中（回答"冰箱里有什么饮料"）：
> 节点"冰箱" → notes: "已在帧23检查，
>                        发现可乐2瓶、橙汁1瓶
>                        右侧格子空置"
> 
> 作用：
> └── 让VLM在多步推理中
>     保存中间结果
>     避免重复"查看"同一物体
>     实现类似工作记忆的功能
> ```
>
> ------
>
> ### 结构3：Frame Memory（帧记忆）
>
> ```
> 两层结构：
> 
> 第一层：初始关键帧集合
> └── n_img 帧均匀间隔采样
>     （与OpenEQA的做法相似，作为基础）
> 
> 第二层：按需追加帧
> └── 当API请求特定帧时
>     动态追加到Frame Memory中
> 
> 关键改进（对比OpenEQA的均匀采样）：
> OpenEQA：固定50帧，一次性输入
> SSM：     基础帧 + 动态追加
>           按需检索，不预设上限
> 
> "No eviction"：
> └── 追加进来的帧不会被删除
>     实验中保留所有请求过的帧
> ```
>
> ------
>
> ### 结构4：Navigation Log（导航日志）
>
> **每一个关键帧对应一条日志记录：**
>
> ```
> log[t] = {
>     room：当前帧所在房间
>     │     （由HOV-SG管道确定）
>     │
>     fov_tag：视野标签（文字描述）
>     │        "facing the kitchen counter"
>     │        "overlooking the living room"
>     │
>     motion_label：自中心运动标签
>     │             由相邻帧的位姿变化（pose delta）计算
>     │             例如："moving forward"
>     │                   "turning left"
>     │                   "ascending stairs"
>     │
>     visible_nodes：该帧中可见的物体节点ID集合
>                    [node_3, node_7, node_12, ...]
> }
> ```
>
> **Navigation Log 的核心作用：**
>
> ```
> 为VLM提供"在哪里能找到什么"的结构化索引
> 
> 传统方法（OpenEQA）：
> "冰箱在哪帧？"
> → 遍历所有50帧检查
> → 时间复杂度：O(N)
> 
> Navigation Log：
> "冰箱在哪帧？"
> → 查找 visible_nodes 包含"冰箱节点"的日志条目
> → 直接定位到帧 [23, 24, 31]
> → 时间复杂度：O(1)
> ```
>
> ------
>
> ## 构建过程：Initial Construction
>
> ### 步骤1：每k帧运行VLM检测器
>
> ```
> 输入：RGB图像 I_t
>         ↓
> VLM 检测器
>         ↓
> 输出：
> ├── 边界框（Bounding Boxes）
> └── 每个框对应的Caption
>     （描述这个物体是什么）
> ```
>
> ### 步骤2：SAM生成精确掩码
>
> ```
> 每个Bounding Box
>         ↓
> SAM（Segment Anything Model）
>         ↓
> 精确的像素级掩码
> （比矩形框更精确地描述物体轮廓）
> ```
>
> ### 步骤3：掩码反投影为点云
>
> ```
> 像素掩码 + 深度图 + 相机内参
>         ↓
> 反投影（Back-projection）
>         ↓
> 原始3D点云
>         ↓
> 体素下采样（Voxel Downsampling）
> 分辨率：0.02m（2厘米）
> 作用：减少点云密度，降低内存消耗
>         ↓
> DBSCAN噪声去除
> 只保留最大的聚类簇
> （去除漂浮的噪声点）
> ```
>
> ### 步骤4：提取特征嵌入
>
> ```
> 图像裁剪（Crop）
>         ↓
>         ├── CLIP ViT-L/14 → 视觉嵌入 V_i（视觉特征）
>         └── BGE模型（Caption文字）→ 语言嵌入 L_i
> ```
>
> ------
>
> ## 轨迹关联：Track Association
>
> **这是SSM最关键的技术之一：如何判断新检测到的物体和已有轨迹是同一个物体？**
>
> ### 投票机制
>
> $$
> S_{ij} = \mathbf{1}[V_i \cdot V_j > 0.7] + \mathbf{1}[L_i \cdot L_j > 0.8] + \mathbf{1}[G_{ij} > 0.4]
> $$
>
> ```
> 三个投票维度：
> 
> 维度1：视觉相似度
> V_i · V_j > 0.7
> └── 新检测物体的CLIP特征
>     与已有轨迹的CLIP特征
>     余弦相似度超过0.7
>     → 投1票（"看起来像同一个物体"）
> 
> 维度2：语言相似度
> L_i · L_j > 0.8
> └── Caption的语义嵌入相似度超过0.8
>     → 投1票（"描述的是同一类物体"）
> 
> 维度3：空间重叠
> G_ij > 0.4
> └── 新检测物体的点云
>     有超过40%的点
>     在已有轨迹点云的5cm范围内
>     → 投1票（"位置在同一个地方"）
> 
> 判定规则：
> S_ij > 2（即至少2票）→ 同一物体，合并到已有轨迹
> S_ij ≤ 2 → 不同物体，创建新轨迹
> ```
>
> **为什么需要三个维度而不是一个？**
>
> ```
> 只用视觉相似度的问题：
> └── 两把相同款式的椅子
>     视觉特征完全相同
>     但实际上是两个不同物体
>     → 误合并
> 
> 只用空间重叠的问题：
> └── 桌子上的物体被换掉了
>     位置相同但物体不同
>     → 误合并
> 
> 只用语言相似度的问题：
> └── 所有"黑色椅子"都会被合并
>     → 严重误合并
> 
> 三票制：
> └── 需要至少两种证据同时支持
>     大幅降低误合并率
> ```
>
> **特征更新：指数移动平均（EMA）**
>
> ```
> 匹配成功后，更新轨迹的特征：
> 
> V_j ← α × V_i + (1-α) × V_j
> L_j ← α × L_i + (1-α) × L_j
> α = 0.5
> 
> 含义：
> 新观测特征和历史特征各占50%权重
> └── 避免单帧噪声主导整个轨迹的特征
> └── 同时保持对物体外观变化的适应性
> ```
>
> ------
>
> ## 边发现：Edge Discovery
>
> ```
> 触发条件：每3帧执行一次
> 
> 输入给VLM：
> ├── 当前帧图像
> └── 当前帧可见物体的JSON列表
>     [{"bbox": [x1,y1,x2,y2], "caption": "黑色椅子"},
>      {"bbox": [x1,y1,x2,y2], "caption": "木质桌子"},
>      ...]
> 
> VLM的任务：
> 预测所有可见物体对之间的空间关系
> （从四种关系中选择）
> 
> 输出：
> 椅子 → subpart of → 地板？ ✗
> 椅子 → on top of → 地板？ ✓
> 椅子 → contained in → 房间？ ✓
> ...
> 
> 存储格式：
> {
>     subject_ID: node_3（椅子）,
>     object_ID: node_1（地板）,
>     relation: "on top of",
>     justification: "the chair is standing 
>                     on the floor surface"
> }
> ```
>
> ------
>
> ## Caption整合：Caption Consolidation
>
> ```
> 问题：
> 同一物体被观测100次
> → 积累了100条Caption
> → 大量冗余，LLM无法高效处理
> 
> 解决方案：
> 定期触发Caption压缩
> 
> 输入给VLM：
> ["一把黑色的有扶手的椅子",
>  "黑色办公椅，带轮子",
>  "椅子是黑色的，看起来是皮质的",
>  "带有五个轮子的办公椅",
>  ...]
> 
> VLM的任务：
> 将所有Caption压缩为一句话
> 
> 输出：
> "一把黑色皮质办公椅，配有扶手和五个滚轮"
> 
> 效果：
> └── 保留所有观测中的关键信息
> └── 消除重复表述
> └── 降低后续推理的输入长度
> ```
>
> ------
>
> ## 房间/楼层标注
>
> ```
> HOV-SG 管道：
> 
> 楼层检测：
> └── 对所有点云点的高度（z坐标）
>     做直方图统计
>     → 峰值对应各楼层的地面高度
> 
> 房间分割：
> └── 在水平平面上
>     对墙壁骨架做分水岭分割（Watershed）
>     → 每个封闭区域 = 一个房间
> 
> 房间类别标注：
> └── 用CLIP计算房间图像
>     与固定类别名称的相似度
>     类别集合：["bedroom", "kitchen", 
>               "living room", "bathroom", ...]
>     → 取最高相似度的类别作为房间标签
> ```
>
> ------
>
> ## SSM vs OpenEQA基线方法的对比
>
> ```
> 维度          OpenEQA（最好）    SSM
> ────────────────────────────────────────────
> 视觉输入      50帧均匀采样       关键帧+按需追加
> 物体表示      无（帧级Caption）  跨帧统一轨迹
> 3D信息        文字坐标（无效）   点云直接存储
> 空间关系      无                结构化图边
> 推理记忆      无                Scratch-Pad
> 帧检索        遍历全部帧         Navigation Log索引
> Caption       每帧独立           多帧压缩整合
> 
> 核心改进：
> └── 把"帧序列"升级为"结构化知识图谱"
> └── 解决了OpenEQA中暴露的
>     均匀采样、坐标无效、无空间结构三个问题
> ```



​    















































##### details

> ## 问题1：生成掩码的作用是什么？
>
> ### 掩码的本质
>
> ```
> 边界框（Bounding Box）：
> ┌─────────────────┐
> │                 │
> │   ┌───────┐     │
> │   │ 椅子  │     │  矩形框，包含大量背景
> │   │       │     │
> │   └───────┘     │
> │                 │
> └─────────────────┘
> 
> 像素级掩码（Mask）：
> ┌─────────────────┐
> │                 │
> │    ██████       │
> │   ████████      │  精确到每个像素
> │    ██████       │  只标记属于椅子的像素
> │      ██         │
> │                 │
> └─────────────────┘
> ```
>
> ### 掩码的核心作用：精确分离物体与背景
>
> **如果只用边界框，会发生什么：**
>
> ```
> 用边界框反投影得到的点云：
> 
> ┌───────────────┐
> │ 背景墙  椅子背 │
> │ 背景墙  椅子座 │  矩形框内的所有像素
> │ 地板    椅子腿 │  都被转换为3D点
> └───────────────┘
> 
> 问题：
> ├── 椅子的点云混入了背景墙的点
> ├── 混入了地板的点
> └── 这些杂质点会破坏3D包围盒的精度
> 椅子的包围盒会莫名其妙地扩展到墙面
> 
> 用掩码反投影得到的点云：
> 
> ██████
> ████████      只有掩码为1的像素
> ██████        对应的点被转换为3D点
> ██
> 
> 结果：
> └── 纯净的椅子点云，不含背景
> └── 3D形状精确反映椅子的真实轮廓
> ```
>
> ### 掩码在SSM中的下游影响
>
> ```
> 掩码质量 → 点云质量 → 轨迹关联质量
> 
> 如果掩码不精确：
> 椅子的点云 混入 桌子的点云
> ↓
> 计算 G_ij（空间重叠）时
> 椅子和桌子的点云有大量重叠
> ↓
> 两个不同物体被错误合并为同一轨迹
> ↓
> 场景图完全混乱
> 
> 所以SAM的作用是：
> 为后续所有3D操作
> 提供干净的物体级输入
> ```
>
> ------
>
> ## 问题2：掩码反投影为点云是什么过程？
>
> ### 正投影 vs 反投影
>
> 先理解方向：
>
> ```
> 正投影（相机成像的过程）：
> 3D世界中的点 → 通过相机 → 2D图像上的像素
> （3D → 2D，信息损失：深度丢失）
> 
> 反投影（Back-projection，逆过程）：
> 2D图像上的像素 + 深度值 → 恢复3D世界中的点
> （2D + D → 3D，信息恢复）
> ```
>
> ### 完整的反投影数学过程
>
> **输入的三样东西：**
>
> ```
> 1. 像素坐标 (u, v)
>    └── 掩码中值为1的每一个像素
> 
> 2. 深度值 d
>    └── 深度图中对应位置的距离值（单位：米）
> 
> 3. 相机内参 (fx, fy, cx, cy)
>    └── fx, fy：焦距
>    └── cx, cy：主点（图像中心）
> ```
>
> **Step 1：像素坐标 → 相机坐标系**
> $$
> X_{cam} = \frac{(u - c_x) \cdot d}{f_x}
> $$
>
> ```
> 直觉理解：
> u=320, cx=320 → (u-cx)=0 → X_cam=0
> └── 图像正中间的像素，对应相机正前方
>     X方向偏移为0
> 
> u=420, cx=320 → (u-cx)=100 → X_cam=100×d/fx
> └── 图像右侧的像素，对应相机右方
>     偏移量与深度成正比（越远，实际偏移越大）
> ```
>
> **Step 2：相机坐标系 → 世界坐标系**
>
> ```
> 用相机位姿（c_pose）中的旋转矩阵R和平移向量t：
> 
> P_world = R × P_cam + t
> 
> 含义：
> └── 把"相机视角下的3D点"
>     转换为"世界坐标系下的3D点"
> 
> 不同帧的点云通过这一步
> 统一到同一个世界坐标系
> → 可以直接比较不同帧中物体的位置
> ```
>
> **完整过程的直觉示例：**
>
> ```
> 帧23，看到椅子：
> 像素(350, 280)，深度d=1.8m
> 相机内参：fx=600, fy=600, cx=320, cy=240
> 
> Step 1：
> X_cam = (350-320) × 1.8 / 600 = 0.09m
> Y_cam = (280-240) × 1.8 / 600 = 0.12m
> Z_cam = 1.8m
> → 椅子这个点在相机正前方1.8米，
>   略微偏右0.09米，偏下0.12米
> 
> Step 2：
> 相机此时在世界坐标(3.0, 2.0, 1.5)
> 朝向正北（R=单位矩阵，简化）
> → P_world = (3.0+0.09, 2.0+0.0, 1.5-1.8)
>           = (3.09, 2.0, -0.3)
> （椅子在世界坐标系中的绝对位置）
> ```
>
> **对掩码内所有像素重复这个过程：**
>
> ```
> 椅子掩码有 2000 个像素
> ↓
> 2000次反投影计算
> ↓
> 2000个世界坐标系下的3D点
> ↓
> 椅子的原始点云（2000个点）
> 
> 体素下采样（0.02m分辨率）：
> └── 把2cm×2cm×2cm小方块内的多个点
>     合并为一个点
> └── 2000点 → 可能变为300点
> └── 大幅减少数据量，同时保留形状信息
> ```
>
> ------
>
> ## 问题3：点云直接存储是什么？
>
> ### 对比OpenEQA的存储方式
>
> ```
> OpenEQA（SVM）的存储：
> ┌─────────────────────────────────┐
> │ 椅子的信息：                     │
> │ ├── Caption: "黑色办公椅"        │
> │ └── 坐标: (2.3, 0.5, 1.1)       │
> │     （包围盒中心点，6个数字）     │
> └─────────────────────────────────┘
> 
> SSM的存储（点云直接存储）：
> ┌─────────────────────────────────┐
> │ 椅子的信息：                     │
> │ ├── Caption: "黑色办公椅"        │
> │ └── 点云 P_i：                   │
> │     [(2.28, 0.48, 0.90),        │
> │      (2.29, 0.51, 0.92),        │
> │      (2.31, 0.49, 0.88),        │
> │      (2.30, 0.52, 1.10),        │
> │      ... 共300个点]              │
> └─────────────────────────────────┘
> ```
>
> ### 点云存储的信息量对比
>
> ```
> 包围盒中心（6个数字）能告诉你：
> ├── 物体大概在哪个位置 ✓
> ├── 物体大概有多大 ✓
> └── 物体的精确形状 ✗
> 
> 点云（300个点）能告诉你：
> ├── 物体大概在哪个位置 ✓
> ├── 物体大概有多大 ✓
> ├── 物体的精确形状 ✓
> │   （300个点描述了物体的真实轮廓）
> ├── 物体的朝向 ✓
> │   （点的分布可以推断方向）
> ├── 物体是否被遮挡 ✓
> │   （被遮挡的面没有点）
> └── 两个物体的精确空间关系 ✓
>     （直接计算点云之间的距离和重叠）
> ```
>
> ### 点云直接存储的关键用途
>
> **用途1：轨迹关联中的空间重叠计算**
>
> ```
> G_ij = 新检测物体Di的点云中
>         距离已有轨迹Tj的点云5cm以内的点
>         占Di总点数的比例
> 
> 这个计算需要原始点云
> ├── 如果只有包围盒中心：
>     只能比较两个点的距离
>     无法处理大物体/不规则形状
> └── 有完整点云：
>     精确计算任意形状物体之间的真实重叠
> ```
>
> **用途2：多帧点云融合**
>
> ```
> 帧1看到椅子正面：
> ● ● ●
> ● ● ●        只有正面的点
> 
> 帧7从侧面看椅子：
>   ●
>   ●           只有侧面的点
>   ●
> 
> 帧15从后面看椅子：
>       ● ● ●
>       ● ● ●   只有背面的点
> 
> 同一轨迹，三帧点云合并：
> ● ● ● ● ● ●
> ● ● ●   ● ●  更完整的3D形状
> ● ● ● ● ● ●
> 
> 点云直接存储 → 支持这种跨帧融合
> 包围盒中心 → 无法融合，只能平均（信息损失）
> ```
>
> ------
>
> ## 问题4：SSM如何真正解决坐标无效和无空间结构的问题？
>
> 这是最核心的问题。需要分层理解。
>
> ### 坐标无效问题的根本原因（回顾）
>
> ```
> OpenEQA中为什么坐标无效？
> 
> LLM收到的输入：
> "椅子 @ (2.3, 0.5, 1.1)"
> "桌子 @ (2.0, 0.0, 0.8)"
> 
> 要回答："椅子在桌子哪边？"
> 需要：2.3-2.0=0.3（x方向），0.5-0.0=0.5（y方向）
> → LLM做不到精确的数值推理
> → 坐标形同虚设
> ```
>
> ### SSM的解决方式：把数值计算移出LLM
>
> **关键洞见：不让LLM处理坐标数字，而是在输入LLM之前就完成所有空间计算。**
>
> ```
> OpenEQA的流程：
> 3D坐标 → 序列化为文字 → LLM推理空间关系
> （LLM需要做数值运算，做不好）
> 
> SSM的流程：
> 3D点云 → 程序计算空间关系 → 结构化边 → LLM推理
> （空间计算由代码完成，LLM只需理解语义）
> ```
>
> **具体的转变过程：**
>
> ```
> Step 1：程序计算边的关系
> （Edge Discovery 阶段）
> 
> VLM看到当前帧图像 + 物体列表
> 预测："杯子 on top of 桌子"
> 
> → 这个关系被存储为图的边
> → 不是存储坐标数字
> → 而是存储语义关系标签
> 
> Step 2：LLM推理时看到的是什么
> 
> 不是：
> "杯子 @ (2.1, 0.3, 0.85)"
> "桌子 @ (2.0, 0.0, 0.80)"
> 
> 而是：
> {
>   "node": "杯子",
>   "caption": "白色马克杯",
>   "relations": [
>     {"type": "on_top_of", "object": "桌子"}
>   ]
> }
> 
> LLM看到的是语义关系，不是数字
> → "on_top_of"是LLM训练数据中大量出现的语言模式
> → LLM可以直接理解和推理
> ```
>
> ### 无空间结构问题的解决
>
> ```
> OpenEQA的问题：
> 所有物体平铺列出，没有结构
> "椅子@(2.3,0.5) 桌子@(2.0,0.0) 杯子@(2.1,0.3)
>  显示器@(2.0,0.0,1.2) 键盘@(2.0,0.0,0.85) ..."
> 
> 问题：
> ├── 物体之间的关系需要LLM自己推断
> ├── 哪些物体在同一区域？需要比较坐标
> └── 物体的层次结构？完全没有
> 
> SSM的场景图结构：
> 桌子
>  ├── on_top_of ← 显示器
>  ├── on_top_of ← 键盘
>  ├── on_top_of ← 杯子（contained_in → 桌面区域）
>  └── subpart_of → 书房
> 
> 椅子
>  └── on_top_of ← 地板
>      （subpart_of → 书房）
> 
> LLM看到的是：
> 有层次的、有关系的知识图谱
> 而不是一堆没有关联的坐标数字
> ```
>
> ### 两个问题的统一解决逻辑
>
> ```
> 问题本质：
> LLM擅长的：    语义理解、关系推理、语言生成
> LLM不擅长的：  数值计算、坐标比较、空间变换
> 
> OpenEQA的错误：
> 把"需要数值计算的问题"
> 扔给"不擅长数值计算的LLM"
> → 必然失败
> 
> SSM的正确做法：
> ┌────────────────────────────────────┐
> │ 数值计算层（代码/程序）             │
> │ ├── 反投影：像素→3D点              │
> │ ├── 点云配准：多帧→统一坐标系      │
> │ ├── 空间重叠：G_ij 计算            │
> │ └── 房间分割：HOV-SG 管道          │
> └────────────────────────────────────┘
>                  ↓
>         结构化的语义输出
>         （关系标签，不是数字）
>                  ↓
> ┌────────────────────────────────────┐
> │ 语义推理层（LLM）                   │
> │ ├── 理解 "on_top_of" 关系          │
> │ ├── 推理 "如果杯子在桌子上，        │
> │ │        那么打翻桌子杯子会掉落"    │
> │ └── 生成自然语言答案               │
> └────────────────────────────────────┘
> 
> 核心思想：
> 让计算机做计算机擅长的（数值几何计算）
> 让LLM做LLM擅长的（语义推理）
> 两者各司其职，不再让LLM做它不擅长的事
> ```

#### Limitations

```
SSM没有完全解决的问题：

1. 边的质量依赖VLM的预测
   VLM预测 "on_top_of" 关系
   → VLM本身在空间判断上也会出错
   → 错误的边 → 错误的推理

2. 四种关系类型仍然有限
   现实中的空间关系远不止四种
   "正对着"、"遮挡了"、"比...更靠近门"
   这些关系无法表达

3. 点云存储解决了表示问题
   但点云最终没有直接输入VLM
   └── VLM仍然无法"看到"3D形状
       只能看到从点云计算出来的语义标签

真正完整的解决方案：
└── 需要原生支持点云输入的VLM
    让模型直接处理3D数据
    而不是通过语义标签间接访问
```

- Error propagation in detection.

- API design constraints.

- Computational overhead.

- Domain generalization.
- Scalability limits.

> 
>
> ```
> 局限1：Error propagation in detection
> 具体问题：
> └── VLM检测错误 → 错误的Track
> → 错误的边 → 错误的推理
> 误差在流水线中被放大
> 
> 研究机会：
> └── 如何检测和修复场景图中的错误节点？
> 
> 局限2：四种边关系类型有限
> 具体问题：
> └── "正对着窗户的墙上挂着什么"
> "比冰箱更靠近门的物体"
> 这类空间关系无法用四种边表达
> 
> 研究机会：
> └── 开放词汇的空间关系发现
> （不预定义关系类型）
> 
> 局限3：点云没有直接进入VLM
> 具体问题：
> └── 点云→语义标签的转换仍然是信息瓶颈
> VLM看不到3D形状，只看到标签
> 
> 研究机会（与你的研究方向直接相关）：
> └── 原生支持点云输入的VLM
> 这正是你之前讨论的核心问题
> ```

#### Improvement

- these results suggest investigating how reasoning agents might direct their own perception in service of task goals. 

- Extending GraphPad’s approach to manipulation planning, navigation, and dynamic scenes could help bridge the gap between language understanding and effective action in 3D environments.


### 2. EmbodiedScan

#### Core Issues



#### Contributions

#### Structure

#### Limitations

#### Improvement

### 





## Question

### 1. 探索策略（question-aware exploration）

~~~python
**信噪比（Signal-to-Noise Ratio）是核心问题。**

---

## 论文留下的开放挑战

论文明确指出，高效的 A-EQA 需要**问题感知的探索策略（question-aware exploration）**：
```
理想的 A-EQA 智能体：
"冰箱里还有番茄罐头吗？"
       ↓
推理：需要找厨房 → 导航到厨房 → 检查冰箱
       ↓
最少步数内完成，不做无关探索
~~~

这个问题目前在论文中**没有被解决**，被明确列为未来工作方向。

### 2. 3D空间理解输入

**路线A：转为文字（本文的做法）**

```
3D场景 → 文字描述 + 坐标 → LLM

信息损失：
├── 空间关系损失（坐标→语义需要数值推理）
├── 几何细节损失（形状→文字不可逆）
└── 视觉纹理损失（图像→文字丢失细节）

优点：
└── 可以利用 LLM 的强大语言推理能力
```

**路线B：直接输入多帧图像（GPT-4V的做法）**

```
多帧RGB图像 → VLM → 答案

信息损失：
├── 3D几何信息损失（2D图像投影丢失深度）
├── 帧间关系损失（50帧独立处理，缺乏全局一致性）
└── 被遮挡区域损失（相机没看到的地方不存在）

优点：
├── 保留了丰富的视觉纹理信息
└── 端到端训练，特征对齐更好

论文结果：GPT-4V 55.3% > 所有文字路线
→ 路线B目前更优，但仍远低于人类86.8%
```

**路线C：真正的3D感知模型**

这是你问题指向的方向。确实存在，但有各自的局限：

方案C1：**NeRF（神经辐射场）**

```
输入：多帧 RGB + 相机位姿
输出：连续的3D场景表示（可以从任意视角渲染）

优点：
├── 完整保留3D几何和外观信息
└── 可以渲染出新视角（相当于"想象"没拍到的角度）

局限：
├── 训练一个场景需要几分钟到几小时
├── 无法直接与 LLM 对接（输出是像素，不是语义）
└── 目前尚无成熟的 NeRF → 语言问答端到端方案
```

**方案C2：3D-LLM（将3D特征直接输入LLM）**

```
输入：点云 → 3D特征编码器 → 特征向量 → LLM

代表工作：3D-LLM（论文引用[17]）

流程：
点云
  ↓
3D特征提取器（如 Point Transformer）
  ↓
3D特征向量（数值，非文字）
  ↓
投影层（对齐3D特征和语言空间）
  ↓
LLM（直接理解3D特征）
  ↓
答案

优点：
└── 不经过文字中转，3D信息直接进入模型

局限：
├── 需要大量3D-语言对齐的训练数据（极度稀缺）
├── 点云特征和语言特征的对齐仍是开放问题
└── 目前性能不如 GPT-4V 这类大规模预训练模型
```

**方案C3：场景图（Scene Graph）+ 图神经网络**

```
3D场景
  ↓
场景图（节点=物体，边=关系）
  ↓
图神经网络（GNN）处理拓扑结构
  ↓
与语言模型对接

局限：
└── 关系抽取本身容易出错，错误会传播
```

**信息损失的量化理解**

```
原始场景信息（设为100%）
        ↓
各路线的信息保留估计：

路线A（文字+坐标）：
├── 视觉语义：~40%（文字描述有损）
├── 精确几何：~15%（坐标有限）
└── 空间关系：~20%（需要数值推理）
综合：~25%

路线B（多帧图像）：
├── 视觉语义：~70%（直接看图）
├── 精确几何：~30%（2D投影损失深度）
└── 空间关系：~40%（多帧联合推理）
综合：~47%
（与GPT-4V 55.3% vs 人类 86.8% 的差距吻合）

人类：~90%+
（有完整的3D空间感知、常识补全、主动注意力）
```

**这个问题的本质**

```
根本矛盾：

语言模型（LLM/VLM）的世界：
└── 训练数据几乎全是2D图像和文字
└── 对3D空间没有内在的感知能力

真实场景理解需要：
└── 连续的3D几何感知
└── 物体间的拓扑关系
└── 遮挡推理
└── 视角不变性

当前的"桥接方案"（文字坐标 / 多帧图像）
都是在用2D/语言工具近似3D理解
→ 必然存在根本性的信息损失
```

**这正是论文的核心结论之一：**

> 在空间理解类问题上，所有模型表现都接近 Blind LLM，说明从 2D 图像/文字到真正的 3D 空间理解之间，存在一道当前技术无法跨越的鸿沟。OpenEQA 的价值就在于把这道鸿沟量化了出来。

**目前最有希望的研究方向**是训练原生支持3D输入的多模态模型（如 3D-LLM、EmbodiedGPT），但截至本文发表时，它们的性能仍不及 GPT-4V 这类大规模2D预训练模型——数据规模和预训练质量的差距还没被弥补。

### 3. scene graph改进

但为什么 OpenEQA 里 scene-graph captions 并没有赢 frame captions？

这点很关键，因为它已经开始指向 research gap 了。

OpenEQA 的结果里，**frame captions baseline 反而普遍比 CG / SVM 更强**。例如：

- **EM-EQA**：GPT-4 + frame captions 是 **43.6**，而 GPT-4 + ConceptGraphs 是 **36.5**，GPT-4 + SVM 是 **38.9**。
- **A-EQA**：GPT-4 + frame captions 是 **38.1**，而 GPT-4 + ConceptGraphs 是 **34.4**，GPT-4 + SVM 是 **34.2**。

这说明一个很有意思的事实：

> **把 history 结构化成 scene graph，在理论上更高级，但在这个 benchmark 上并没有自动带来更强的问答能力。**

为什么会这样？很可能有几层原因，我这里给你一个“研究视角”的解读：

**第一，scene graph 这条管线误差太多**

检测错、3D box 错、跨帧关联错、caption 错，最后全都传给 LLM。
 这类 pipeline 容易层层积累误差。

**第二，LLM 未必真正会用显式 3D 信息**

OpenEQA 的补充材料里甚至做了一个消融：
 **把 SVM 里的 3D bounding box 位置和尺寸去掉，性能几乎没明显变化。** 这说明“显式把 3D 位置写成文本”不等于 LLM 就真的能有效利用它。

**第三，scene graph 可能丢了原始视觉上下文**

frame captions 虽然粗糙，但保留了很多“这一帧里整体看起来像什么”的上下文；
 scene graph 往往更离散、更对象化，可能反而丢掉了房间级布局和某些弱线索。

所以这恰恰暴露了一个很好的研究问题：

> **怎样设计一个既比 frame captions 更结构化、又不至于丢掉关键视觉 / 空间上下文的中间表示？**

这已经很像一个方向了。

### 4. 3D空间

> #### 思路1：用物理世界的坐标系替换图像坐标系
>
> **核心想法：把位置编码从"图像空间"升级到"物理空间"**
>
> ```
> 当前 ViT 的位置编码：
> Patch → (row=3, col=5) 图像坐标
> 
> 改进方向：
> Patch → (X=2.3m, Y=0.5m, Z=1.1m) 物理世界坐标
> 
> 实现方式：
> 每个 Patch 的物理坐标 = 
> 用相机内参 + 深度值反投影到3D
> 再用相机位姿变换到世界坐标系
> 
> 这样不同帧的同一个物体：
> 帧1：椅子的Patch → 物理坐标 (2.3, 0.5, 1.1)
> 帧2：同一椅子    → 物理坐标 (2.3, 0.5, 1.1)（相同！）
> 
> 模型看到的不再是：
> "帧1左上角的Patch"和"帧2右中间的Patch"
> 而是：
> "同一个物理位置的两次观测"
> ```
>
> **这样做的好处：**
>
> ```
> 跨帧一致性：
> └── 同一物体在不同帧中的位置编码相同
> └── 模型自然学会"这是同一个物体"
> 
> 空间关系：
> └── 物理坐标差值直接对应真实距离
> └── "椅子在桌子左边1米"变成可计算的数字
> 
> 遮挡推理：
> └── 知道物体A在坐标(1,0,1)，物体B在(1.5,0,1)
> └── 可以推断A可能被B遮挡
> ```
>
> #### 思路2：把深度图作为第四个通道
>
> **当前：**
>
> ```
> 输入：RGB（3通道）
> → 每个像素 = [R, G, B]
> ```
>
> **改进：**
>
> ```
> 输入：RGB-D（4通道）
> → 每个像素 = [R, G, B, D]
> 其中 D = 深度值（归一化到0-1）
> 
> 更进一步：
> → 每个像素 = [R, G, B, X, Y, Z]
> 直接输入反投影后的3D坐标
> ```
>
> **这个思路的关键问题：**
>
> ```
> 训练数据的稀缺性：
> ├── RGB图像：互联网上有数十亿张
> ├── RGB-D图像：只有特定传感器才能采集
> │   ScanNet: ~1500个场景
> │   Matterport3D: ~90个场景
> └── 数量差了6个数量级
> 
> 预训练的不匹配：
> └── 现有的大模型全部在RGB数据上预训练
> └── 加入深度通道 = 破坏了预训练的特征分布
> └── 需要从头训练或大规模微调
> ```
>
> #### 思路3：显式的3D表征学习目标
>
> **问题的根源：当前的训练目标不包含3D监督**
>
> ```
> 当前训练目标（以GPT-4V为例）：
> 给定图像，预测下一个文字token
> Loss = 交叉熵（预测token, 真实token）
> 
> 3D信息从未出现在Loss中
> → 模型没有动力去学习3D理解
> ```
>
> **改进：加入显式的3D自监督任务**
>
> ```
> 任务1：新视角合成（Novel View Synthesis）
> 给定帧1-10，预测从新角度看到的帧11
> 
> Loss：预测帧 vs 真实帧的像素差异
> 
> 为什么有效：
> └── 只有真正理解了3D结构
> 才能准确预测新视角的样子
> └── 这是一个天然的3D理解的代理任务
> 
> 任务2：相机位姿估计
> 给定两帧图像，预测相机的相对运动
> 
> Loss：预测位姿 vs 真实位姿的差异
> 
> 为什么有效：
> └── 需要理解两帧之间的几何关系
> └── 强制模型学习视角变化的物理规律
> 
> 任务3：遮挡推理
> 给定部分遮挡的场景，推断被遮挡物体的位置
> 
> 为什么有效：
> └── 需要建立完整的3D场景模型
> └── 不能只依赖2D像素模式
> ```
>
> #### 思路4：用视频中的运动信息作为3D监督
>
> **最重要的思路：运动是3D结构的天然标注**
>
> ```
> 人类学习3D的方式：
> └── 在世界中移动
> └── 观察物体在不同视角下的变化
> └── 通过运动视差感知深度
> 
> 核心洞见：
> 连续视频中相邻帧的差异
> = 相机运动 + 场景3D结构 的函数
> 
> 如果模型能预测：
> "相机向前移动0.25米后，场景会变成什么样"
> → 模型必须已经理解了场景的3D结构
> 
> 具体实现：
> ┌─────────────────────────────────────┐
> │  输入：帧1, 帧2, ..., 帧N            │
> │  输入：相机位姿1, 位姿2, ..., 位姿N  │
> │           ↓                         │
> │      3D场景表征（隐式）               │
> │           ↓                         │
> │  任务A：预测帧N+1（给定位姿N+1）      │
> │  任务B：回答关于场景的问题            │
> │  任务C：预测任意位姿下的渲染结果      │
> └─────────────────────────────────────┘
> 
> 训练数据：
> └── 大规模视频数据（YouTube等）
> └── 配合视觉里程计提取的相机位姿
> └── 不需要人工标注！（自监督）
> ```
>
> #### 思路5：世界模型（World Model）范式
>
> **最根本的方向：让模型建立场景的内部3D模型**
>
> ```
> 当前模型的本质：
> 输入 → 直接输出
> （没有持久化的内部场景表示）
> 
> 理想的具身智能模型：
> 输入（新观测）
> ↓
> 更新内部世界模型（持久化的3D场景表示）
> ↓
> 从世界模型中读取信息回答问题
> 
> 类比：
> 人类不需要一直看着房间才能回答
> "我的桌子在哪里"
> 因为我们有持久化的空间记忆
> ```
>
> **具体架构设想：**
>
> ```
> 组件1：感知编码器
> 新帧 + 位姿 → 局部3D特征
> 
> 组件2：世界模型（可更新的3D表示）
> 可以是：
> ├── 神经辐射场（NeRF）
> ├── 3D高斯泼溅（3D Gaussian Splatting）
> └── 隐式神经表示（Implicit Neural Representation）
> 
> 组件3：语言接口
> 从世界模型中查询信息
> 转化为语言回答
> 
> 更新机制：
> 每次新观测 → 局部更新世界模型
> （不需要重新处理所有历史帧）
> ```
>
> #### 各思路的可行性评估
>
> ```
> 思路          技术难度    数据需求    短期可行性
> ────────────────────────────────────────────
> 1. 物理坐标位置编码   中      中（需要RGB-D）  ★★★★☆
> 2. RGB-D输入       中      高（数据稀缺）    ★★★☆☆
> 3. 3D自监督任务     高      中（自监督）      ★★★☆☆
> 4. 视频运动监督     高      低（大规模视频）   ★★★★☆
> 5. 世界模型范式     极高    高              ★★☆☆☆
> ```
>
> #### 最可能有突破的方向
>
> ```
> 近期（1-2年）：
> └── 思路1 + 思路4 的结合
>     大规模视频预训练 + 物理坐标位置编码
>     代表性工作方向：视频版的 DINO / MAE
> 
> 中期（3-5年）：
> └── 思路3 的成熟
>     新视角合成作为预训练目标
>     代表：基于NeRF/高斯泼溅的预训练模型
> 
> 长期（5年以上）：
> └── 思路5 的实现
>     真正的世界模型
>     需要架构、数据、训练方法的全面突破
> ```
>
> 

# Idea_1

## Outline

### 4.7

dataset ：OpenEQA  EM-EQA

method：挑帧问题	从efficiency角度

​	R-EQA做法：挑与问题相近的多个帧

​	拟合与答案相近的多个帧

​	生成对抗网络一样 让它两个网络同时去训练 就是一个是计算图片的分数 就是图片它的价值 这相当于是一个打分网络 然后剩下一个是产生监督信号的网络 就是我们通过这两个网络 彼此的训练 通过这种方式

taste gap：

具身——关注VLA  从vision转过来

VLM——从LLM转过来  不太关注具身应用方面

## Investigation

### Arrangement

#### 01

> ## 1. 先把你的研究目标重新收敛一下
>
> 你现在其实有两个可能的优化目标，但最好只选一个主目标：
>
> **方向 A：回答阶段更快**
>  给定一段已有 episodic memory，如何更快检索出最相关帧，再交给 VLM/LLM 回答。
>
> **方向 B：整体具身效率更高**
>  不仅回答时检索快，而且探索时少走冤枉路、少存无用帧、少做重型 VLM 调用。
>
> 如果你说“部署到具身时，VLM 延迟降低，efficiency 提高”，那我建议你把主线定义成 **B**，但实验上先从 **A** 做起：先在固定 episode history 上做“低延迟检索”，再往 active embodied setting 扩展。这样更稳，也更容易做出清晰 ablation。R-EQA 目前还是固定历史上的检索；EfficientEQA、GraphEQA、Fine-EQA、FAST-EQA 这些工作则更接近你说的“端到端 embodied efficiency”。 
>
> ## 2. 我对你这个 idea 的核心建议
>
> 我最建议你做的不是“更强但更重的检索器”，而是：
>
> **做分层、按需、问题驱动的检索。**
>
> 换句话说，你的轻模块应该做的是：
>
> **先用极便宜的信号快速缩小候选，再只对少量候选调用重型视觉理解。**
>
> 这比“把所有帧都先 caption 一遍、embedding 一遍、再检索”更符合真实部署逻辑。iRAG 的核心思想就是这个：不要预先把所有视频内容都重处理完，而是先快速建立粗索引，再在查询时对少量候选做按需细化；它报告了比全量 upfront video-to-text 处理快 23–25 倍的摄取速度。对你来说，这个思想很值得迁移到 embodied memory。
>
> ## 3. 我会怎么设计你的方法
>
> 我会把你的方法做成：
>
> **Latency-Aware Hierarchical Retrieval for Embodied QA**
>
> ### 第一层：超轻量 memory key
>
> 在线探索时，不要保存“每帧完整 caption + 重 embedding”作为唯一索引；先保存便宜的 key：
>
> - CLIP/轻量视觉 embedding
> - 时间戳、位姿、房间 ID
> - 目标检测得到的 object tags
> - 简短 room/scene label
> - 可选：低成本 scene-graph node
>
> 这层的目标不是回答问题，而是**快速粗召回**。
>
> ### 第二层：粗召回
>
> 问题来了以后，先用 query 对这些 cheap keys 做 top-M 粗召回。
>  这里你可以用：
>
> - 文本-图像相似度
> - object keyword matching
> - room prior
> - 时间/轨迹邻近约束
>
> ### 第三层：按需精排
>
> 只对 top-M 候选做贵操作：
>
> - 高质量 caption
> - region crop
> - 更强 cross-modal scorer
> - VLM 二次判断
>
> 这样才能真正减少总 VLM latency。这个“粗到细”的逻辑，和 iRAG 的 incremental retrieval、AKS 的 relevance+coverage 预筛选、Q-Frame 的 query-aware frame selection，是同一类思想。
>
> ### 第四层：多样性选择，而不是只看相似度
>
> R-EQA 这种 top-k 相似度检索很容易拿到一堆相邻重复帧。
>  你应该在最终选择里加入：
>
> - temporal diversity
> - view diversity
> - object coverage
> - room coverage
>
> AKS 明确把 **relevance + coverage** 联合起来做 keyframe 选择；这点和你的课题非常契合。
>
> ### 第五层：自适应 k 和早停
>
> 不是每个问题都要看一样多的帧。
>  你可以让系统在证据足够时早停，减少后续 VLM 调用。EfficientEQA 会根据问题相关 observation 的“outlier”特征判断何时已经获得足够信息；Mind Palace 也引入了 value-of-information 式 stopping。这个思路很适合你做 latency-aware 的 stop criterion。
>
> ## 4. 哪些 idea 我觉得最值得你做
>
> 如果你要我排优先级，我会这样排：
>
> ### 最值得做：粗到细、按需检索
>
> 这是最符合“轻模块提效”的。
>  你可以把题目讲成：
>
> > 用便宜 memory key 做粗召回，只对少量候选做高成本视觉验证，从而降低端到端 embodied QA latency。
>
> 这条最像 iRAG 在视频上的迁移版，也最容易写出效率 story。
>
> ### 第二值得做：query-aware + diversity-aware frame selection
>
> 也就是把“相关性”扩展成“相关性 + 覆盖性 + 去冗余”。
>  AKS 和 Q-Frame 都支持这条线；前者强调 relevance/coverage，后者强调 query-aware sampling 和在预算内保留关键时空信息。
>
> ### 第三值得做：从 frame memory 改成 object-/region-/scene-graph memory
>
> 如果你直接检索“帧”，还是太粗。
>  GraphEQA 说明了一个很强的方向：把 3D metric-semantic scene graphs 和 task-relevant images 结合成紧凑 multimodal memory，用于实时 EQA，并且能减少 planning steps。这个方向更“具身”，也更适合真实部署。
>
> ### 第四值得做：episodic + semantic memory 分层
>
> HIMM、MemoryEQA、Mind Palace 都不是把 memory 当成一坨帧，而是区分不同类型记忆：局部观察、全局语义、结构化世界状态。HIMM 还特别强调 retrieval-first、reasoning-assisted；MemoryEQA 用 global/local hierarchical memory；Mind Palace 用 scene-graph-based world instances 和 targeted retrieval。你完全可以把“轻检索模块”做成：先从 semantic memory 找区域，再到 episodic memory 找具体视图。
>
> ## 5. 哪些论文和你的 idea 最接近，应该先调研
>
> 我建议你按三条线调研，而不是乱搜。
>
> ### 第一条线：EQA 里的“效率 + memory + retrieval”
>
> 这是你的主线，优先级最高。
>
> 先看这几篇：
>
> **EfficientEQA (2024/2025)**
>  很贴近你的目标：它关心 open-vocabulary embodied QA 的效率，使用语义加权探索、RAG 检索有用图像，并通过相关 observation 的异常性来决定是否停止探索。论文声称在准确率和运行步数效率上都优于已有方法。
>
> **GraphEQA (2024/2025)**
>  非常值得看。它不是单纯 caption retrieval，而是在线构建紧凑 multimodal semantic memory：3D semantic scene graph + task-relevant images，并把这个 memory 用于实时 EQA、层次化规划和语义引导探索。这个方向和“低延迟、真实部署、轻 memory”很接近。
>
> **MemoryEQA / Memory-Centric EQA (2025)**
>  它把 memory 放到框架中心，构建 global/local hierarchical memory，并把 memory 注入到 planner、stopping、answering 等多个模块，而不只是回答阶段。这个很适合你思考“检索模块如何服务整套 embodied pipeline”。
>
> **Enter the Mind Palace / LA-EQA (2025)**
>  如果你未来想做长期具身 memory，这篇很重要。它研究 long-term active embodied QA，用 structured memory + targeted retrieval + VOI stopping 来平衡探索与回忆。
>
> **FAST-EQA (2026)**
>  这篇很贴你的 deployment 目标：它强调 semantics-aware、target-driven exploration，并明确使用 **bounded visual memory**、按区域相关性排序。这个“bounded memory + ranked evidence”思路很值得你借鉴。
>
> ### 第二条线：视频/长时序里的“高效检索与选帧”
>
> 这是你的方法借鉴线，实际上对你非常关键。
>
> **iRAG (2024)**
>  核心看点是 incremental、on-demand extraction。你做 embodied 时，完全可以把它改写成：探索阶段只存廉价索引，回答时按需重解析少量候选。
>
> **AKS: Adaptive Keyframe Sampling (2025)**
>  它把 keyframe 选择写成 relevance 与 coverage 的联合优化，而且是 plug-and-play。你做检索帧时，这个建模方式几乎可以直接迁移。
>
> **Q-Frame (2025)**
>  query-aware frame selection + multi-resolution adaptation，非常适合你思考“在固定算力预算下，帧数与分辨率如何联合分配”。
>
> **Too Many Frames, Not All Useful / HKS (2024)**
>  这条线强调 hierarchical keyframe selector，目标就是在长视频中用很少帧保住有效证据。你虽然做 EQA，但“长历史 observation → 少量关键证据”的问题是同构的。
>
> **VideoRAG (2025)**
>  如果你不想只停留在 caption-only retrieval，这篇值得看，因为它强调直接利用视频的视觉和文本信息，而不是只把视频先转成文字描述。这个点正好对应 R-EQA 的弱点。
>
> ### 第三条线：benchmark 与评测
>
> 这条线是为了帮你定义实验，不是为了直接借方法。
>
> **OpenEQA (2024)** 是你当前最自然的起点。CVPR 2024 论文把它定位成 foundation models 时代的 embodied QA benchmark。
>
> **EXPRESS-Bench / Fine-EQA (2025)** 值得看，因为它把“探索效率”单独拎出来评估，并提出了 EAC 指标，把 answer grounding 与 exploration efficiency 一起衡量。你如果以后想说自己的方法不仅更准，而且更省探索，这条线很有用。
>
> ## 6. 你接下来应该怎么调研
>
> 我建议你的调研顺序不是按年份，而是按“和你的 idea 的距离”。
>
> ### 第一批：最接近你的
>
> 先读：
>
> - EfficientEQA
> - GraphEQA
> - MemoryEQA
> - iRAG
> - AKS
> - Q-Frame
>
> 这 6 篇足够帮你搭出你的方法框架。
>
> ### 第二批：扩展你的 story
>
> 再读：
>
> - Mind Palace / LA-EQA
> - FAST-EQA
> - VideoRAG
> - Fine-EQA
>
> 这批会帮助你把 story 从“检索更快”升级成“memory-aware embodied efficiency”。
>
> ## 7. Google Scholar 应该怎么搜
>
> 不要只搜一个词。你应该按 5 个方向分别搜。
>
> ### 方向 1：EQA + efficiency
>
> 搜：
>
> - `"embodied question answering" efficient retrieval`
> - `"embodied question answering" real-time memory`
> - `"open vocabulary embodied question answering" efficiency`
> - `"embodied question answering" bounded visual memory`
>
> 这组是找与你目标最接近的 embodied 论文。对应到 EfficientEQA、GraphEQA、FAST-EQA 这类工作。
>
> ### 方向 2：memory architecture
>
> 搜：
>
> - `"embodied question answering" episodic memory retrieval`
> - `"embodied agent" semantic memory episodic memory`
> - `"hierarchical memory" embodied question answering`
> - `"scene graph memory" embodied question answering`
>
> 这组是找 memory 表示与检索层级。对应 MemoryEQA、GraphEQA、Mind Palace、HIMM。
>
> ### 方向 3：frame selection / keyframe selection
>
> 搜：
>
> - `"query-aware frame selection" video llm`
> - `"adaptive keyframe sampling" long video understanding`
> - `"efficient frame selection" video question answering`
> - `"retrieval-aware frame sampling" video QA`
>
> 这组最能直接启发你的“检索帧方法”。对应 AKS、Q-Frame、HKS/LVNet 这条线。
>
> ### 方向 4：incremental / on-demand retrieval
>
> 搜：
>
> - `"incremental rag" video`
> - `"on-demand retrieval" video question answering`
> - `"coarse-to-fine retrieval" multimodal video`
> - `"latency-aware retrieval" vision language`
>
> 这组是给你的“轻模块按需细化”找理论与系统支撑。iRAG 是最直接的起点。
>
> ### 方向 5：exploration efficiency + stopping
>
> 搜：
>
> - `"value of information" embodied exploration`
> - `"early stopping" embodied question answering`
> - `"question-guided exploration" embodied QA`
> - `"semantic-guided exploration" embodied question answering`
>
> 这组能帮你把“少看、少走、早点停”变成论文里的正式模块。对应 EfficientEQA、Mind Palace、Fine-EQA。
>
> ## 8. 我对你选题的直接判断
>
> 我认为你最有潜力的切法，不是做“更强的 retriever 模型”，而是做：
>
> **一个面向具身部署的 latency-aware retrieval pipeline**：
>
> 1. 在线阶段构建便宜 memory key
> 2. 问题到来时做 coarse retrieval
> 3. 对少量候选按需高成本解析
> 4. 做 diversity-aware reranking
> 5. 根据证据置信度自适应决定 top-k 和 stop
>
> 这样你的贡献会同时落在：
>
> - 检索精度
> - VLM 调用次数
> - 推理时延
> - embodied efficiency
>
> 这个 story 比“我把相似度模型换强了”强得多。
>
> ## 9. 给你的一个最具体的落地建议
>
> 你下一步就做这件事：
>
> **先写一页 proposal，把你的方法收敛成 “coarse-to-fine query-aware retrieval for embodied QA under latency budget”**。
>
> 里面只写四个模块：
>
> - cheap memory keys
> - coarse retrieval
> - on-demand refinement
> - adaptive stop / adaptive k
>
> 然后拿 R-EQA 当最小 baseline，先在固定 episode history 上验证：
>
> - 同等准确率下 latency 能不能降
> - 同等 latency 下 LLM-Match 能不能升
>
> 等这一步跑通，再扩到 EfficientEQA / GraphEQA 那种 active embodied setting。

#### 02

> 首先该深读的，是 **EM-EQA 主线**：
>
> **第一篇：OpenEQA**
>  你要先把 benchmark 本身吃透，尤其是 EM-EQA 到底在评什么、它和 A-EQA 的边界是什么。OpenEQA 明确把两种 setting 都纳入进来，这是你后面界定自己问题的基准。
>
> **第二篇：R-EQA**
>  因为它就是你当前最直接的对位工作：固定 episodic memory、caption-based retrieval、top-k frame selection、LLM answer generation，而且作者自己在结尾就说未来想做 **low-latency retrieval mechanisms**。这和你的题目几乎是正对齐的。 
>
> **第三篇：Episodic Memory Question Answering（CVPR 2022）**
>  这篇不是 OpenEQA，但它是更早、更“原教旨”的 episodic memory QA 线：核心就是如何构建能支持问答的 memory representation，而不是主动探索。它强调要构建高效、语义丰富、带时空信息的 scene memory，这对你做“轻量检索 key / memory representation”很有启发。
>
> **第四篇：ReMEmbR**
>  这篇很值得你看，因为它已经在做更接近“可查询 memory”的方向：构建可检索的长时程机器人 memory，并把 pose、time、caption embedding 等组织进可查询数据库。后续工作把它归在 episodic EQA 一侧，而不是 active EQA 一侧。
>
> 在这四篇之后，再去看 EfficientEQA，位置会更合适。
>
> 为什么它还有必要看？因为虽然它不在你的主 setting 里，但它有三类东西对你仍然有价值：
>
> 第一，它很强调 **efficiency**，尤其是“什么时候信息已经够了、是否该停、如何少走冤枉路”。这些思想虽然发生在 A-EQA 里，但你可以迁移成 EM-EQA 下的 **adaptive k / early stop / budgeted retrieval**。
>
> 第二，它也是 **RAG + embodied QA**，只是把 retrieval 放在 active exploration 过程中。你可以借它看清楚：哪些设计是“探索专属”的，哪些设计其实可以抽出来变成“memory retrieval 专属”的。
>
> 第三，它能帮你在 related work 里把边界讲清楚：
>  “别人做的是 active exploration efficiency，我做的是 fixed episodic memory 下的 low-latency evidence retrieval。”
>  这个区分在写 proposal 和论文时很重要。
>
> 所以我的建议非常明确：
>
> **要看，但只需要“策略性地看”，不是现在就通篇精读。**
>
> 更具体地说，你现在可以这样读：
>
> **第一阶段，先不看 EfficientEQA。**
>  先把：
>  OpenEQA → R-EQA → Episodic Memory Question Answering → ReMEmbR
>  这条线打通。这样你会先建立 EM-EQA 的问题意识。 
>
> **第二阶段，再回头 skim EfficientEQA。**
>  只看四个部分：
>  Introduction、Method 里的 system decomposition、efficiency metric/stop condition、Experiments 里的效率定义。
>  不要陷进 exploration policy 细节里，因为那不是你当前主战场。
>
> 如果你问“我现在具体从哪篇开始”，我的顺序会是：
>
> **1. OpenEQA（只看和 EM-EQA 直接相关的部分）**
>  搞清楚任务定义、输入输出、评测、问题类型。
>
> **2. R-EQA**
>  搞清楚最小 retrieval baseline 是怎么搭的，它的瓶颈是什么。 
>
> **3. Episodic Memory Question Answering（CVPR 2022）**
>  搞清楚“memory representation”这件事本身，而不是只盯着 frame retrieval。
>
> **4. ReMEmbR**
>  看它怎么把可查询 memory 做得更像系统，而不只是 caption 检索。
>
> **5. EfficientEQA（只做启发式阅读）**
>  把它当“效率思想库”，不是你的最直接 baseline。

#### 03

> ## 推荐论文清单
>
> 根据你的核心研究方向——**以最低延迟从 episodic memory 中提取 K 帧**，我把推荐分成三个层次：
>
> ------
>
> ### 第一层：最直接相关（必读）
>
> #### 1. SeViLA（NeurIPS 2023）
>
> **Self-Chained Image-Language Model for Video Localization and Question Answering**
>
> 用单一图像语言模型（BLIP-2）同时处理关键帧定位和 QA 两个任务：前向链 [arXiv](https://arxiv.org/abs/2305.06988)中 Localizer 找到多个语言感知关键帧，Answerer 用这些帧预测答案；反向链中 Answerer 生成关键帧伪标签来自我精炼 Localizer，无需昂贵的标注。
>
> **与你研究的关系：** 这是"问题感知帧选取"领域最经典的基线，R-EQA 改进的直接对比对象就是它。它证明了训练一个专门的 Localizer 模块可以显著优于 uniform sampling，但代价是多了一套参数和推理开销——你的研究方向恰好是**无需训练**的轻量化替代方案。
>
> ------
>
> #### 2. AKS（CVPR 2025）
>
> **Adaptive Keyframe Sampling for Long Video Understanding**
>
> 在 MLLM 中插入即插即用的自适应关键帧采样模块（AKS），通过递归的"判断-分裂"优化来选取关键帧，每个红点代表 prompt-frame 匹配分数。 [TheCVF](https://openaccess.thecvf.com/content/CVPR2025/papers/Tang_Adaptive_Keyframe_Sampling_for_Long_Video_Understanding_CVPR_2025_paper.pdf)
>
> **与你研究的关系：** 它的"递归二分搜索"思路和你的 Top-k 检索互补——不是直接算相似度排序，而是用分治策略定位关键时间段，计算量更低，且是 training-free 的。
>
> ------
>
> #### 3. VSLS（Logic-in-Frames）
>
> **Visual Semantic-Logical Search for Efficient Keyframe Selection**
>
> 在 EGO4D 上平均只采样 1.4% 的视频帧，就能让 GPT-4o 的长视频 QA 准确率提升 8.7%。核心观察是：从文本 query 中提取视觉语义逻辑关系（空间、时序、属性、因果四类）可以弥合视频帧中潜在视觉逻辑与 query 表达的语义差距。 [OpenReview](https://openreview.net/pdf/431b5b7435044e49b61470a1091593b887d222f3.pdf)
>
> **与你研究的关系：** 这篇论文的问题分类（空间/时序/属性/因果）和你之前提出的"根据问题意图动态切换检索策略"高度一致，而且它用问题中的**语义逻辑关系**而非纯文本相似度来选帧，是对 R-EQA 的直接超越。
>
> ------
>
> ### 第二层：效率优化方向（强烈推荐）
>
> #### 4. ViLA（ECCV 2024）
>
> **Efficient Video-Language Alignment for Video Question Answering**
>
> SeViLA 训练了独立的关键帧定位器，对实时推理不友好且引入了更多参数。ViLA 提出轻量化的 Frame-Prompter，受问题文本影响学习选取最重要的帧，并由 VQA loss 监督，精心设计以保持轻量高效，在 STAR 上以 3× 加速超越 SeViLA。 [Ecva](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/07919.pdf)
>
> **与你研究的关系：** ViLA 专门针对 SeViLA 的延迟问题提出改进，**3× 加速**的思路对你设计轻量帧选取模块有直接参考价值。
>
> ------
>
> #### 5. Q-Frame（2025）
>
> **Query-aware Frame Selection and Multi-Resolution Adaptation**
>
> 自适应地根据帧与 query 的相关性选择帧，集中于最重要的时间段以提升效率；同时通过多分辨率自适应（MRA）对重要帧保留细节而对其他帧降低分辨率，优化计算资源。 [arXiv](https://arxiv.org/pdf/2506.22139)
>
> **与你研究的关系：** 它的多分辨率思路很有启发——不是所有被选中的帧都需要全分辨率处理，这可以进一步压缩送给 LLM 的 token 数量，与你的低延迟目标直接对齐。
>
> ------
>
> #### 6. "Less is More"（2025）
>
> **Token-Efficient Video-QA via Adaptive Frame-Pruning and Semantic Graph Integration**
>
> 研究发现一个反直觉的现象：更多帧并不保证更好的性能。先进的帧搜索策略如 T* 和 VSLS 在追求全面性时往往产生内部冗余显著的关键帧集合——即"视觉回声"问题。 [arXiv](https://arxiv.org/html/2508.03337v6)
>
> **与你研究的关系：** 这直接指出了 R-EQA 从 k=10 减到 k=3 就能提升性能的深层原因——**冗余比信息量不足更伤害性能**。这篇论文提供了如何在选帧后再做去冗余的方案。
>
> ------
>
> ### 第三层：方法论参考（选读）
>
> #### 7. VideoRAG（2025）
>
> **Retrieval-Augmented Generation over Video Corpus**
>
> R-EQA 的参考文献之一，将 RAG 范式引入视频域的先驱工作，重点在于如何用检索替代全量视频处理。对你理解 R-EQA 的设计来源有帮助。
>
> ------
>
> ### 论文关系图
>
> ```
> 你的研究核心：轻量 + 问题感知 + 低延迟帧选取
>         ↑
>         │ 直接改进对象
>     R-EQA（均匀采样基线）
>         │
>    ┌────┼────────────────┐
>    │    │                │
> SeViLA  AKS           VSLS
> (有监督) (training-free) (语义逻辑)
>    │                     │
>   ViLA              Q-Frame
> (轻量化SeViLA)    (多分辨率+去冗余)
>                          │
>                    "Less is More"
>                    (冗余量化分析)
> ```
>
> ------
>
> ### 给你的建议阅读顺序
>
> 1. **SeViLA** → 建立对"帧定位+QA"两阶段框架的完整认知
> 2. **VSLS** → 理解用问题语义逻辑关系选帧的思路（最接近你的方向）
> 3. **ViLA** → 看如何把 SeViLA 做轻量，学习效率优化的具体手段
> 4. **AKS** → 递归搜索思路，training-free，可以直接借鉴
> 5. **"Less is More"** → 理解冗余问题，支撑你"少而精"的核心论点

### R-EQA

#### Structure

![image-20260408172030535](https://raw.githubusercontent.com/reader001-guius/markdown-images/main/img/image-20260408172030535.png)

> ```
> N帧视频序列
>     ↓ 【阶段1】Caption生成 & Embedding
> N个帧描述 → N个向量
>     ↓ 【阶段2】问题驱动检索
> Top-k 帧描述
>     ↓ 【阶段3】答案生成
> 最终答案
> ```
>
> ------
>
> **阶段1：Caption生成 & Embedding**
>
> **两步走：**
>
> **第一步**，对每一帧 $i $，用预训练 VLM 生成文字描述：
> $$
> c_i = \text{VLM}(\text{frame}_i)
> $$
> 生成的是**与问题无关的通用描述**，例如：`"一个客厅，有沙发、茶几和电视"`。这一步是**离线预处理**，不在推理时执行。
>
> **第二步**，用 SentenceBERT 把每个 caption 映射到向量空间：
> $$
> e_i = \text{SentenceBERT}(c_i)
> $$
> 结果是 N 个固定向量存在数据库里，等待检索。
>
> ------
>
> **阶段2：如何抽出K帧（核心）**
>
> 这是 R-EQA 相比 Uniform Sampling 最关键的改进。
>
> **Step 1：问题也做 Embedding**
> $$
> e_q = \text{SentenceBERT}(q)
> $$
> 问题 $q $ 和 caption 用 **同一个编码器**，保证在同一向量空间可比较。
>
> **Step 2：计算相似度**
>
> 对所有 N 帧，计算问题向量与每帧 caption 向量的余弦相似度：
> $$
> \text{sim}(e_q, e_i) = \frac{e_q \cdot e_i}{|e_q||e_i|}
> $$
> **Step 3：取 Top-k**
>
> 按相似度降序排列，取前 $k=3 $ 个 caption，即为"与问题最相关的帧"。
>
> **对比 Uniform Sampling：**
>
> |          | Uniform Sampling              | R-EQA                  |
> | -------- | ----------------------------- | ---------------------- |
> | 选帧逻辑 | 每隔 N/k 帧取一帧，与问题无关 | 按语义相似度选最相关帧 |
> | k 值     | k=10                          | k=3                    |
> | 信息质量 | 量多但冗余                    | 量少但精准             |
>
> ------
>
> **阶段3：答案生成**
>
> 把检索到的 k=3 个 caption 拼接成 Prompt 喂给纯文本 LLM：
> $$
> P = \{w, c_{i_1}, c_{i_2}, c_{i_3}, q\}
> $$
> 其中 $w $ 是包含 in-context examples 的系统提示。
>
> ------
>
> **轻量化体现在哪里？**
>
> R-EQA 的轻量化是**系统级设计**，体现在三个层面：
>
> **1. 检索模块极轻量**
>
> SentenceBERT 是纯文本模型，参数量远小于 VLM，做一次余弦相似度检索几乎无额外计算开销。
>
> **2. 推理时不跑 VLM**
>
> Caption 生成是**离线预处理**，推理时 LLM 只看文字，完全避免了推理阶段的视觉计算。
>
> **3. 压缩上下文长度**
>
> k=3（相比 uniform 的 k=10），送入 LLM 的 token 数大幅减少，推理更快、成本更低。
>
> ```
> Uniform: 10个caption → LLM（上下文长）
> R-EQA:   3个caption  → LLM（上下文短，但更精准）
> ```

#### Score

![image-20260408172811402](https://raw.githubusercontent.com/reader001-guius/markdown-images/main/img/image-20260408172811402.png)

#### GPT-R-EQA

> 但它的方法也明显很“轻”：
>
> #### 1. 检索对象只是 caption，不是原始视觉信息
>
> 这会导致大量视觉细节丢失，尤其是：
>
> - 小物体
> - 空间关系
> - 属性细节
> - 遮挡状态
> - 长尾视觉现象
>
> 也就是说，它把视觉 memory 压缩成了文本 memory，这虽然方便做检索，但也牺牲了信息量。
>
> #### 2. 它是逐帧独立检索，不建模时间连续性
>
> EQA 很多问题不是某一帧能回答的，而是要看：
>
> - 前后路径
> - 多视角补全
> - 一个物体被逐步看到的过程
> - agent 从哪走到哪
>
> 但这篇方法是 frame-wise retrieval，不是 segment / trajectory retrieval。
>
> #### 3. 检索器很简单
>
> 只是 Sentence-BERT + cosine similarity。
>  这意味着它更像“语义近邻匹配”，而不是深层 question-frame reasoning。
>
> #### 4. fixed top-k 很粗
>
> uniform 用 10 帧，R-EQA 用 3 帧，这是固定的；但不同问题其实需要不同数量、不同粒度的证据。
>
> 所以如果你的目标是**改进检索帧方法**，这篇文章最大的空间恰恰就在这些弱点上。
>
> ### 方向一：从“单帧检索”改成“时序片段检索”
>
> 这是我最推荐你优先想的。
>
> 因为很多 EQA 问题并不是某一帧能回答，而是需要一小段连续观察。
>  所以你可以把 retrieval unit 从：
>
> - **frame caption**
>
> 改成：
>
> - **short temporal window**
> - **clip-level caption**
> - **trajectory segment summary**
>
> 这样做的好处是，能保留更多时序上下文，尤其对：
>
> - spatial understanding
> - object localization
> - object state recognition
>
> 这几类问题很可能更有帮助。
>
> ------
>
> ### 方向二：从“caption-only retrieval”改成“hybrid retrieval”
>
> 现在这篇文章只在 caption 上检索，这会丢视觉细节。
>  你可以考虑做混合检索：
>
> - 一路用 caption text embedding
> - 一路用 image embedding / VLM embedding
> - 再把两路分数融合
>
> 也可以进一步加：
>
> - object tags
> - OCR text
> - detected regions
> - scene graph elements
>
> 这样检索时就不是只靠一句全局 caption，而是有更细粒度的视觉证据。
>
> ------
>
> ### 方向三：做 question-type-aware retrieval
>
> 这篇文章图 2 已经暗示了题型差异。
>
> 不同问题需要的 evidence 完全不同：
>
> - **Object recognition**：找最清晰看到目标物的帧
> - **Object localization**：要看多个视角，可能需要邻近帧
> - **Attribute recognition**：要高分辨率、近景帧
> - **Spatial understanding**：要保留相对位置关系，单 caption 很容易丢
> - **Object state**：需要状态变化线索
> - **Functional reasoning**：可能要更长时间跨度
> - **World knowledge**：视觉检索可能贡献反而有限
>
> 所以你可以先做一个轻量 question classifier，再选择不同 retrieval policy。
>
> 这是很像样、也很容易讲 story 的方向。
>
> ------
>
> ### 方向四：两阶段 retrieval + reranking
>
> 现在它只有一阶段 dense retrieval。你可以改成：
>
> 1. **粗召回**：先取 top-20 候选帧/片段
> 2. **精排**：用更强的 cross-modal scorer 重新排序
> 3. **最终选 top-k**
>
> 这样通常比单纯 cosine similarity 更稳。
>
> 尤其适合处理“表面语义相近但真正证据不足”的假阳性候选。
>
> ------
>
> ### 方向五：引入 diversity / coverage
>
> top-k 最相关帧经常会发生一个问题：
>
> **全都长得差不多。**
>
> 比如 agent 连续几步都看着同一张桌子，retriever 可能把这几帧都选出来。
>  但对回答问题来说，你真正需要的是：
>
> - 一些相关性
> - 一些互补性
> - 一些视角多样性
>
> 所以可以在 top-k selection 里加：
>
> - diversity penalty
> - temporal dispersion
> - MMR 式选择
> - coverage-aware selection
>
> 这会比纯相关性排序更适合 embodied memory。
>
> ------
>
> ### 方向六：adaptive k，而不是固定 k
>
> 有些问题 1～2 帧就够了；
>  有些问题要 5～8 帧甚至更多。
>
> 所以你可以让模型根据问题类型或 retrieval confidence 动态决定需要多少证据，而不是死用固定 k。
>
> 

#### Idea：

##### Memory Key：

> **R-EQA 式 memory**
>
> 每帧都像这样存：
>
> - “A wooden table is in the center of the room and there appears to be a chair nearby...”
> - “A dining area with a table and two chairs...”
> - …
>
> 然后把这些整句文本做 embedding，再和问题匹配。
>
> **memory key 式 memory**
>
> 每帧只存更轻的索引：
>
> - objects = {table, chair}
> - room = dining room
> - pose = x,y,theta
> - visual key = 256 维向量
> - timestamp = t
>
> 这样 query 来时，先快速召回“含 table/chair 的 dining room 相关帧”，再对候选帧做细查。
>
> **在 R-EQA 前面加一层 lightweight memory key retrieval。**
>
> 也就是：
>
> - 第 1 层：cheap key 粗召回
> - 第 2 层：caption / VLM 精排
> - 第 3 层：answer generation
>
> 这比直接在所有完整 caption 上做检索，更贴近你的目标。

##### Retrieval Both Relevance and Diversity

> 如果你要做低延迟检索，我建议你把 retrieval 拆成两层：
>
> **第一层：memory key 粗召回**
>
> 快速找出 20 个候选。
>
> **第二层：多样性选择**
>
> 从这 20 个候选里，不只看 relevance，还看：
>
> - temporal diversity
> - viewpoint diversity
> - object coverage
>
> 最后选 3～5 个真正有用的帧。

##### Chronology



#### Question：

1. 在生成caption的这一步，VLM转化依然存在延迟
2. 数据处理时使用的是offline，而端到端部署时，应当用online
3. caption以及retrieval frame缺失时序信息

### EMQA

> ## EMQA 对轻量检索 / Memory Representation 的核心启发
>
> ### 先定位你的问题本质
>
> 你在做的事情，用 EMQA 的语言重新表述就是：
>
> ```
> 如何从 episodic memory 中，
> 用最少的计算代价，
> 检索出最能回答问题的 key frames？
> ```
>
> EMQA 没有直接解决"检索"，但它对 **memory 应该长什么样** 有深刻的回答，而 memory 的结构直接决定了检索的上限。
>
> ------
>
> ### 启发一：Memory 的单位不应该是"帧"，而是"空间格子"
>
> **EMQA 的做法：**
>
> 它不存帧，而是把帧的信息**投影融合**到一个 2D 俯视地图上，每个 2cm×2cm 的格子是记忆的基本单位。
>
> ```
> 帧1 → 投影 → 地图格子 (i,j) 更新
> 帧2 → 投影 → 地图格子 (i,j) 再次更新（同一位置）
> 帧N → 投影 → ...
>          ↓
> 最终：地图格子 (i,j) = 该位置所有观测的融合
> ```
>
> **对你的启发：**
>
> R-EQA 里每帧独立存一个 caption，帧与帧之间没有任何关联。这导致两个问题：
>
> - 同一个物体从不同角度拍了 10 次，存了 10 个相似的 caption，**高度冗余**
> - 检索时完全不知道哪些帧看的是**同一个空间位置**
>
> 改进思路是：**以空间位置为索引而不是帧 id 为索引**。
>
> ```
> 当前 R-EQA 索引：
> frame_id → caption_embedding
> 
> 改进后的空间索引：
> spatial_cell(x,y) → {
>     "semantic_feature": 融合该位置所有帧的特征,
>     "best_frame_id": 视角最好的那帧,
>     "observation_count": 被观测次数
> }
> ```
>
> 检索时先查空间位置，再从该位置找最佳帧，**天然去冗余**。
>
> ------
>
> ### 启发二：时序信息是 Memory 的第一等公民
>
> **EMQA 的做法：**
>
> 它在每个空间格子 (i,j) 上额外存了一个 20 维的 multi-hot 向量，记录这个位置**在探索过程的哪个阶段被看到过**。这使得模型能回答 "first/last seen" 类问题。
>
> **对你的启发：**
>
> R-EQA 和 EfficientEQA 都完全丢弃了时序信息——Top-k 帧被检索出来后，直接拼成 prompt，顺序是随机的。
>
> 但时序信息对很多问题非常关键：
>
> ```
> 问题："厨房台面上的东西是之后被移走了吗？"
>         ↓
> 需要对比：早期帧 vs 晚期帧 → 时序信息是必须的
> 
> 问题："进门后第一个看到的家具是什么？"
>         ↓
> 需要：最早出现的帧 → 纯语义检索完全无效
> ```
>
> 更隐蔽的情况：即使问题没有明显时序词，时序信息也能帮助**去重和多样性**——优先选择在探索不同阶段拍摄的帧，而不是连续几帧都看同一个物体。
>
> 具体可以给每帧加一个时间戳权重：
> $$
> \text{score}(f_i) = \text{sim\_semantic}(q, c_i) + \lambda \cdot \text{temporal\_diversity}(f_i, \text{已选帧集合})
> $$
>
> ------
>
> ### 启发三：1D 压缩表示是 Memory 的死路
>
> **EMQA 的实验结论（最有力的部分）：**
>
> 它测试了三种把帧压缩成 1D 向量的基线：
>
> | 方法                      | IoU       |
> | ------------------------- | --------- |
> | EgoBuffer-Avg（平均池化） | 0.07      |
> | EgoBuffer-GRU             | 0.01      |
> | EgoBuffer-Attn（注意力）  | 0.12      |
> | **EMQA（2D空间地图）**    | **27.42** |
>
> **差距高达数百倍。** 论文的结论是：
>
> > 把场景压缩成 1D 向量，空间布局信息彻底消失，对于需要定位的任务根本无法使用。
>
> **对你的启发（最重要）：**
>
> R-EQA 的 caption embedding 本质上就是一种 1D 表示——把一帧的所有视觉信息压缩成一个向量。EMQA 告诉你，这个向量**保留不了空间关系**。
>
> 这意味着：对于 OpenEQA 里的 Spatial Understanding 类问题，无论 R-EQA 的检索做得多好，**送给 LLM 的都是没有空间结构的 caption**，LLM 根本无从推理"左边"、"之间"这类关系。
>
> 解决方向：Memory 的表示需要**保留结构**，而不是压缩成单个向量。最轻量的方案是在 caption 里显式注入空间关系：
>
> ```
> 当前 caption（1D 压缩，丢失空间）：
> "客厅里有沙发、电视和茶几"
> 
> 改进 caption（保留空间结构）：
> "电视在北墙中央(2.1m, 0.5m)，
>  沙发在电视正前方1.8m处，
>  茶几在沙发和电视之间"
> ```
>
> ------
>
> ### 启发四：Memory 构建和问答应该分离，但共享表示
>
> **EMQA 的架构设计：**
>
> ```
> 阶段1（离线）：SMNet 构建场景记忆
>     → 与任何具体问题无关
>     → 构建一次，回答任意多个问题
> 
> 阶段2（在线）：LingUNet 用问题查询记忆
>     → 问题通过语言条件化卷积核作用于记忆
>     → 记忆本身不变，查询方式随问题变化
> ```
>
> **对你的启发：**
>
> 这个分离架构给了你一个重要思路：**Memory 的表示和检索的 query 策略可以独立优化**。
>
> 具体到你的场景：
>
> ```
> Memory 层（离线构建，固定）：
> - 不只存 caption，还存空间坐标、物体标签、深度统计
> - 这一层尽量丰富，存储成本低
> 
> Query 层（在线，随问题变化）：
> - 根据问题类型动态选择检索策略
> - 空间类问题 → 查坐标索引
> - 语义类问题 → 查 caption embedding
> - 时序类问题 → 查时间戳索引
> ```
>
> 这样 Memory 只建一次，但可以被不同类型的问题高效查询，比 R-EQA 的"一刀切"余弦相似度灵活得多。
>
> ------
>
> ### 把四个启发整合成一个框架
>
> ```
> 【离线构建阶段】
> 每帧 RGB-D
>     ↓
>     ├─ VLM → caption（语义）
>     ├─ 深度图 + 位姿 → 空间坐标（几何）
>     ├─ 时间戳 → 探索阶段标记（时序）
>     └─ 物体检测 → 物体标签 + 位置（结构）
>          ↓
>     空间感知 Memory
>     {cell(x,y): semantic + temporal + structural}
> 
> 【在线检索阶段】
> 问题 Q
>     ↓
>     意图分析：
>     ├─ 含空间词？→ 空间索引检索
>     ├─ 含时序词？→ 时间戳检索  
>     └─ 纯语义？ → caption embedding 检索
>          ↓
>     多路结果融合
>          ↓
>     Top-k 帧（带空间结构的 caption）
>          ↓
>     LLM 生成答案
> ```
>
> ------
>
> ### 最值得立刻动手的一个点
>
> 如果只能选一个 EMQA 的启发落地，我建议是：
>
> **在 caption 生成时，用问题类型判断注入什么空间信息**
>
> 对 Spatial Understanding 类问题，在送给 LLM 之前，把检索到的帧的**相对空间关系**显式计算出来并注入 prompt：
>
> ```
> 检索到 frame_3（沙发）和 frame_7（电视）
>     ↓
> 利用两帧的位姿计算：
>     电视在沙发的东偏北方向，距离约 2.3m
>     ↓
> 最终 prompt：
> "[帧3] 沙发位于(1.2, 3.4)
>  [帧7] 电视位于(3.4, 3.6)，在沙发右侧约2.3m
>  问题：沙发和电视之间有什么？"
> ```
>
> 这一步**不需要改变检索流程**，只需要在 prompt 构建阶段加一个空间关系计算模块，但对 Spatial Understanding 类问题的提升可能非常显著，因为这类信息是 LLM 自己完全无法从 caption 中推断的。

### SeeingOnce

#### Structure

##### Model

![image-20260410092447004](https://raw.githubusercontent.com/reader001-guius/markdown-images/main/img/image-20260410092447004.png)

##### Algorithm

![image-20260410105511866](https://raw.githubusercontent.com/reader001-guius/markdown-images/main/img/image-20260410105511866.png)

![image-20260410105543217](https://raw.githubusercontent.com/reader001-guius/markdown-images/main/img/image-20260410105543217.png)

- Online&Offline：

  offline：先拿到整段视频，再决定选哪些帧。

  online：视频一边来，一边决定保留什么；做决定时，未来帧还没到。


#### Question：

- redundant token pruning时，存在额外preprocessing的开销，主要证明的是 computation efficiency，不是严格的实测部署时延。它有潜力降低总延迟，但论文目前没有把这个问题完全证实到 wall-clock latency

#### Inspiration

- frame retrieval是基于offline的dataset？
- token-level层面，用voxel去除冗余

### FOCUS

#### Structure

![image-20260410170935181](https://raw.githubusercontent.com/reader001-guius/markdown-images/main/img/image-20260410170935181.png)

- none-learned selector

  > FOCUS追求的是一种不同的范式：纯靠统计推断（Bandit）+ 现成编码器（BLIP）就能工作，换任何MLLM、换任何数据集都不用重新训练

### QCEKS

#### Structure

![image-20260411112627909](https://raw.githubusercontent.com/reader001-guius/markdown-images/main/img/image-20260411112627909.png)

使用contrastive learning来训练整个网络

![image-20260411114732012](https://raw.githubusercontent.com/reader001-guius/markdown-images/main/img/image-20260411114732012.png)

