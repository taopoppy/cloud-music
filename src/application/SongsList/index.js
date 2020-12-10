import React, { useCallback, useImperativeHandle } from 'react';
import { SongList, SongItem } from "./style";
import { getName } from '../../api/utils';
import PlayAll from '../../baseUI/playall/index.js'
const SongsList = React.forwardRef((props, refs)=> {

  const { collectCount, showCollect, songs } = props;

  const totalCount = songs.length;

  const selectItem = useCallback((e, index) => {
    console.log(index);
  }, [])

  useImperativeHandle(refs, () => ({
    // 向外暴露Singlist的selectItem方法
    playAllButtonClick(e) {
      selectItem(e, 0)
    }
  }));

  let songList = (list) => {
    let res = [];
    for(let i = 0; i < list.length; i++) {
      let item = list[i];
      res.push(
        <li key={item.id} onClick={(e) => selectItem(e, i)}>
          <span className="index">{i + 1}</span>
          <div className="info">
            <span>{item.name}</span>
            <span>
              { item.ar ? getName(item.ar): getName(item.artists) } - { item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      )
    }
    return res;
  };

  return (
    <SongList ref={refs} showBackground={props.showBackground}>
      <PlayAll
        totalCount={totalCount}
        showCollect={showCollect}
        collectCount={collectCount}
        selectItem={selectItem}
      />
      <SongItem>
        { songList(songs) }
      </SongItem>
    </SongList>
  )
});

export default React.memo(SongsList);