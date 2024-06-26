随便写个环图代码
```
<template>
    <div :id="'ring' + index" class="ring"></div>
</template>
<script>

export default {
    name: 'RingEchart',
    props: {
        list: {
            type: Array,
            default: () => []
        },
        index: Number
    },
    mounted() {
        this.formatOptions();
    },
    methods: {
        formatOptions() {
            let option = {
                tooltip: {
                    trigger: 'item'
                },
                grid: {
                    top: '5%',
                    let: '5%',
                    bottom: '5%'
                },
                tooltip: {
                    formatter: function(params) {
                        console.log(params);
                        return params.name.split('|')[0] + params.value;
                    }
                },
                legend: {
                    right: 0,
                    top: 12,
                    bottom: 20,
                    orient: 'vertical',
                    icon: 'circle',
                    itemWidth: 8,
                    itemGap: 15,
                    formatter: function(params) {
                        let colorMap = {
                            关键客户: 'b',
                            非关键客户: 'c',
                            非目标客户: 'd'
                        };
                        console.log(params.split('|')[0].replace(' ', ''), '000');
                        return [
                            `{a|${params.split('|')[0]}}`,
                            `{${colorMap[params.split('|')[0].replace(' ', '')]}|${params.split('|')[1] || '0%'}}`
                        ].join('');
                    },
                    textStyle: {
                        fontSize: 14,
                        rich: {
                            a: {
                                color: '#666666'
                            },
                            b: {
                                fontWeight: 'bold',
                                color: '#5573FA'
                            },
                            c: {
                                fontWeight: 'bold',
                                color: '#FFC700'
                            },
                            d: {
                                fontWeight: 'bold',
                                color: '#4CD1B6'
                            }
                        }
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['58%', '80%'],
                        center: ['28%', '50%'], // 调整这里的center属性
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        labelLine: {
                            show: false
                        },
                        data: this.list
                    }
                ],
                color: ['#5573FA', '#FFC700', '#4CD1B6']
            };
            this.initEchart(option);
        },
        initEchart(option) {
            let ring = document.getElementById('ring' + this.index);
            let echart = echarts.init(ring);
            echart.setOption(option);
        }
    },
    watch: {
        list() {
            this.formatOptions();
        }
    }
};
</script>
<style lang="scss" scoped>
.ring {
    width: 260px;
    height: 102px;
}
</style>


```