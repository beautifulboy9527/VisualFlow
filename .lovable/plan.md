
# Inpainting工具优化与功能同步计划

## 问题分析

根据截图和反馈，需要解决以下问题：

1. **工具栏布局问题**
   - 当前工具栏按钮分布不合理，不符合常用的图像编辑软件习惯
   - 笔刷大小使用Slider组件但显示为开关样式（截图中显示Size后面是toggle开关样式）
   - 缩放控制位置需要调整

2. **提示词控制未实现**
   - 虽然QuickToolModal中有prompt输入，但实际发送到API时prompt处理不够完善
   - 用户涂抹完成后应该有明确的提示词输入区域

3. **其他页面功能同步**
   - Quick Tools功能应该在其他地方也能访问
   - 整体UI组件风格需要统一

---

## 实现方案

### 第一部分：InpaintingCanvas工具栏优化

重新设计工具栏布局，遵循专业图像编辑软件的操作习惯：

**新布局结构（从左到右）：**

```text
+-------------------------------------------------------------------------+
| [画笔][橡皮][平移]  |  Size [==滑块==] 80  |  [-] 100% [+]  |  重置 | 清除 |
+-------------------------------------------------------------------------+
```

**具体改动：**
- 工具选择按钮组放在最左侧（画笔、橡皮擦、平移）
- 笔刷大小控制紧随其后，使用更明显的滑块样式
- 缩放控制居中显示百分比
- 重置视图和清除涂抹放在右侧
- 按钮尺寸统一为h-9 w-9，图标为h-4.5 w-4.5
- 添加工具提示(tooltip)增强可用性

### 第二部分：提示词控制功能完善

当前流程中prompt输入已存在于QuickToolModal，但需要：

1. **增强可见性**：在InpaintingCanvas下方明确显示提示词输入区
2. **API调用优化**：确保maskData和prompt正确组合发送
3. **提示词模板**：添加快捷提示词建议（如"替换为蓝色"、"模糊处理"等）

**QuickToolModal改进：**
- Prompt输入区域放置在canvas组件下方
- 添加快捷提示词标签供用户快速选择
- 处理按钮与提示词区域视觉关联更清晰

### 第三部分：其他页面功能同步

**1. 主工作台集成：**
- 在Workbench页面的生成结果卡片上添加快捷编辑按钮
- 当有生成结果时，点击可直接进入对应Quick Tool进行二次编辑

**2. 统一访问入口：**
- Quick Tools在工作台初始状态显示（已实现）
- 在结果展示区域添加"快速编辑"入口

---

## 技术实现细节

### 文件修改清单

| 文件 | 修改内容 |
|------|----------|
| `src/components/workbench/InpaintingCanvas.tsx` | 重构工具栏布局，优化按钮组织，统一尺寸 |
| `src/components/workbench/QuickToolModal.tsx` | 增强提示词输入区域，添加快捷提示词标签 |
| `src/components/workbench/EnhancedResultCard.tsx` | 添加快速编辑按钮入口 |

### InpaintingCanvas工具栏新结构

```tsx
{/* 优化后的工具栏 */}
<div className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl border border-border/30">
  {/* 左侧：工具选择组 */}
  <div className="flex items-center gap-1 p-1 bg-background rounded-lg border border-border/50">
    <ToolButton tool="brush" icon={Brush} />
    <ToolButton tool="eraser" icon={Eraser} />
    <ToolButton tool="pan" icon={Move} />
  </div>

  {/* 分隔线 */}
  <div className="h-6 w-px bg-border/50" />

  {/* 笔刷大小 */}
  <div className="flex items-center gap-3">
    <span className="text-sm text-foreground-muted">Size</span>
    <Slider value={[brushSize]} min={5} max={100} className="w-24" />
    <span className="text-sm font-medium w-8">{brushSize}</span>
  </div>

  {/* 分隔线 */}
  <div className="h-6 w-px bg-border/50" />

  {/* 缩放控制 */}
  <div className="flex items-center gap-1">
    <Button variant="ghost" size="icon-sm" onClick={handleZoomOut}>
      <Minus className="h-4 w-4" />
    </Button>
    <span className="text-sm w-14 text-center">{Math.round(zoom * 100)}%</span>
    <Button variant="ghost" size="icon-sm" onClick={handleZoomIn}>
      <Plus className="h-4 w-4" />
    </Button>
  </div>

  {/* 右侧：操作按钮 */}
  <div className="flex items-center gap-2 ml-auto">
    <Button variant="outline" size="sm" onClick={resetView}>
      <RotateCcw className="h-4 w-4 mr-1.5" />
      Reset View
    </Button>
    <Button variant="outline" size="sm" onClick={clearMask} disabled={!hasMask}>
      <Eraser className="h-4 w-4 mr-1.5" />
      Clear Mask
    </Button>
  </div>
</div>
```

### 快捷提示词标签

为Inpainting添加常用编辑提示词：

```tsx
const quickPrompts = [
  { zh: '替换颜色', en: 'Change color' },
  { zh: '模糊处理', en: 'Add blur' },
  { zh: '移除对象', en: 'Remove object' },
  { zh: '添加倒影', en: 'Add reflection' },
  { zh: '改变材质', en: 'Change texture' },
];
```

---

## 预期效果

1. **工具栏更直观**：按钮分组清晰，操作逻辑符合用户习惯
2. **提示词功能完整**：用户可以输入详细的编辑指令或使用快捷标签
3. **功能入口统一**：从工作台任何位置都能方便访问Quick Tools
4. **视觉一致性**：按钮尺寸、间距、样式遵循设计规范

