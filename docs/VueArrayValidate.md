### 在 element 中实现数组表单校验

1. 定义好需要校验的表单数据
2. 定义好数组数据校验规则
3. 数组元素校验需要使用`[index][field]`prop 对应元素路径
4. 如果校验当前元素与上一个元素的关系，需要在数组元素校验规则中添加`[field]`属性
5. 在对应的数组元素 rules 上挂载校验规则

下面是校验数组元素例子

```
<el-form :model="formData">
     <div v-for="(item, index) in formData.list" :key="index">
        低于
        <el-form-item
            :prop="`list[${index}].date`"
            :rules="[
                {
                    ...fieldsRules.date[0],
                    prevDate: index > 0 ? formData.list[index - 1].date : 0
                }
            ]"
            ><el-input type="number" v-model="formData.list[index].date" /> </el-form-item
        >

    </div>
</el-form>

...
data(){
    return {
        formData: {
            list: [
                {
                    date: 100
                },
                {
                    date: 200
                }
            ]
        },
        fieldsRules: {
            date: [
                {
                       trigger: 'blur',
                       validator: (rule, value, callback) => {
                           console.log(value, 'valueee');
                           console.log(rule, 'rule');
                           if (!value) {
                               callback(new Error('请输入时间'));
                           }
                           if (Number(value) <= Number(rule.prevDate)) {
                               callback(new Error('时间必须大于上一条规则'));
                          }
                          callback();
                      }
                  }
              ]
         },
    }
}
```
