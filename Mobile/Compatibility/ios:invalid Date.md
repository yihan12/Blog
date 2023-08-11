### 问题描述
> ios时间转时间戳出现invalid Date
> moment在ios时间转时间戳出现invalid Date


1. IOS上getTime()，getFullYear()等方法返回NaN
2. moment处理类似 2020/1/1的格式会invalid Date

### 解决
- 1
```
new Date("2018-02-15 20:30:00".replace(/-/g,'/')).getTime();
new Date("2018-02-15 20:30:00".replace(/-/g,'/')).getFullYear();
```
- 2
```
//moment使用2020/02/01的正规格式进行处理
moment('2018-02-15') // ios不支持会,invalid Date
moment('2018/02/15') // 需要转成此形式
```
