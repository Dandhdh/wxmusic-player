/*获取热门搜索*/
const getHotSearch = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=5381&jsonpCallback=hotSearchKeysmod_top_search&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0',
      data: {
        g_tk: 5381,
        jsonpCallback: 'hotSearchKeysmod_top_search',
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0
      },
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

// 歌手名、歌曲名搜索
// https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?is_xml=0&key=%E6%88%91%E4%BB%AC&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0
const search = (key) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?is_xml=0&format=jsonp&key=${key}g_tk=5381&jsonpCallback=SmartboxKeysCallbackmod_top_search3847&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`,
      data: {
        is_xml: 0,
        format: 'jsonp',
        key: key,
        g_tk: 5381,
        jsonpCallback: 'SmartboxKeysCallbackmod_top_search3847',
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0
      },
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 歌手名、歌曲名搜索
//https://c.y.qq.com/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&new_json=1&remoteplace=txt.yqq.song&searchid=66496436100067947&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=1&n=20&w=我们&g_tk=0&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0
const searchSong = (key,page) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://c.y.qq.com/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&new_json=1&remoteplace=txt.yqq.song&searchid=66496436100067947&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=1&n=20&w=${key}&g_tk=699536588&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0`,
      data: {
        ct: 24,
        qqmusic_ver: 1298,
        new_json: 1,
        remoteplace:'txt.yqq.song',
        searchid: 0,
        aggr: 1,
        cr: 1,
        catZhida: 1,
        lossless: 0,
        flag_qc: 0,
        p: page,   // 当前查询的页面
        n: 20,  // 每页的记录数
        w: key,
        g_tk: 699536588,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 0
      },
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

const getSongDetails = (mid) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg?songmid=${mid}&tpl=yqq_song_detail&format=jsonp&callback=getOneSongInfoCallback&g_tk=5381&jsonpCallback=getOneSongInfoCallback&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`,
      data: {
        songmid: mid,
        tpl: 'yqq_song_detail',
        format: 'jsonp',
        callback: 'getOneSongInfoCallback',
        g_tk: 5381,
        jsonpCallback: 'getOneSongInfoCallback',
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0
      },
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

const getSingerSongs = (singermid, startIndex) => {
  wx.showLoading()
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&needNewCode=0&platform=yqq&order=listen&begin=0&num=40&songstatus=1&singermid=${singermid}&jsonpCallback=callback`,
      data: {
        g_tk: 5381,
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        format: 'jsonp',
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        order: 'listen',
        begin: startIndex,
        num: 40,
        songstatus: 1,
        singermid: singermid,
        jsonpCallback: 'callback'
      },
      success: function (res) {
        wx.hideLoading()
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

const getTopList = () => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5&jsonpCallback=jp1'
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      success: function (res) {
        resolve(res)
      }
    })
  })
}

const getTopMusicList = (topid) => {
  const url = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&topid=${topid}&needNewCode=1&uin=0&tpl=3&page=detail&type=top&platform=h5&jsonpCallback=jp1`
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      success: function (res) {
        resolve(res)
      }
    })
  })
}

module.exports = {
  getHotSearch: getHotSearch,
  search: search,
  searchSong: searchSong,
  getSongDetails: getSongDetails,
  getSingerSongs: getSingerSongs,
  getTopList: getTopList,
  getTopMusicList: getTopMusicList
}