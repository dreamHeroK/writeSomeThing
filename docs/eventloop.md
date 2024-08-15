## 从 Event Loop 谈 JS 的运行机制

注意，这里不谈<font color="#1990FE">可执行上下文，VO，scop chain</font>等概念（这些完全可以整理成另一篇文章了），这里主要是结合 `Event Loop` 来谈 JS 代码是如何执行的。

读这部分的前提是已经知道了JS引擎是单线程，而且这里会用到[上文](./bowserProcess.html)中的几个概念：（如果不是很理解，可以回头温习）
