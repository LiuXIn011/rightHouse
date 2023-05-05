# app



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

安装egg-sequelize-auto自动生成model
egg-sequelize-auto无法标记field
sequelize-auto无法标记自增 autoIncrement: true,
使用生成model后手动设置autoIncrement
sequelize-auto -o "./modelAuto" -d testDB -h 192.168.2.39 -u root -p 3306 -x liuxin0128 -e mysql -C -t <表名> 