import React from "react";
import { MatchedWord } from "../Models/Tile";

type Props = {
  matchedWords: Array<MatchedWord>
  displayWord: (matchedWord: MatchedWord | null) => void,
  hideWord: (matchedWord: MatchedWord) => void,
  useWord: () => void
}

type State = {
  selectedMatchedWord: MatchedWord | null,
}

export default class WordTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      selectedMatchedWord: null,
    };
  }

  onSelectWord(matchedWord: MatchedWord) {
    if (this.state.selectedMatchedWord === matchedWord) {
      this.props.hideWord(matchedWord)
      this.setState({
        selectedMatchedWord: null,
      });
      this.props.displayWord(null);
    } else {
      if (this.state.selectedMatchedWord !== null) {
        this.props.hideWord(this.state.selectedMatchedWord);
      }

      this.setState({
        selectedMatchedWord: matchedWord,
      });
      this.props.displayWord(matchedWord);
    }
  }

  renderRows() {
    return this.props.matchedWords
      .filter((_, index) => index < 15)
      .map((matchedWord, index) => {
        const isSelected = matchedWord === this.state.selectedMatchedWord
        const className = isSelected ? 'is-selected' : ''
        return (
          <tr
            key={`${matchedWord.word}-${index}`}
            className={ className }
            onClick={() => this.onSelectWord(matchedWord)}
            >
            <td>{ matchedWord.points }</td>
            <td colSpan={2}>{ matchedWord.word }</td>
          </tr>
        );
      });
  }

  onUseWord() {
    if (this.state.selectedMatchedWord) {
      this.props.useWord();
    }
  }

  render() {
    return (
      <div className="">
        <table className="table is-striped is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>Points</th>
              <th>Word</th>
              <th><button className="button is-secondary" onClick={() => this.onUseWord()}>Use word</button></th>
            </tr>
          </thead>
          <tbody>
            { this.renderRows() }
          </tbody>
        </table>
      </div>
    );
  }
}
