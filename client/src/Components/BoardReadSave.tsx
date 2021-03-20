import React from "react";

import { Tile } from "../Models/Tile";

type Props = {
  board: Array<Array<Tile>>,
  localStorageBoards: Array<{ name: string, board: string } >,
  currentBoardName: string,
  createNewBoard: (name: string) => void,
  setCurrentBoard: (name: string) => void,
  deleteBoard: (name: string) => void,
}

type States = {
  showModal: boolean,
  uSure: boolean,
}

export default class BoardReadSave extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showModal: false,
      uSure: false,
    };
  }

  myBoardNames(): Array<string> {
    return (this.props.localStorageBoards || []).map(localStorageBoard => localStorageBoard.name);
  }

  renderMyBoardNames() {
    return this.myBoardNames().map(name => {
      return (
        <option key={ name } value={ name }>{ name }</option>
      );
    }).concat(
      <option key="newBoard" value="newBoard_">**New Board**</option>
    );
  }

  handleBoardChange(event: any) { // HTMLSelectElement
    if (event.target.value === 'newBoard_') {
      this.openModal();
    } else {
      this.props.setCurrentBoard(event.target.value);
    }
  }

  openModal() {
    this.setState({
      showModal: true,
    });
  }

  closeModal() {
    this.setState({
      showModal: false,
    });
  }

  addNewBoardModal() {
    return (
      <div className={`modal ${this.state.showModal ? 'is-active' : ''}`}>
        <div className="modal-background"></div>
          <div className="modal-content is-white">
            <div className="box">
             
             <div className="field">
              <label className="label">Board name</label>
              <div className="control">
                <input id="newBoardName" className="input" type="text" placeholder="Board name" />
              </div>
              <p className="help">Dont use a name you already have, it will overwrite it</p>

              <div className="control">
                <button className="button is-primary" onClick={ () => this.createNewBoard() }>Create</button>
              </div>
             </div>

            </div>
          </div>
        <button className="modal-close is-large" aria-label="close" onClick={() => this.closeModal()}></button>
      </div>
    )
  }

  renderMyBoardDropdown() {
    return (
      <div className="select is-info">
        <select
          name="myboards"
          id="myboards"
          placeholder="hejsan"
          value={ this.props.currentBoardName || '' }
          onChange={ (event) => this.handleBoardChange(event) }
        >
          { this.renderMyBoardNames() }
        </select>
      </div>
    )
  }

  createNewBoard() {
    const newBoardName = (document.getElementById('newBoardName') as HTMLInputElement).value;
    // Kolla om namnet finns redan
    this.props.createNewBoard(newBoardName);
    this.closeModal();
  }

  onDelete() {
    if (this.state.uSure) {
      this.props.deleteBoard(this.props.currentBoardName);
      this.setState({ uSure: false });
    } else {
      this.setState({ uSure: true });

      const interval = window.setInterval(() => {
        this.setState({ uSure: false });
        window.clearInterval(interval);
      }, 3000);
    }
  }

  render() {
    return (
      <section>
        { this.addNewBoardModal() }
        <div className="">
            { this.renderMyBoardDropdown() }
            <button
              className="button is-secondary is-inline-block ml-2"
              onClick={() => this.onDelete() }
            >
              { this.state.uSure ? 'Are you sure?' : 'Delete board' }
            </button>
        </div>
      </section>
    );
  }
}
