import React from "react";

import BoardTile from './BoardTile';
import { Tile } from "../Models/Tile";

type Props = {
  board: Array<Array<Tile>>,
  setTile: (tile: Tile |null, char: string) => void
}

export default class Board extends React.Component<Props> {
  renderTiles(row: Array<Tile>) {
    return row.map((tile, index: number) => {
      return <BoardTile
        key={`tile-${index}`}
        tile={tile}
        onChange={ (key: string) => this.props.setTile(tile, key) }
        />
    });
  }

  renderBoard() {
    return this.props.board.map((row, index) => {
      return <div key={`row-${index}`} className="my-row">{ this.renderTiles(row) }</div>
    });
  }

  render() {
    return (<div className="board">{ this.renderBoard() }</div>
    );
  }
}
