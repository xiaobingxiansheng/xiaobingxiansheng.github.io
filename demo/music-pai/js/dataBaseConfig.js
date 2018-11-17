/**
 * Created by lenovo on 2018/2/7.
 */
/**
 * Failed to execute 'transaction' on 'IDBDatabase': One of the specified object stores was not found. 说明找不到存储对象空间
 * Uncaught InvalidStateError: Failed to execute 'transaction' on 'IDBDatabase': A version change transaction is running 更新数据库的事务在执行
 * Uncaught DOMException: Failed to execute 'createObjectStore' on 'IDBDatabase': The database is not running a version change transaction. 创建对象存储必须放在更新版本事务中
 * 数据库配置获取
 */

function getTableNameFromObj(tab_name){
    var DatabaseIndex = {
        'myMusic': {
            'primary': 'id', // 主键
            'other': ['src', 'name', 'author', 'Album'] // 其他的字段
        }
    };
    return DatabaseIndex[tab_name];
}

//数据库相关变量
var database;
var indexedDB = window.indexedDB || window.msIndexedDB || window.mozIndexedDB || window.webkitIndexedDB;


//打开数据库
function openIndexedDataBase(table_name,version,callback){
    var request = indexedDB.open(table_name,version);
    request.onsuccess = function(event){
        database = event.target.result;
        //矫正数据库版本,防止因为版本不一造成报错
        if(database.version!=version){
            request = database.setVersion(version);
            request.onsuccess = function(){
                console.log('数据库版本矫正成功！');
            }
        }
        callback&&callback();
    };
    request.onerrer = function(event){
        alert("dataBaseError-"+event.target.errorCode);
    };
    //首次创建版本或更新版本之后都会触发这个
    request.onupgradeneeded = function(event){
        database = event.target.result;
        //初始化数据库表,必须放在这里，不然会报错
        initDataBaseTab(table_name);
    }
}

/**
 * 初始化数据库表及索引设置
 */
function initDataBaseTab(tab_name){
    var needCreateTable = getTableNameFromObj(tab_name);
    var isExistDataBaseTab = typeof needCreateTable!='undefined'?true:false;
    if(isExistDataBaseTab){
        // 创建一个数据库存储对象，并设置主键
        var objectStore = database.createObjectStore(tab_name, {
            keyPath: 'id',
            autoIncrement: true
        });
        //主键
        objectStore.createIndex(needCreateTable.primary, needCreateTable.primary, {
            unique: true
        });
        //数据项
        for(var other of needCreateTable.other){
            objectStore.createIndex(other, other);
        }
    }
}


/**
 * 增、删、查、改数据库
 * 通过事务来操控数据库
 */
function selectDataBase(table_name,matches,callback){
    var transaction = database.transaction(table_name);
    var request = null;//游标查询
    var count = 0;
    var resultArray = [];
    // 打开游标查询
    request = transaction.objectStore(table_name).openCursor();
    request.onsuccess = function(event){
        var result = event.target.result;
        if (result) {//判断是否有下一项数据
            if(matches){//是否有查询条件
                if(result.value[matches.key]===matches.value){//判断条件
                    matches.callback&&matches.callback();
                    resultArray.push(result.value);
                }
            }else{
                resultArray.push(result.value);
            }
            // 游标没有遍历完，继续
            result.continue();
            count++;
        } else {
            callback&&callback(resultArray,count);
        }
    };
    request.onerror = function (e) {
        console.log(e);
    }
}

/**
 * 添加数据
 * @param {*} table_name 
 * @param {*} array 
 */
function pushIntoDataBase(table_name,array){
    var objectStore = database.transaction(table_name, "readwrite")
    .objectStore(table_name);
    // 添加到数据对象中
    for(var item of array){
        objectStore.add(item);
    }
}