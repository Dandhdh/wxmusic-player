const api = require('../../utils/api.js')
const songs = require('../../utils/song.js')
const app = getApp().globalData

const hotSearchNum = 10;  // 手动设置显示的热搜个数

Page({
  data: {
    hotSearch: [],
    result: false,
    singers:[],     // 输入时查询到的歌手
    songs:[],       // 输入时查询的歌曲
    songsResult:[],  // confirm后查询的歌曲
    totalNum:0,   // 单曲查询结果的总数量
    keyWord:''
  },
  onLoad: function () {
    this._getHotSearch()
    this.dealHistroySearch()
  },
  _getHotSearch: function () {
    console.log('热搜')
    api.getHotSearch().then((res) => {
      let res1 = res.data.replace('hotSearchKeysmod_top_search(', '')
      let res2 = JSON.parse(res1.substring(0, res1.length - 1))
      if (res2.code === 0) {
        let hotArr = res2.data.hotkey
        console.log(this.data.hotSearch)
        this.setData({
          hotSearch: hotArr.length > hotSearchNum ? hotArr.slice(0, hotSearchNum) : hotArr
        })
        console.log(this.data.hotSearch)
      }
      console.log('2')
    }).catch((err) => {
      console.log(err)
    })
  },
  // 快速搜索（在搜索框数据期间进行的搜索）
  searchAction: function (event) {
    const keyWord = event.detail.value || event.currentTarget.dataset.txt
    this.setData({
      keyWord: keyWord || '',
      songsResult:[]
    })
    if(keyWord && keyWord!=''){
      api.search(keyWord).then((res) => {
        let res1 = res.data.replace('SmartboxKeysCallbackmod_top_search3847(', '')
        let res2 = JSON.parse(res1.substring(0, res1.length - 1))
        this.dealData(res2.data)
      }).catch((res) => {
        console.log(res)
      })
    }else{
      this._getHotSearch()
      this.dealHistroySearch()
      this.setData({
        result:false
      })
    }
    
  },

  // 单曲详细搜索
  searchSongAction: function(event){
    const keyWord = event.detail.value || event.currentTarget.dataset.txt || this.data.keyWord
    const _this = this
    api.searchSong(keyWord).then((res) => {
      // console.log(res.data)
      _this.setData({
        totalNum: res.data.data.song.totalnum
      })
      this.dealHistroySearch(keyWord)
      this.dealSongData(res.data.data.song.list)
    }).catch((res) => {
      console.log(res)
    })
  },
  dealData: function (data) {
    if (data) {
      this.setData({
        result: true
      })
      data.singer ? this.setData({
        singers: data.singer.itemlist
      }) : this.setData({
        singers: []
      })
      data.song ? this.setData({
        songs: data.song.itemlist
      }) : this.setData({
        songs: []
      })
    } else {
      this.setData({
        result: false
      })
    }
  },
  dealSongData: function (data) {
    console.log(data)
    if (data) {
      this.setData({
        result: true
      })
      this.setData({
        singers: [],
        songs: [],
        songsResult:data
      })
    } else {
      this.setData({
        result: false
      })
    }
  },
  dealHistroySearch: function (keyWord) {
    let histroy
    try {
      let local = wx.getStorageSync('histroySearch')
      if (local) {
        histroy = local
        if (keyWord && local.indexOf(keyWord) < 0) {
          local.push(keyWord)
          wx.setStorage({
            key: "histroySearch",
            data: local
          })
        }
      } else {
        if (keyWord) {
          histroy = [keyWord]
          wx.setStorage({
            key: "histroySearch",
            data: [keyWord]
          })
        }
      }
    } catch (e) {
      console.log(e)
    }
    if (histroy){
      this.setData({
        histroySearch: histroy.reverse()
      })
    }
  },
  deleteHistroySearch: function (event) {
    const keyWord = event.currentTarget.dataset.txt
    if (keyWord) {
      let local = wx.getStorageSync('histroySearch')
      let index = local.indexOf(keyWord)
      local.splice(index, 1)
      wx.setStorageSync('histroySearch', local)
    } else {
      wx.removeStorageSync('histroySearch')
    }
    this.setData({
      histroySearch: wx.getStorageSync('histroySearch')
    })
  },
  goSinger: function (event) {
    const detail = event.currentTarget.dataset
    app.selectsinger = {}
    app.selectsinger.id = detail.id
    app.selectsinger.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${app.selectsinger.id}.jpg?max_age=2592000`
    app.selectsinger.name = detail.name
    this.dealHistroySearch(detail.name)  // 存到历史记录
    wx.navigateTo({
      url: '/pages/singer-detail/singer-detail'
    })
  },
  selectSong: function (event) {
    const mid = event.currentTarget.dataset.mid
    const songname = event.currentTarget.dataset.songname
    // this.dealHistroySearch(songname,mid)  // 存到历史记录，看个人产品设计，是否需要缓存
    api.getSongDetails(mid).then((res) => {
      var res1 = res.data.replace('getOneSongInfoCallback(', '')
      var res2 = JSON.parse(res1.substring(0, res1.length - 1)).data[0]
      let song = {
        id: res2.id,
        mid: mid,
        singer: songs.filterSinger(res2.singer),
        name: res2.name,
        album: res2.album.name,
        duration: res2.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${res2.album.mid}.jpg?max_age=2592000`,
        musicId: res2.id
      }
      app.songlist = [song]
      app.currentIndex = 0
      wx.switchTab({
        url: '/pages/player/player'
      })
    }).catch(() => {})
  }
})