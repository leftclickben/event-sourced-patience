import { expect } from 'chai';
import { gameOver, maxChildLength, pressEnter, repeat, top } from '../../src/util';
import { GameStatus } from '../../src/types';
import { SinonStub, stub } from 'sinon';
import { Interface } from 'readline';

describe('General utility functions', () => {
  describe('Retrieving the top item from a list', () => {
    describe('Given an empty list', () => {
      it('Returns undefined', () => {
        expect(top([])).to.equal(undefined);
      });
    });

    describe('Given a list containing a single item', () => {
      it('Returns the item', () => {
        expect(top(['xyzzy'])).to.equal('xyzzy');
      });
    });

    describe('Given a list containing multiple items', () => {
      it('Returns the last item', () => {
        expect(top(['foo', 'bar', 'xyzzy'])).to.equal('xyzzy');
      });
    });
  });

  describe('Determining the maximum child length in a list of lists', () => {
    describe('Given a list containing all empty lists', () => {
      it('Returns 0', () => {
        expect(maxChildLength([
          [],
          [],
          []
        ])).to.equal(0);
      });
    });

    describe('Given a list containing all empty lists except for one', () => {
      it('Returns the length of the non-empty child list', () => {
        expect(maxChildLength([
          [],
          ['foo', 'bar'],
          []
        ])).to.equal(2);
      });
    });

    describe('Given a list containing multiple non-empty lists', () => {
      it('Returns the length of the longest child list', () => {
        expect(maxChildLength([
          ['xyzzy', 'twisty', 'maze', 'of', 'passages'],
          ['foo', 'bar'],
          ['first', 'second', 'third']
        ])).to.equal(5);
      });
    });
  });

  describe('Determining if the game is over', () => {
    describe('Given a status of "none"', () => {
      it('Returns false', () => {
        expect(gameOver(GameStatus.none)).to.equal(false);
      });
    });

    describe('Given a status of "forfeited"', () => {
      it('Returns true', () => {
        expect(gameOver(GameStatus.forfeited)).to.equal(true);
      });
    });

    describe('Given a status of "completed"', () => {
      it('Returns true', () => {
        expect(gameOver(GameStatus.completed)).to.equal(true);
      });
    });

    describe('Given a status of "inProgress"', () => {
      it('Returns false', () => {
        expect(gameOver(GameStatus.inProgress)).to.equal(false);
      });
    });
  });

  describe('Repeating text', () => {
    describe('Given a length only', () => {
      it('Returns a string of that many spaces', () => {
        expect(repeat(10)).to.equal('          ');
      });
    });

    describe('Given a length and a character', () => {
      it('Returns a string of that many copies of that character', () => {
        expect(repeat(5, '*')).to.equal('*****');
      });
    });
  });

  describe('Waiting for the user to press enter', () => {
    let question: SinonStub;

    beforeEach(async () => {
      question = stub().callsArg(1);
      await pressEnter({ question } as unknown as Interface);
    });

    it('Asks the user to press enter', () => {
      expect(question.calledOnce).to.equal(true);
      expect(question.firstCall.args[0]).to.equal('Press enter to continue...');
    });
  });
});
