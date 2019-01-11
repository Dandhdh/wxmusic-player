const api = require('../../utils/api.js')
const songs = require('../../utils/song.js')
const app = getApp().globalData

const hotSearchNum = 10;  // 手动设置显示的热搜个数

Page({
  data: {
    hotSearch: [],
    result: false
  },
  onLoad: function () {
    this._getHotSearch()
    this.dealHistroySearch()
  },
  _getHotSearch: function () {
    api.getHotSearch().then((res) => {
      let res1 = res.data.replace('hotSearchKeysmod_top_search(', '')
      let res2 = JSON.parse(res1.substring(0, res1.length - 1))
      if (res2.code === 0) {
        let hotArr = res2.data.hotkey
        this.setData({
          hotSearch: hotArr.length > hotSearchNum ? hotArr.slice(0, hotSearchNum) : hotArr
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  // 进行搜索
  searchAction: function (event) {
    const keyWord = event.detail.value || event.currentTarget.dataset.txt
    const type = event.type   // 区分是按回车的搜索，还是输入过程中的自动搜索
    api.search(keyWord).then((res) => {
      let res1 = res.data.replace('SmartboxKeysCallbackmod_top_search3847(', '')
      let res2 = JSON.parse(res1.substring(0, res1.length - 1))
      this.dealData(res2.data)
      if(type != 'input'){   // 在输入过程中的字段，不进行历史记录
        this.dealHistroySearch(keyWord)
      }
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
    this.setData({
      histroySearch: histroy.reverse()
    })
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
    wx.navigateTo({
      url: '/pages/singer-detail/singer-detail'
    })
  },
  selectSong: function (event) {
    const mid = event.currentTarget.dataset.mid
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