import React from "react";

type Props = {
  tiles: string,
  isLoading: boolean,
  setPlayerChars: (s: string) => void,
}

export default class PlayerTiles extends React.Component<Props> {
    componentDidUpdate() {
    const element = (document.getElementById('player_tiles') as HTMLInputElement)
    if (element) {
      element.value = this.props.tiles
    }
  }

  setPlayerChars() {
    this.props.setPlayerChars((document.getElementById('player_tiles') as HTMLInputElement).value)
  }

  solveButton() {
    const className = `button is-primary is-outlined ${ this.props.isLoading ? 'is-loading disabled' : '' }`
    return (
      <button
        className={ className }
        onClick={() => this.props.isLoading ? '' : this.setPlayerChars()}>
        Solve
      </button>
    )   
  }

  playerCharactersInput() {
    const className = `input ${ this.props.isLoading ? 'is-loading disabled' : '' }`;
    return (
      <input id="player_tiles" className={ className } type="text" placeholder="You characters" />
    )
  }

  render() {
    return (
      <section>
        <div className="columns">
          <div className="column">
            { this.playerCharactersInput() }
          </div>
          <div className="column">
            { this.solveButton() }
          </div>
        </div>
      </section>
    );
  }
}
