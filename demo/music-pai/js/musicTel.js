/**
 * 获取音乐列表模板
 * @returns {string}
 */
function getMusicTemplete(array){
  var html = "";
  for(var i=0;i<array.length;i++){
      html += `
          <li class="music-list-item" data-id="${array[i].id}">
              <div>
                  <h2 class="first-title">${array[i].name}</h2>
                  <p class="second-title">${array[i].author}</p>
              </div>
              <span><i></i></span>
          </li>
      `;
  }
  return html;
}

/**
 * 获取音乐详情页
 * @param {Object} curMusicItem 
 */
function getMusicSoundControlsTemplete(curMusicItem){
  return `<header class="music-listenning-header">
          <span><i class="icon icon-back"></i></span>
          <hgroup>
              <h1 class="listenning-name">${curMusicItem.name}</h1>
              <h3 class="listenning-author">${curMusicItem.author}</h3>
          </hgroup>
          <span><i class="icon icon-share"></i></span>
      </header>
      <div class="sound-record-container">
          <div class="outer-sound-record">
              <div class="outer-sound-light"></div>
              <div class="inner-sound-record">
                  <img src="${curMusicItem.Album.imgUrl}" alt="">
              </div>
          </div>
      </div>
      <div class="sound-controls-container">
          <div class="Kichiku">
              <div class="Kichiku-kedu">
                  <span><i class="icon icon-youb"></i></span>
              </div>
              <div class="Kichiku-title">
                  <span>慢</span>
                  <span>中</span>
                  <span>快</span>
              </div>
          </div>
          <div class="sound-range">
              <span class="sound-range-curTime">00:00</span>
              <div class="sound-range-comment">
                  <div class="circle-range"></div>
                  <div class="rectangle-range">
                      <div class="full-rectangle-range"></div>
                  </div>
              </div>
              <span class="sound-range-endTime">${curMusicItem.long}</span>
          </div>
          <div class="sound-controls">
              <span class="icon icon-soundRadom"></span>
              <span class="icon icon-soundforWard"></span>
              <span class="icon icon-soundState"></span>
              <span class="icon icon-soundNext"></span>
              <span class="icon icon-soundMore"></span>
          </div>
      </div>`;
}

/**
 * 下方播放控件
 * @param {Object} curMusicItem 
 */
function getMusicControlsTemplete(curMusicItem){
  return `<div class="music-info">
              <img class="music-info-AlbumImg" src="${curMusicItem.Album.imgUrl||"default.png"}" alt="">
              <hgroup>
                  <h1 class="first-title">${curMusicItem.name}</h1>
                  <h2 class="second-title">${curMusicItem.author}</h2>
              </hgroup>
          </div>
          <div class="music-control-circle">
              <i class="icon icon-start music-control-icon"></i>
          </div>
          `;
}