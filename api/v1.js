var express = require('express');
var router = express.Router();
var https = require('https');
var axios = require('axios');   //调用axios


//如果接口有/banner 走这条路由
//轮播图
router.get('/banner', function (req, res, next) {
    //请求这个接口
    axios.get('https://ossweb-img.qq.com/images/clientpop/idata_ad/idata_ad_15282.js')
        .then(data => {
            // console.log(data.data);//正常的话这个就是接口数据了 你把这个对象直接res.send(data.data) 就ok
            //下面的无视
            let strLeft = data.data.indexOf('gAds15282=');
            let banner = JSON.parse(data.data.substr(strLeft + "gAds15282=".length));
            // console.log(banner.common);
            let bannerData = [];
            for (let i in banner.common) {
                let arr = {
                    // adId: +banner.common[i]['adId'],
                    bannerId: +banner.common[i]['bannerId'],
                    fName: banner.common[i]['Fname'],
                    imgUrl: banner.common[i]['imgUrl'],
                    popWidth: +banner.common[i]['popWidth'],
                    popHeight: +banner.common[i]['popHeight'],
                    beginTime: banner.common[i]['beginTime'],
                    endTime: banner.common[i]['endTime']
                };
                bannerData.push(arr)
            }
            bannerData = bannerData.slice(-5)
            res.send({
                code: 0,
                data: bannerData
            })

        }).then(err => {
        // console.log(err);
    })


});
//新闻资讯
router.get('/news', function (req, res, next) {
    let {page, num, target} = req.query;
    axios.get('https://apps.game.qq.com/cmc/zmMcnTargetContentList', {
        params: {
            page,
            num,
            target
        }
    }).then(data => {
        res.send(data.data)
    })
});
//英雄数据
router.get('/champion', function (req, res, next) {
    axios.get('https://lol.qq.com/biz/hero/champion.js?v=45')
        .then(data => {
            let strLeft = data.data.indexOf('{"keys":');
            // let strRight = data.data.indexOf('"version":"9.4.1"');
            res.send(
                JSON.parse(data.data.substring(strLeft, data.data.length - 1))
            )
            // console.log(strLeft + '{"keys":'.length, strRight);
        })

});
//英雄详情
router.get('/hero_Detail', function (req, res, next) {
    let {name} = req.query;
    axios.get(`https://lol.qq.com/biz/hero/${name}.js`)
        .then(data => {
            let strLeft = `LOLherojs.champion.${name}=`
            let strLeftSit = data.data.indexOf(strLeft) + strLeft.length;

            // console.log(strLeft);
            res.send(
                JSON.parse(data.data.substring(strLeftSit, data.data.length - 1))
            )
        })
});
//装备(所有)
router.get('/items', function (req, res, next) {
    axios.get('https://lol.qq.com/biz/hero/item.js')
        .then(data => {
            let strLeft = `var LOLitemjs=`
            let strLeftSit = data.data.indexOf(strLeft) + strLeft.length;
            res.send(
                JSON.parse(data.data.substring(strLeftSit, data.data.length - 1))
            )
        });

});
//英雄攻略
router.get('/detail/raiders', function (req, res, next) {
    let {page, pagesize, id} = req.query
    axios.get('https://apps.game.qq.com/lol/guide/apis', {
        params: {
            m0: 'searchGuides',
            a0: 'list',
            page: page,
            pagesize: pagesize,
            p3: id,

        }
    })
        .then(data => {
            res.send(
                data.data
            )
        })

});
//最新视频(推荐)
router.get('/video/rec', function (req, res, next) {
    // let {id, page, pagesize} = req.query
    axios.get('https://apps.game.qq.com/cmc/zmMcnRecommendedVideoCenterVideoList', {
        params: {
            reset: 0,
            num: 8
        }
    })
        .then(data => {
            res.send(
                data.data.data
            )
        })

});
//最新视频
router.get('/video/album', function (req, res, next) {
    let {page, pagesize, id} = req.query;
    console.log(page, pagesize, id);
    axios.get('https://apps.game.qq.com/wmp/v3.1', {
        params: {
            p0: 3,
            p1: 'searchKeywordsList',
            order: 'sIdxTime',
            type: 'iTag',
            source: 'web_pc',
            id,
            page,
            pagesize
        }
    })
        .then(data => {
            res.send(
                data.data
            )
        })

});
//队伍信息
router.get('/team_list', function (req, res, next) {
    axios.get('https://lpl.qq.com/web201612/data/LOL_MATCH2_TEAM_LIST.js')
        .then(data => {
            let strLeft = `var TeamList=`
            let strLeftSit = data.data.indexOf(strLeft) + strLeft.length;
            res.send(
                JSON.parse(data.data.substring(strLeftSit, data.data.length - 1))
            )
        })

});
//最强战力
router.get('/battle_score_lsit', function (req, res, next) {
    axios.get('https://lpl.qq.com/web201612/data/LOL_MATCH_ALL_BATTLE_SCORE_LIST.js')
        .then(data => {
            let strLeft = `var AllBattleScoreList=`
            let strLeftSit = data.data.indexOf(strLeft) + strLeft.length;
            res.send(
                JSON.parse(data.data.substring(strLeftSit, data.data.length - 1))
            )
        })

});
//玩家信息
router.get('/team_member_lsit', function (req, res, next) {
    axios.get('https://lpl.qq.com/web201612/data/LOL_MATCH2_TEAM_MEMBER_LIST.js')
        .then(data => {
            let strLeft = `var MemberList=`
            let strLeftSit = data.data.indexOf(strLeft) + strLeft.length;
            res.send(
                JSON.parse(data.data.substring(strLeftSit, data.data.length - 1))
            )
        })
});
//积分榜
router.get('/team_score_top', function (req, res, next) {
    axios.get('https://lpl.qq.com/web201612/data/LOL_MATCH2_GAME_115_1_GROUP_TEAM_SCORE_TOP.js')
        .then(data => {
            let strLeft = `var GroupTeamScores=`;
            let strLeftSit = data.data.indexOf(strLeft) + strLeft.length;
            res.send(
                JSON.parse(data.data.substring(strLeftSit, data.data.length - 1))
            )
        })
});
//fanart艺术馆
router.get('/fanartdata', function (req, res, next) {
    let {page, pagesize} = req.query;
    axios.get('http://apps.game.qq.com/lol/lolapi/recommendContentList.php', {
        params: {
            r1: 'fanartdata',
            a0: 'recommendList',
            page,
            pagesize
        }
    })
        .then(data => {
            let strLeft = `var fanartdata=`;
            let strLeftSit = data.data.indexOf(strLeft) + strLeft.length;
            res.send(
                JSON.parse(data.data.substring(strLeftSit, data.data.length - 1))
            )
        })
});
//推荐攻略
router.get('/strategy', function (req, res, next) {
    let {page, pagesize, p3} = req.query;
    console.log(page, pagesize, p3);
    axios.get('https://apps.game.qq.com/lol/guide/apis', {
        params: {
            m0: 'searchGuides',
            a0: 'list',
            r1: 'GuideList',
            page,
            pagesize,
            p3
        }
    })
        .then(data => {
            // console.log(data.data);
            let strLeft = `var GuideList=`;
            let strLeftSit = data.data.indexOf(strLeft) + strLeft.length;
            res.send(
                JSON.parse(data.data.substring(strLeftSit, data.data.length - 1))
            )
        })
});
//热门活动
router.get('/hot_activity', function (req, res, next) {
    let {page, pagesize, p3} = req.query;
    console.log(page, pagesize, p3);
    axios.get('https://ossweb-img.qq.com/images/clientpop/act/lol/lol_act_1_index.js')
        .then(data => {
            // console.log(data.data);
            let strLeft = `var action=`;
            let strLeftSit = data.data.indexOf(strLeft) + strLeft.length;
            res.send(
                JSON.parse(data.data.substring(strLeftSit, data.data.length - 1))
            )
        })
});
//热门专辑
router.get('/hot_album', function (req, res, next) {
    let {collectionid} = req.query;
    console.log(collectionid);
    axios.get('https://apps.game.qq.com/cmc/zmMcnCollectionList', {
        params: {
            collectionid,
            source: 'web_pc'
        }
    })
        .then(data => {
            res.send(
                data.data.data.result
            )
        })
});
//商城特惠
router.get('/preferential', function (req, res, next) {
    // let {collectionid} = req.query;
    // console.log(collectionid);
    axios.get('https://ossweb-img.qq.com/images/clientpop/act/lol/lol_act_4_index.js')
        .then(data => {
            let strLeft = `var match=`;
            let strLeftSit = data.data.indexOf(strLeft) + strLeft.length;
            res.send(
                JSON.parse(data.data.substring(strLeftSit, data.data.length - 1))
            )

        })
});
//fanart_detail
router.get('/fanart_detail', function (req, ress, next) {
    let {contentId} = req.query;

    var option = {
        hostname: 'apps.game.qq.com',
        path: `/cms/index.php?serviceType=lol&sAction=showDetail&sModel=Ugc&actId=16&iContentId=${contentId}`,
        headers: {
            'Referer': 'https://tr.lol.qq.com/fanart/detail.html?contentId=' + contentId
        }
    }
    https.get(option, function (res) {
        var chunks = [];
        res.on('data', function (chunk) {
            chunks.push(chunk);
        })
        res.on('end', function () {
            console.log(Buffer.concat(chunks).toString());
            let obj = JSON.parse(Buffer.concat(chunks).toString());
            obj.jData.data.sText = JSON.parse(obj.jData.data.sText)
            obj.jData.data.sParam1 = obj.jData.data.sParam1.replace(/&quot;/g, '"')
            obj.jData.data.sParam1 = obj.jData.data.sParam1.replace(/\"{/g, '{')
            obj.jData.data.sParam1 = obj.jData.data.sParam1.replace(/}\"/g, '}')
            // obj.jData.data.sParam1 = obj.jData.data.sParam1.replace(/\\\"/g, '"')
            obj.jData.data.sParam1 = obj.jData.data.sParam1.replace(/[\'\\\/\b\f\n\r\t]/g, '')
            obj.jData.data.sParam1 = JSON.parse(obj.jData.data.sParam1)
            ress.send(obj)
            // console.log();
        })
    })
});
//只看COS
router.get('/cos_list', function (req, res, next) {
    // let {collectionid} = req.query;
    // console.log(collectionid);
    axios.get('https://lol.qq.com/act/bentest/fanart_cos.js')
        .then(data => {
            let strLeft = `var COSList=`;
            let strLeftSit = data.data.indexOf(strLeft) + strLeft.length;
            let strRight = `};`
            let strRightSit = data.data.indexOf(strRight);
            let str = data.data.substring(strLeftSit, strRightSit + 1)
            // str = str.replace(/&quot;/g, "\"")
            str = str.replace(/\\\\/g, "")
            str = JSON.parse(str)
            str.msg.map((item, index) => {
                item.sText = JSON.parse(item.sText.replace(/&quot;/g, '"'))
                item.sParam1 = item.sParam1.replace(/"{/g, '{')
                item.sParam1 = item.sParam1.replace(/&quot;/g, '"')
                // item.sParam1 = item.sParam1.replace(/\\/g, '"')
                item.sParam1 = item.sParam1.substr(0, item.sParam1.length - 2) + '}'
            })
            res.send(
                // JSON.parse(str)
                // str.msg[0].sText
                str
            )

        })
});
//排行
router.get('/fanart_ranking', function (req, res, next) {
    let {d} = req.query;
    // console.log(collectionid);
    axios.get('https://apps.game.qq.com/lol/lolapi/zanStatistics.php', {
        params: {
            a0: d
        }
    })
        .then(data => {
            res.send(
                data.data
            )
        })
});
//作者
router.get('/fanart_author', function (req, res, next) {
    let {d, pagesize, page} = req.query;
    // console.log(collectionid);
    axios.get('https://apps.game.qq.com/lol/lolapi/authorContentList.php', {
        params: {
            a0: d,
            pagesize,
            page,
        }
    })
        .then(data => {
            res.send(
                data.data
            )
        })
});
//视频详情
router.get('/video_detail_info', function (req, res, next) {
    let {docid} = req.query;
    // console.log(collectionid);
    axios.get('https://apps.game.qq.com/cmc/zmMcnContentInfo', {
        params: {
            type: 1,
            docid
        }
    })
        .then(data => {
            res.send(
                data.data
            )
        })
});
//相关推荐
router.get('/video_recommend', function (req, res, next) {
    let {docid, num} = req.query;
    // console.log(collectionid);
    axios.get('https://apps.game.qq.com/cmc/zmMcnRecommendedRelatedPcVideoList', {
        params: {
            reset: 0,
            num,
            docid
        }
    })
        .then(data => {
            res.send(
                data.data
            )
        })
});
//每日热门
router.get('/video_hot_day', function (req, res, next) {
    axios.get('https://gicp.qq.com/wmp/data/js/v3/WMP_RANKLIST_GW_3.js')
        .then(data => {
            let strLeft = `var rankObj=`;
            let strLeftSit = data.data.indexOf(strLeft) + strLeft.length;
            res.send(
                JSON.parse(data.data.substring(strLeftSit, data.data.length - 1))
            )

        })
});
//召唤师技能
router.get('/summoner', function (req, res, next) {
    axios.get('https://lol.qq.com/biz/hero/summoner.js')
        .then(data => {
            let strLeft = `var LOLsummonerjs=`;
            let strLeftSit = data.data.indexOf(strLeft) + strLeft.length;
            res.send(
                JSON.parse(data.data.substring(strLeftSit, data.data.length - 1))
            )

        })
});
//召唤师技能
router.get('/searchBMatchInfo', function (req, res, next) {
    axios.get('https://apps.game.qq.com/lol/match/apis/searchBMatchInfo.php?pagesize=150&p1=115&p5=1&r1=BMatchList&v=45')
        .then(data => {
            // let strLeft = `var LOLsummonerjs=`;
            // let strLeftSit = data.data.indexOf(strLeft) + strLeft.length;
            res.send(
                data.data
            )

        })
});
module.exports = router;
