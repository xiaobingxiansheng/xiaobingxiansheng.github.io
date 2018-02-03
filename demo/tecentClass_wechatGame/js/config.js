/**
 * Created by lenovo on 2018/2/2.
 */
const LEFT_IMG = "img/avatar-pai.jpg";
const RIGHT_IMG = "img/avatar-dnp.jpg";
const WECHAT_TITLE = "Faith";
const data = {
    messages: [ {
        left: '你是谁？',
        right: [{
            text: 'DNP',
            score: 10,
            say:"原来是你啊.. 有点不想给"
        }, {
            text: '卡哥',
            score: 20,
            say:"恩恩.．我知道了"
        }, {
            text: '毛毛',
            score: 10,
            say:"原来是垃圾毛啊.. 有点不想给"
        }]
    }, {
        left: '我和你谁是傻逼？',
        right: [{
            text: '你是',
            score: -10,
            say:"cnm"
        }, {
            text: '我是',
            score: 10,
            say:"你挺有自知之明的啊"
        }, {
            text: '我们都是好吧',
            score: -5,
            say:"我能跟你一样吗？"
        }]
    },{
        left: '问你一句.. 我帅不帅？',
        right: [{
            text: '嗯.. 帅',
            score: -10,
            say:"哇 这么敷衍"
        }, {
            text: '当然帅啦',
            score:20,
            say:"哎哟~ (得意脸)"
        }, {
            text: '....',
            score: -5,
            say:"..."
        }]
    }, {
        left: '我的球技如何？',
        right: [{
            text: '烂',
            score: -10,
            say:"哇.. 虐翻你"
        }, {
            text: '要向你学习啊',
            score: 10,
            say:"嗯..你真会说话 "
        }, {
            text: '一般般',
            score: -5,
            say:"欸."
        }]
    },{
        left: '你是不是偷偷地喜欢我？',
        right: [{
            text: '嗯..被你发现了',
            score: -10,
            say:"欸 心好累 每次听到你们在背后议论我帅.."
        }, {
            text: '傻逼吧你（ball）',
            score: 10,
            say:"。。。"
        }, {
            text: '额 没有啦',
            score: -5,
            say:"你眼睛有问题！"
        }]
    },{
        left: '我现在心里面想着0~100的数字是哪一个？',
        right: [{
            text: '嗯..62',
            score: -10,
            say:"错啦是12"
        }, {
            text: '12？？？',
            score: -10,
            say:"30啊笨"
        }, {
            text: '30',
            score: -10,
            say:"你好蠢啊.. 是62"
        }]
    }{
        left: '你希望作者做播放我音乐唱片的板块吗？',
        right: [{
            text: '嗯..可以啊',
            score: -10,
            say:"哼~ 想要我唱没那么容易"
        }, {
            text: '作者是谁啊',
            score: 0,
            say:"应该是.. 我干嘛告诉你"
        }, {
            text: '不要不要',
            score: -20,
            say:"系列 你不懂我的音乐"
        }]
    }],
    result: [{
        score: 40,
        tips: '您真的很会讲话！',
        prizeLevel:3
    }, {
        score: 20,
        tips: '恩.. 不错！以后要经常这样子哈~',
        prizeLevel:2
    }, {
        score: 0,
        tips: '欸.. 有点不想给.. ',
        prizeLevel:1
    }, {
        score: -20,
        tips: '不行啊..你这样也想要奖品?',
        prizeLevel:0
    }],
    prize:[
        [
            {
                type:'img',
                src:'img/avatar-ctw.jpg',
                tips:"赐你一个涛伟浓情脉脉的眼神，谁叫你这么吊"
            },{
                type:'img',
                src:'img/avatar-hfm.jpg',
                tips:"欸.. 怎么样？"
            },{
                type:'img',
                src:'img/avatar-ljx.jpg',
                tips:"你就想吧~"
            },{
                type:'img',
                src:'img/avatar-lyp.jpg',
                tips:"你就继续得瑟吧"
            }
        ],[
            {
                type:'img',
                src:'img/avatar-pai1.jpg',
                tips:"欸.. 你怪谁？"
            },{
                type:'img',
                src:'img/avatar-pai2.jpg',
                tips:"哈哈.. 这是我刚出道的时候"
            },{
                type:'img',
                src:'img/avatar-pai3.jpg',
                tips:"那时候我在给指甲油和灰指甲做广告.."
            }
        ],[
            {
                type:'img',
                src:'img/avatar-pai5.jpg',
                tips:"这是我跟我自己的员工一起打拼的照片，威风八面的我，拉下身段跟自己的员工进餐，颇有邻家男孩的感觉"
            },{
                type:'img',
                src:'img/avatar-pai4.jpg',
                tips:"嗯，这是我当时谈生意的照片，那时候我已经能独当一面了，跟各界名媛和成功人士一起共餐"
            }
        ],[
            {
                type:'img',
                src:'img/avatar-pai6.jpg',
                tips:"这是国际抽象意画师——DNP的作品，利用巧妙地眩晕特效，将浮沉于尘间的湃哥表现得脱俗不已，可谓名家之作！"
            },{
                type:'img',
                src:'img/avatar-pai7.jpg',
                tips:"2018年，世界陷入恐怖集团的威胁，五角大楼内已布满各式毁灭性的炸药，拆弹技术精湛的警方也束手无策，然而，挺身而出的派格却担下了拯救世界的伟大事业。每一次敲打都那么精心动魄！"
            },{
                type:'img',
                src:'img/avatar-pai8.jpg',
                tips:"这张我已经在飞机上了，是的，我已经带着我音乐唱片飞往我我梦想的地方，喵咪你看到了吗？日本的天空好美！"
            }
        ]
    ]
}


