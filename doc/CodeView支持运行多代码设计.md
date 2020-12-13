[TOC]

# 原有方案
读取`.md`文档，将其分成`beforeHTML`、`code`、`afterHTML`三部分，其中`code`会被当作代码解析运行

# 新方案思路
文档内容拆解：
将文档内容拆分为`docs`和`codes`两部分，然后依次填入，`doc`使用`Markdown`解析渲染，`code`使用`CodeView`渲染
