# schedule

### mysql server建表语句

	CREATE TABLE `schedule` (
	`id`  int(11) NOT NULL AUTO_INCREMENT ,
	`content`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '事件内容' ,
	`address`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '事件地址' ,
	`people`  varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '事件执行者' ,
	`start_time`  timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '开始时间' ,
	`end_time`  timestamp NULL DEFAULT NULL COMMENT '结束时间' ,
	`create_time`  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间' ,
	`update_time`  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间' ,
	PRIMARY KEY (`id`)
	)
	ENGINE=InnoDB
	DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
	AUTO_INCREMENT=1
	ROW_FORMAT=DYNAMIC
	;

### 修改数据库链接
index.js文件

	const connection = mysql.createPool({
	    host: 'localhost',
	    user: 'root',
	    password: 'root',
	    database: 'schedule'
	});

### 安装运行
	npm install
	npm run start
