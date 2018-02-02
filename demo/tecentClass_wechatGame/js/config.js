/**
 * Created by lenovo on 2018/2/2.
 */
const LEFT_IMG = "img/avatar-pai.jpg";
const RIGHT_IMG = "img/avatar-dnp.jpg";
const WECHAT_TITLE = "Faith";
const data = {
    messages: [{
        left: '我和你谁是傻逼？',
        right: [{
            text: '你是',
            score: -10,
            say:"cnm"
        }, {
            text: '我是',
            score: 10,
            say:""
        }, {
            text: '我们都是好吧',
            score: -5,
            say:"我能跟你一样吗？"
        }]
    }, {
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
    }],
    result: [{
        score: 8,
        tips: '传说中别人家的孩子，给你99分，多给一分怕你骄傲',
        say: '好孩子'
    }, {
        score: 4,
        tips: '来年继续加油吧！别人家的孩子都在虎视眈眈想超过你呢',
        say: '不错'
    }, {
        score: 0,
        tips: '恭喜你捡回一条命！来年可没这么好运了，保重。',
        say: '呵呵'
    }, {
        score: -10,
        tips: '请问你是怎么活过这么多年的？还是好好找个洞藏起来保命吧。',
        say: '这孩子怎么这样子'
    }]
}
