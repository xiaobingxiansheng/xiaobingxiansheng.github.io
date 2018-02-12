/**
 * Created by lenovo on 2018/2/7.
 */
/**
 * Failed to execute 'transaction' on 'IDBDatabase': One of the specified object stores was not found. 说明找不到存储对象空间
 * Uncaught InvalidStateError: Failed to execute 'transaction' on 'IDBDatabase': A version change transaction is running 更新数据库的事务在执行
 * Uncaught DOMException: Failed to execute 'createObjectStore' on 'IDBDatabase': The database is not running a version change transaction. 创建对象存储必须放在更新版本事务中
 * 数据库配置
 */
var DatabaseIndex = {
    'myMusic': {
        'primary': 'id',
        'other': ['src', 'name', 'author', 'Album']
    }
};

//数据库相关变量
var database;
var indexedDB = window.indexedDB || window.msIndexedDB || window.mozIndexedDB || window.webkitIndexedDB;


//打开数据库
function openIndexedDataBase(table_name,version,callback){
    var request = indexedDB.open(table_name,version);
    request.onsuccess = function(event){
        database = event.target.result;
        //矫正数据库版本
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
 * 初始化数据库表
 * 犯错的地方（for in索引项和数据位置搞反了）
 */
function initDataBaseTab(tab_name){
    var isExistDataBaseTab = typeof DatabaseIndex[tab_name]!='undefined'?true:false;
    if(isExistDataBaseTab){
        // 创建一个数据库存储对象
        var objectStore = database.createObjectStore(tab_name, {
            keyPath: 'id',
            autoIncrement: true
        });
        //主键
        objectStore.createIndex(DatabaseIndex[tab_name].primary, DatabaseIndex[tab_name].primary, {
            unique: true
        });
        //数据项
        for(var index in DatabaseIndex[tab_name].other){
            objectStore.createIndex(DatabaseIndex[tab_name].other[index], DatabaseIndex[tab_name].other[index]);
        }
    }
}


/**
 * 增、删、查、改数据库
 * 通过事务来操控数据库
 */
function selectDataBase(table_name,matches,callback){
    var isExistMatch = matches != null ? true : false;
    var transaction = database.transaction(table_name);
    var store = null;//对象存储空间
    var request = null;
    var count = 0;
    var resultArray = [];
    store = transaction.objectStore(table_name);
        //游标查询
        request = store.openCursor();
        request.onsuccess = function(event){
            var result = event.target.result;
            if (result) {//判断是否有下一项数据
                if(isExistMatch){//是否有查询条件
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

function pushIntoDataBase(table_name,array){
    var transaction = database.transaction(table_name, "readwrite");
// 打开存储对象
    var objectStore = transaction.objectStore(table_name);
// 添加到数据对象中
    var i=0,
        len=array.length;
    while(i<len){
        objectStore.add(array[i++]);
    }
}